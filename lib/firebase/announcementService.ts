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
import { Announcement, CreateAnnouncementDto, UpdateAnnouncementDto } from '@/types/announcement';

const ANNOUNCEMENTS_COLLECTION = 'announcements';

export const createAnnouncement = async (data: CreateAnnouncementDto, userId: string, userName: string): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), {
      ...data,
      createdBy: userId,
      createdByName: userName,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, data: UpdateAnnouncementDto): Promise<void> => {
  try {
    const announcementRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
    await updateDoc(announcementRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    const announcementRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
    await deleteDoc(announcementRef);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

export const getAnnouncements = async (limitCount: number = 10): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Announcement));
  } catch (error) {
    console.error('Error getting announcements:', error);
    throw error;
  }
};

export const getImportantAnnouncements = async (limitCount: number = 5): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where('isImportant', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Announcement));
  } catch (error) {
    console.error('Error getting important announcements:', error);
    throw error;
  }
};

type ErrorCallback = (error: Error) => void;

export const subscribeToAnnouncements = (
  onData: (announcements: Announcement[]) => void,
  onError?: ErrorCallback,
  limitCount: number = 10
): Unsubscribe => {
  const q = query(
    collection(db, ANNOUNCEMENTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      try {
        const announcements = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Announcement));
        onData(announcements);
      } catch (error) {
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('Error in subscribeToAnnouncements:', error);
      }
    }
  );

  return unsubscribe;
};

export const subscribeToImportantAnnouncements = (
  onData: (announcements: Announcement[]) => void,
  onError?: ErrorCallback,
  limitCount: number = 5
): Unsubscribe => {
  try {
    const qWithOrder = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      where('isImportant', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(
      qWithOrder,
      (querySnapshot) => {
        const announcements = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Announcement));
        onData(announcements);
      },
      (error) => {
        console.error('Firestore error (important announcements):', error.message);

        if (error.code === 'failed-precondition') {
          console.warn('Missing index. Falling back without orderBy.');

          const qFallback = query(
            collection(db, ANNOUNCEMENTS_COLLECTION),
            where('isImportant', '==', true),
            limit(limitCount)
          );

          return onSnapshot(
            qFallback,
            (querySnapshot) => {
              const announcements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              } as Announcement));
              onData(announcements);
            },
            (fallbackError) => {
              console.error('Fallback also failed:', fallbackError);
              if (onError) onError(fallbackError);
            }
          );
        }

        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up subscription for important announcements:', error);
    if (onError && error instanceof Error) onError(error);
    return () => {};
  }
};
