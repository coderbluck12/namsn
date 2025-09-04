import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc,
  serverTimestamp, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { Course, CreateCourseDto, UpdateCourseDto, getYoutubeThumbnailUrl } from '@/types/course';

const COURSES_COLLECTION = 'courses';

// Internal type for creating course documents in Firestore
interface CourseDocument extends CreateCourseDto {
  thumbnailUrl: string;
  duration: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  createdByName: string;
}

export const createCourse = async (
  data: CreateCourseDto,
  userId: string, 
  userName: string
): Promise<string> => {
  try {
    const now = Timestamp.now();
    const thumbnailUrl = getYoutubeThumbnailUrl(data.youtubeUrl);
    
    const courseData: CourseDocument = {
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      thumbnailUrl,
      duration: '0:00', // Default duration
      category: data.category,
      level: data.level,
      isPublished: data.isPublished,
      createdBy: userId,
      createdByName: userName,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, COURSES_COLLECTION), courseData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, data: UpdateCourseDto): Promise<void> => {
  try {
    const courseRef = doc(db, COURSES_COLLECTION, id);
    const updateData: UpdateCourseDto & { 
      updatedAt: Timestamp; 
      thumbnailUrl?: string; 
      duration?: string; 
    } = { 
      ...data,
      updatedAt: Timestamp.now() 
    };
    
    // If YouTube URL is being updated, update the thumbnail as well
    if (data.youtubeUrl) {
      updateData.thumbnailUrl = getYoutubeThumbnailUrl(data.youtubeUrl);
    }
    
    // Ensure duration is set if not provided
    if (!updateData.duration) {
      updateData.duration = '0:00';
    }
    
    // Create a new object with the updated timestamp
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    // Use type assertion to satisfy TypeScript
    await updateDoc(courseRef, updatePayload as Record<string, any>);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const courseRef = doc(db, COURSES_COLLECTION, id);
    await deleteDoc(courseRef);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Helper function to convert Firestore document to Course object
const convertDocumentToCourse = (doc: any): Course => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    youtubeUrl: data.youtubeUrl,
    thumbnailUrl: data.thumbnailUrl,
    duration: data.duration,
    category: data.category,
    level: data.level,
    isPublished: data.isPublished,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    createdBy: data.createdBy,
    createdByName: data.createdByName,
  };
};

export const getPublishedCourses = async (limitCount: number = 10): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocumentToCourse);
  } catch (error) {
    console.error('Error getting published courses:', error);
    throw error;
  }
};

export const getAllCourses = async (limitCount: number = 100): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocumentToCourse);
  } catch (error) {
    console.error('Error getting all courses:', error);
    throw error;
  }
};

export const getCoursesByCategory = async (category: string, limitCount: number = 10): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocumentToCourse);
  } catch (error) {
    console.error('Error getting courses by category:', error);
    throw error;
  }
};

export const getCoursesByLevel = async (level: 'Beginner' | 'Intermediate' | 'Advanced', limitCount: number = 10): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      where('level', '==', level),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocumentToCourse);
  } catch (error) {
    console.error('Error getting courses by level:', error);
    throw error;
  }
};

type ErrorCallback = (error: Error) => void;

export const subscribeToPublishedCourses = (
  onData: (courses: Course[]) => void,
  onError?: ErrorCallback,
  limitCount: number = 10
): Unsubscribe => {
  try {
    // Primary query with ordering
    const qWithOrder = query(
      collection(db, COURSES_COLLECTION),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(
      qWithOrder,
      (querySnapshot) => {
        const courses = querySnapshot.docs.map(convertDocumentToCourse);
        onData(courses);
      },
      (error) => {
        console.error('Firestore query error:', error.message);

        // 🔥 If it's an index error, fall back to simpler query (no orderBy)
        if (error.code === 'failed-precondition') {
          console.warn(
            'Missing Firestore index for (isPublished + createdAt). Falling back without orderBy.'
          );

          const qFallback = query(
            collection(db, COURSES_COLLECTION),
            where('isPublished', '==', true),
            limit(limitCount)
          );

          return onSnapshot(
            qFallback,
            (querySnapshot) => {
              const courses = querySnapshot.docs.map(convertDocumentToCourse);
              onData(courses);
            },
            (fallbackError) => {
              console.error('Fallback query also failed:', fallbackError);
              if (onError) onError(fallbackError);
            }
          );
        }

        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up courses subscription:', error);
    if (onError && error instanceof Error) onError(error);
    return () => {};
  }
};
