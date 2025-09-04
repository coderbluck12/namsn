import { Timestamp } from 'firebase/firestore';

export interface Announcement {
  id?: string; // Document ID from Firestore
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // User ID
  createdByName: string; // User display name
  isImportant: boolean;
  isRead?: boolean;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  isImportant: boolean;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {}
