'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createCourse, updateCourse, checkMonthlyCourseLimitReached } from '@/lib/firebase/courseService';
import { Course, CreateCourseDto, UpdateCourseDto, getYoutubeThumbnailUrl } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

// Define categories as a constant to maintain consistency
const COURSE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Mathematics',
  'Other'
] as const;

interface AddCourseFormProps {
  initialData?: Partial<Course> | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isPublished: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  youtubeUrl?: string;
  category?: string;
  level?: string;
}

export function AddCourseForm({ initialData, onSuccess, onCancel }: AddCourseFormProps) {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    youtubeUrl: initialData?.youtubeUrl || '',
    category: initialData?.category || '',
    level: (initialData?.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
    isPublished: initialData?.isPublished || false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [monthlyLimit, setMonthlyLimit] = useState<{ count: number; limit: number; limitReached: boolean } | null>(null);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  // Check monthly limit on mount (only for new courses, not edits)
  useEffect(() => {
    const checkLimit = async () => {
      if (!currentUser || initialData?.id) return; // Skip check for edits
      
      setIsCheckingLimit(true);
      try {
        const limitInfo = await checkMonthlyCourseLimitReached(currentUser.uid);
        setMonthlyLimit(limitInfo);
      } catch (error) {
        console.error('Error checking monthly limit:', error);
      } finally {
        setIsCheckingLimit(false);
      }
    };

    checkLimit();
  }, [currentUser, initialData?.id]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    // YouTube URL validation
    if (!formData.youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'YouTube URL is required';
    } else {
      try {
        new URL(formData.youtubeUrl);
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!youtubeRegex.test(formData.youtubeUrl)) {
          newErrors.youtubeUrl = 'Please enter a valid YouTube URL';
        }
      } catch {
        newErrors.youtubeUrl = 'Please enter a valid URL';
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleYoutubeUrlChange = (value: string) => {
    handleInputChange('youtubeUrl', value);
    
    if (!value) return;
    
    // Auto-extract title if not set and URL is valid
    if (!formData.title && value) {
      try {
        const url = new URL(value);
        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
          const videoId = new URLSearchParams(url.search).get('v') || 
                         (url.hostname.includes('youtu.be') ? url.pathname.split('/').pop() : null);
          
          if (videoId) {
            setFormData(prev => ({
              ...prev,
              title: `Course: ${videoId}`,
              category: prev.category || COURSE_CATEGORIES[0]
            }));
          }
        }
      } catch (error) {
        console.error('Error processing YouTube URL:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to manage courses');
      return;
    }

    // Check monthly limit for new courses
    if (!initialData?.id) {
      try {
        const limitInfo = await checkMonthlyCourseLimitReached(currentUser.uid);
        if (limitInfo.limitReached) {
          toast.error(`Monthly limit reached! You can only post ${limitInfo.limit} videos per month. You've posted ${limitInfo.count} this month.`);
          return;
        }
      } catch (error) {
        console.error('Error checking limit:', error);
        toast.error('Failed to verify monthly limit. Please try again.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Generate thumbnail URL from YouTube URL
      const thumbnailUrl = getYoutubeThumbnailUrl(formData.youtubeUrl);
      
      if (initialData?.id) {
        // Update existing course
        const updateData: UpdateCourseDto = {
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          thumbnailUrl,
          duration: '0:00',
          category: formData.category,
          level: formData.level,
          isPublished: formData.isPublished
        };
        await updateCourse(initialData.id, updateData);
        toast.success('Course updated successfully');
      } else {
        // Create new course
        const createData: CreateCourseDto = {
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          category: formData.category,
          level: formData.level,
          isPublished: formData.isPublished
        };
        await createCourse(
          createData,
          currentUser.uid,
          currentUser.displayName || 'Admin'
        );
        toast.success('Course added successfully');
        
        // Refresh limit info after successful creation
        const newLimitInfo = await checkMonthlyCourseLimitReached(currentUser.uid);
        setMonthlyLimit(newLimitInfo);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        youtubeUrl: '',
        category: '',
        level: 'Beginner',
        isPublished: false,
      });
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error(initialData?.id ? 'Error updating course:' : 'Error adding course:', error);
      toast.error(`Failed to ${initialData?.id ? 'update' : 'add'} course. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            {initialData?.id ? 'Edit Course' : 'Add New Course'}
          </h2>
          {!initialData?.id && monthlyLimit && (
            <p className="text-sm text-muted-foreground mt-1">
              {monthlyLimit.limitReached ? (
                <span className="text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Monthly limit reached ({monthlyLimit.count}/{monthlyLimit.limit} videos this month)
                </span>
              ) : (
                <span className="text-green-600">
                  {monthlyLimit.count}/{monthlyLimit.limit} videos posted this month
                </span>
              )}
            </p>
          )}
          {isCheckingLimit && (
            <p className="text-sm text-muted-foreground mt-1">Checking monthly limit...</p>
          )}
        </div>
      </div>
      
      {!initialData?.id && monthlyLimit?.limitReached && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Monthly Limit Reached</h3>
              <p className="text-sm text-red-700 mt-1">
                You have reached the maximum limit of {monthlyLimit.limit} videos per month. 
                You can post more videos starting next month.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Course Title
            </label>
            <Input
              id="title"
              placeholder="Enter course title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium mb-2">
              YouTube URL
            </label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.youtubeUrl}
              onChange={(e) => handleYoutubeUrlChange(e.target.value)}
              className={errors.youtubeUrl ? 'border-red-500' : ''}
            />
            {errors.youtubeUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select 
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-2">
              Difficulty Level
            </label>
            <Select 
              value={formData.level}
              onValueChange={(value) => handleInputChange('level', value as 'Beginner' | 'Intermediate' | 'Advanced')}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner 👶</SelectItem>
                <SelectItem value="Intermediate">Intermediate 🚀</SelectItem>
                <SelectItem value="Advanced">Advanced 🔥</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter course description"
              className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => handleInputChange('isPublished', checked === true)}
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="isPublished" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Publish this course
              </label>
              <p className="text-sm text-muted-foreground">
                Published courses will be visible to all users
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            type="submit" 
            disabled={isSubmitting || (!initialData?.id && monthlyLimit?.limitReached)}
            className="flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialData?.id ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span className="flex items-center">
                {initialData?.id ? 'Update Course' : 'Create Course'}
              </span>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}