'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { FileText, Search, Download, Folder, ChevronDown, ChevronRight } from 'lucide-react';

// Type definitions
interface Material {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedAt: Date;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  
  // Fetch materials from Firestore
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const materialsQuery = query(
          collection(db, 'materials'),
          orderBy('uploadedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(materialsQuery);
        const materialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadedAt: doc.data().uploadedAt?.toDate()
        })) as Material[];
        
        setMaterials(materialsData);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const toggleCourse = (courseCode: string) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseCode)) {
        newSet.delete(courseCode);
      } else {
        newSet.add(courseCode);
      }
      return newSet;
    });
  };

  const handleDownload = (fileUrl: string, _fileName: string): void => {
    // Open the file URL in a new tab for download
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };
  
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group materials by course for the course list view
  const materialsByCourse = filteredMaterials.reduce((acc, material) => {
    if (!acc[material.courseCode]) {
      acc[material.courseCode] = [];
    }
    acc[material.courseCode].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  // Get unique courses from materials
  const courses = Array.from(
    filteredMaterials.reduce((map, material) => {
      if (!map.has(material.courseCode)) {
        map.set(material.courseCode, {
          code: material.courseCode,
          name: material.courseName
        });
      }
      return map;
    }, new Map<string, {code: string, name: string}>()).values()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Course Materials</h1>
        <p className="mt-2 text-sm text-gray-600">Access and download your course materials and resources.</p>
      </div>

      {/* Search bar */}
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Materials List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {Object.entries(materialsByCourse).length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {Object.entries(materialsByCourse).map(([courseCode, courseMaterials]) => {
              const course = courses.find(c => c.code === courseCode);
              const isExpanded = expandedCourses.has(courseCode);
              
              return (
                <li key={courseCode} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleCourse(courseCode)}
                    className="w-full px-4 py-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Folder className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {course?.name || courseCode} ({courseCode})
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {courseMaterials.length} {courseMaterials.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <ul className="bg-gray-50 pl-12 pr-4 pb-2">
                      {courseMaterials.map((material) => (
                        <li key={material.id} className="py-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{material.title}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <span>{material.fileType?.toUpperCase() || 'FILE'}</span>
                                  <span className="mx-1">•</span>
                                  <span>{material.fileSize || 'N/A'}</span>
                                  <span className="mx-1">•</span>
                                  <span>{material.uploadedAt?.toLocaleDateString() || 'Unknown date'}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(material.fileUrl, material.title);
                              }}
                              className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term.' : 'No materials have been uploaded yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Upload section (for future implementation) */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <div className="text-center">
          <Folder className="mx-auto h-12 w-12 text-blue-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Need something else?</h3>
          <p className="mt-1 text-sm text-gray-500">
            If you can&apos;t find what you&apos;re looking for, contact your instructor.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled
              title="Contact instructor (coming soon)"
            >
              Contact Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}