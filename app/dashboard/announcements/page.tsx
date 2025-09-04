'use client';

import { useState, useEffect } from 'react';
import { Announcement } from '@/types/announcement';
import { 
  subscribeToAnnouncements,
  subscribeToImportantAnnouncements
} from '@/lib/firebase/announcementService';
import { format } from 'date-fns';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [importantAnnouncements, setImportantAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load important announcements
  useEffect(() => {
    const onImportantData = (data: Announcement[]) => {
      setImportantAnnouncements(data);
      setIsLoading(false);
    };

    const onImportantError = (err: Error) => {
      console.error('Error loading important announcements:', err);
      setError('Failed to load important announcements');
      setIsLoading(false);
    };

    const unsubscribeImportant = subscribeToImportantAnnouncements(
      onImportantData, 
      onImportantError,
      10 // Limit to 10 important announcements
    );

    return () => {
      if (unsubscribeImportant) unsubscribeImportant();
    };
  }, []);

  // Load all announcements
  useEffect(() => {
    const onData = (data: Announcement[]) => {
      setAnnouncements(data.filter(a => !a.isImportant)); // Filter out important ones since they're shown separately
    };

    const onError = (err: Error) => {
      console.error('Error loading announcements:', err);
      setError('Failed to load announcements');
    };

    const unsubscribe = subscribeToAnnouncements(
      onData, 
      onError,
      50 // Limit to 50 total announcements
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredImportantAnnouncements = importantAnnouncements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest news and announcements</p>
      </div>

      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 0L6 8.586 4.707 7.293a1 1 0 00-1.414 1.414L4.586 10l-1.293 1.293a1 1 0 101.414 1.414L6 11.414l1.293 1.293a1 1 0 001.414-1.414L7.414 10l1.293-1.293a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Important Announcements */}
      {filteredImportantAnnouncements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Important Announcements</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredImportantAnnouncements.map((announcement) => (
                <li key={announcement.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {announcement.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Important
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {announcement.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>
                          Posted by {announcement.createdByName} on{' '}
                          {format(announcement.createdAt.toDate(), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Announcements</h2>
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">No announcements found</p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredAnnouncements.map((announcement) => (
                <li key={announcement.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {announcement.title}
                      </p>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {announcement.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>
                          Posted by {announcement.createdByName} on{' '}
                          {format(announcement.createdAt.toDate(), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}