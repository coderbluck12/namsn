'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Course } from '@/types/course';
import { subscribeToPublishedCourses } from '@/lib/firebase/courseService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

// ===================== //
//   User Dashboard Page //
// ===================== //

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  // Load published courses only
  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const unsubscribe = subscribeToPublishedCourses(
          (courses) => {
            if (isMounted) {
              setCourses(courses);
              setError(null);
            }
          },
          (error) => {
            console.error('Error in courses subscription:', error);
            if (isMounted) {
              setError('Failed to load courses. Please try refreshing the page.');
            }
          }
        );

        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error('Error loading courses:', error);
        if (isMounted) {
          setError('Failed to load courses. Please try refreshing the page.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();
    
    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setTimeout(() => {
      document.getElementById('course-player')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-red-500 text-center">
          <h2 className="text-lg font-semibold mb-2">Error Loading Courses</h2>
          <p>{error}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Browse and watch available courses
        </p>
      </div>

      {/* Course List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course.id} 
              className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                selectedCourse?.id === course.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => handleCourseSelect(course)}
            >
              <div className="relative aspect-video bg-muted">
                <img
                  src={course.thumbnailUrl || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration || '0:00'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{course.category || 'General'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No courses available</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later for new courses
            </p>
          </div>
        )}
      </div>

      {/* Course Player Section */}
      {selectedCourse && selectedCourse.youtubeUrl && extractYoutubeId(selectedCourse.youtubeUrl) && (
        <div id="course-player" className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${extractYoutubeId(selectedCourse.youtubeUrl)}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedCourse.title}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedCourse.level && (
                <span className="px-2 py-1 bg-muted rounded-md text-xs">
                  {selectedCourse.level}
                </span>
              )}
              <span>{selectedCourse.duration || '0:00'}</span>
            </div>
            <p className="text-muted-foreground">{selectedCourse.description}</p>
          </div>
        </div>
      )}

      {/* Invalid YouTube URL */}
      {selectedCourse && selectedCourse.youtubeUrl && !extractYoutubeId(selectedCourse.youtubeUrl) && (
        <div id="course-player" className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
          <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PlayCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Invalid YouTube URL</p>
              <p className="text-sm">Please contact support to fix this course.</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedCourse.level && (
                <span className="px-2 py-1 bg-muted rounded-md text-xs">
                  {selectedCourse.level}
                </span>
              )}
              <span>{selectedCourse.duration || '0:00'}</span>
            </div>
            <p className="text-muted-foreground">{selectedCourse.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to extract YouTube video ID safely
function extractYoutubeId(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  
  return '';
}
