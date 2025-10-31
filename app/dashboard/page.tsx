'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, GraduationCap, BookOpen, Clock, FileText, Calendar, Bell } from 'lucide-react';
import { Announcement } from '@/types/announcement';
import { Material } from '@/types/material';
import { subscribeToAnnouncements } from '@/lib/firebase/announcementService';
import { subscribeToRecentMaterials } from '@/lib/firebase/materialService';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const upcomingClasses = [
  {
    id: 1,
    course: 'CSC 101',
    time: '09:00 AM - 10:30 AM',
    room: 'Building A, Room 101',
  },
  {
    id: 2,
    course: 'MTS 211',
    time: '11:00 AM - 12:30 PM',
    room: 'Building B, Room 205',
  },
];

// Recent materials will be fetched from Firebase

export default function DashboardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<Material[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { currentUser } = useAuth();

  // Calculate unread announcements count
  const unreadAnnouncements = announcements.filter(announcement => 
    announcement.isRead === false || announcement.isRead === undefined
  ).length;

  // Load recent announcements
  useEffect(() => {
    const onData = (data: Announcement[]) => {
      setAnnouncements(data);
      setIsLoadingAnnouncements(false);
    };

    const onError = (err: Error) => {
      console.error('Error loading announcements:', err);
      setIsLoadingAnnouncements(false);
    };

    const unsubscribe = subscribeToAnnouncements(onData, onError, 5); // Show 5 most recent announcements

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load recent materials
  useEffect(() => {
    const onMaterialsData = (materials: Material[]) => {
      setRecentMaterials(materials);
      setIsLoadingMaterials(false);
    };

    const onError = (err: Error) => {
      console.error('Error loading materials:', err);
      setIsLoadingMaterials(false);
    };

    const unsubscribe = subscribeToRecentMaterials(onMaterialsData, onError, 5); // Show 5 most recent materials

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch user data (level and first name)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setIsLoadingLevel(false);
        setIsLoadingUser(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserLevel(userData.level || 'Not set');
          setFirstName(userData.firstName || currentUser.displayName?.split(' ')[0] || 'Student');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserLevel('Error');
        setFirstName('Student');
      } finally {
        setIsLoadingLevel(false);
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {isLoadingUser ? (
            'Dashboard'
          ) : (
            `Welcome back, ${firstName}!`
          )}
        </h1>
        <p className="mt-2 text-sm text-gray-600">Here&apos;s what&apos;s happening with your courses today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Level</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isLoadingLevel ? (
                        <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
                      ) : userLevel ? (
                        `${userLevel} Level`
                      ) : (
                        'Not set'
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pay Dues</dt>
                  {/* <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">12</div>
                  </dd> */}
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="https://v1.virtuobusiness.com/en/student" target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                Pay Dues
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tutorial Timetable</dt>
                  {/* <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">3</div>
                  </dd> */}
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="https://drive.google.com" target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                Download
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <Bell className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unread Notifications</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{unreadAnnouncements}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/notifications" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Announcements - Full Width */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Announcements</h2>
              <Link 
                href="/dashboard/announcements" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoadingAnnouncements ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="animate-pulse space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      <div className="h-px bg-gray-100"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No recent announcements</p>
              </div>
            ) : (
              announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {announcement.title}
                          {announcement.isImportant && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Important
                            </span>
                          )}
                        </p>
                        <div className="text-xs text-gray-500">
                          {format(announcement.createdAt.toDate(), 'MMM d')}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      </div>

      {/* Recent Materials */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Materials</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {isLoadingMaterials ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Loading materials...</p>
            </div>
          ) : recentMaterials.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentMaterials.map((material) => (
                <li key={material.id} className="py-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{material.title}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {material.courseCode} • {material.fileType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {material.uploadedAt ? formatDistanceToNow(
                          material.uploadedAt instanceof Date ? material.uploadedAt : material.uploadedAt.toDate(), 
                          { addSuffix: true }
                        ) : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No materials available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new materials.</p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <Link href="/dashboard/materials" className="font-medium text-indigo-600 hover:text-indigo-500">
              View all materials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}