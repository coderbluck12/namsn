import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
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
import { Material, CreateMaterialDto, UpdateMaterialDto } from '@/types/material';

const MATERIALS_COLLECTION = 'materials';

export const createMaterial = async (data: CreateMaterialDto, userId: string, userName: string): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
      ...data,
      uploadedBy: userId,
      uploadedByName: userName,
      uploadedAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

export const updateMaterial = async (id: string, data: UpdateMaterialDto): Promise<void> => {
  try {
    const materialRef = doc(db, MATERIALS_COLLECTION, id);
    await updateDoc(materialRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string): Promise<void> => {
  try {
    const materialRef = doc(db, MATERIALS_COLLECTION, id);
    await deleteDoc(materialRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

export const getRecentMaterials = async (limitCount: number = 5): Promise<Material[]> => {
  try {
    const q = query(
      collection(db, MATERIALS_COLLECTION),
      orderBy('uploadedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        courseCode: data.courseCode || '',
        courseName: data.courseName || '',
        fileUrl: data.fileUrl || '',
        fileType: data.fileType || 'PDF',
        fileSize: data.fileSize || '0 KB',
        uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : new Date()
      } as Material;
    });
  } catch (error) {
    console.error('Error getting recent materials:', error);
    throw error;
  }
};

export const getMaterialsByCourse = async (courseId: string): Promise<Material[]> => {
  try {
    const q = query(
      collection(db, MATERIALS_COLLECTION),
      where('courseId', '==', courseId),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Material));
  } catch (error) {
    console.error('Error getting materials by course:', error);
    throw error;
  }
};

type ErrorCallback = (error: Error) => void;

export const subscribeToRecentMaterials = (
  onData: (materials: Material[]) => void,
  onError?: ErrorCallback,
  limitCount: number = 5
): Unsubscribe => {
  try {
    const q = query(
      collection(db, MATERIALS_COLLECTION),
      orderBy('uploadedAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const materials = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            courseCode: data.courseCode || '',
            courseName: data.courseName || '',
            fileUrl: data.fileUrl || '',
            fileType: data.fileType || 'PDF',
            fileSize: data.fileSize || '0 KB',
            uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : new Date()
          } as Material;
        });
        onData(materials);
      },
      (error) => {
        console.error('Error in materials subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up materials subscription:', error);
    if (onError && error instanceof Error) onError(error);
    // Return a no-op function as fallback
    return () => {};
  }
};
