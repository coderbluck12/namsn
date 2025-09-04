import { Timestamp } from 'firebase/firestore';

export interface Material {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedAt: Date | Timestamp;
}

export interface CreateMaterialDto {
  title: string;
  courseCode: string;
  courseName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

export interface UpdateMaterialDto {
  title?: string;
  courseCode?: string;
  courseName?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: string;
}
