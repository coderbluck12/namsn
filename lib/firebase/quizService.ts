import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'quiz-registrations';

export interface QuizRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  levelOfStudy: string;
  statementOfInterest: string;
  enthusiasmRating: number;
}

export interface QuizRegistration extends QuizRegistrationData {
  id: string;
  status: 'pending' | 'selected' | 'rejected';
  submittedAt: Date | null;
}

export async function submitQuizRegistration(data: QuizRegistrationData): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    status: 'pending',
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllRegistrations(): Promise<QuizRegistration[]> {
  const q = query(collection(db, COLLECTION), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const raw = d.data();
    return {
      id: d.id,
      fullName: raw.fullName,
      email: raw.email,
      phone: raw.phone,
      levelOfStudy: raw.levelOfStudy,
      statementOfInterest: raw.statementOfInterest,
      enthusiasmRating: raw.enthusiasmRating,
      status: raw.status,
      submittedAt: raw.submittedAt?.toDate() ?? null,
    } as QuizRegistration;
  });
}

export async function updateRegistrationStatus(
  id: string,
  status: 'pending' | 'selected' | 'rejected'
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { status });
}

export async function pickRandomWinners(count: number): Promise<string[]> {
  const all = await getAllRegistrations();
  const pending = all.filter((r) => r.status === 'pending');
  const shuffled = [...pending].sort(() => Math.random() - 0.5);
  const winners = shuffled.slice(0, count);
  await Promise.all(winners.map((w) => updateRegistrationStatus(w.id, 'selected')));
  return winners.map((w) => w.id);
}
