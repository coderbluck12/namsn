import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  serverTimestamp, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
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

// Type for Firestore document data
interface FirestoreCourse extends Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const convertDocumentToCourse = (doc: QueryDocumentSnapshot<DocumentData>): Course => {
  const data = doc.data() as FirestoreCourse;
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
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt as unknown as string | number),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt as unknown as string | number),
    createdBy: data.createdBy,
    createdByName: data.createdByName,
  };
};

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
    const updateData: Partial<UpdateCourseDto> & { 
      updatedAt?: Timestamp; 
      thumbnailUrl?: string; 
      duration?: string; 
    } = { 
      ...data
    };
    
    // If YouTube URL is being updated, update the thumbnail as well
    if (data.youtubeUrl) {
      updateData.thumbnailUrl = getYoutubeThumbnailUrl(data.youtubeUrl);
    }
    
    // Ensure duration is set if not provided
    if (!updateData.duration) {
      updateData.duration = '0:00';
    }
    
    // Add server timestamp
    updateData.updatedAt = serverTimestamp() as Timestamp;
    
    await updateDoc(courseRef, updateData);
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

export const getPublishedCourses = async (limitCount: number = 10): Promise<Course[]> => {
  try {
    const coursesCollection = collection(db, COURSES_COLLECTION);
    const q = query(
      coursesCollection,
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDocumentToCourse(doc));
  } catch (error) {
    console.error('Error getting published courses:', error);
    throw error;
  }
};

export const getAllCourses = async (limitCount: number = 100): Promise<Course[]> => {
  try {
    const coursesCollection = collection(db, COURSES_COLLECTION);
    const q = query(
      coursesCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDocumentToCourse(doc));
  } catch (error) {
    console.error('Error getting all courses:', error);
    throw error;
  }
};

export const getCoursesByCategory = async (category: string, limitCount: number = 10): Promise<Course[]> => {
  try {
    const coursesCollection = collection(db, COURSES_COLLECTION);
    const q = query(
      coursesCollection,
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDocumentToCourse(doc));
  } catch (error) {
    console.error('Error getting courses by category:', error);
    throw error;
  }
};

export const getCoursesByLevel = async (level: 'Beginner' | 'Intermediate' | 'Advanced', limitCount: number = 10): Promise<Course[]> => {
  try {
    const coursesCollection = collection(db, COURSES_COLLECTION);
    const q = query(
      coursesCollection,
      where('level', '==', level),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDocumentToCourse(doc));
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
    const coursesCollection = collection(db, COURSES_COLLECTION);
    
    // Try query without orderBy to avoid index requirement
    // We'll sort on the client side instead
    const q = query(
      coursesCollection,
      where('isPublished', '==', true),
      limit(limitCount)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const courses = querySnapshot.docs.map(doc => convertDocumentToCourse(doc));
          
          // Sort by createdAt on the client side
          const sortedCourses = courses.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as any);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as any);
            return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
          });
          
          onData(sortedCourses);
        } catch (conversionError) {
          console.error('Error converting documents to courses:', conversionError);
          if (onError && conversionError instanceof Error) {
            onError(conversionError);
          }
        }
      },
      (error) => {
        console.error('Error subscribing to courses:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up courses subscription:', error);
    if (onError && error instanceof Error) onError(error);
    return () => {};
  }
};

// Check if user has reached monthly course creation limit (5 per month)
export const checkMonthlyCourseLimitReached = async (userId: string): Promise<{ limitReached: boolean; count: number; limit: number }> => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startTimestamp = Timestamp.fromDate(startOfMonth);
    
    const coursesCollection = collection(db, COURSES_COLLECTION);
    const q = query(
      coursesCollection,
      where('createdBy', '==', userId),
      where('createdAt', '>=', startTimestamp)
    );
    
    const querySnapshot = await getDocs(q);
    const count = querySnapshot.size;
    const limit = 5;
    
    return {
      limitReached: count >= limit,
      count,
      limit
    };
  } catch (error) {
    console.error('Error checking monthly course limit:', error);
    throw error;
  }
};