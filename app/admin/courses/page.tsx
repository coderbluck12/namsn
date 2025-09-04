'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Course } from '@/types/course';
import { getAllCourses, deleteCourse } from '@/lib/firebase/courseService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { AddCourseForm } from './AddCourseForm';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Load courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await getAllCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCourses();
  }, []);

  // Handle delete course
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteCourse(id);
        toast.success('Course deleted successfully');
        loadCourses(); // Refresh the list
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };

  // Handle edit course
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowAddForm(true);
  };

  // Handle form success
  const handleSuccess = () => {
    setShowAddForm(false);
    setEditingCourse(null);
    loadCourses();
  };

  if (loading && !showAddForm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Courses</h1>
          <p className="text-muted-foreground">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} total
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setEditingCourse(null);
            setShowAddForm(!showAddForm);
          }} 
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Add New Course'}
        </Button>
      </div>

      {/* Add/Edit Course Form */}
      {(showAddForm || editingCourse) && (
        <AddCourseForm 
          initialData={editingCourse}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowAddForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* Courses Table */}
      {!showAddForm && (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={course.thumbnailUrl || '/placeholder.svg'} 
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {course.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {course.level}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {course.isPublished ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <Eye className="mr-1 h-3 w-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            <EyeOff className="mr-1 h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-sm text-muted-foreground">
                        {format(course.createdAt as Date, 'MMM d, yyyy')}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(course)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No courses found. Create your first course to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
