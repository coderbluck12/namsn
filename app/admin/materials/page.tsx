'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Upload, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';

type Material = {
  id?: string;
  title: string;
  courseCode: string;
  courseName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedAt: Date;
  uploadedBy: string;
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // New material form state
  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id' | 'uploadedAt' | 'uploadedBy'>>({ 
    title: '',
    courseCode: '',
    courseName: '',
    fileUrl: '',
    fileType: 'PDF',
    fileSize: '',
  });

  // Fetch materials from Firestore
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const materialsQuery = query(collection(db, 'materials'), orderBy('uploadedAt', 'desc'));
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

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!newMaterial.title || !newMaterial.courseCode || !newMaterial.fileUrl) {
        alert('Please fill in all required fields');
        return;
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'materials'), {
        ...newMaterial,
        uploadedAt: new Date(),
        uploadedBy: 'admin', // In a real app, use the current user's ID
      });

      // Update local state
      setMaterials([
        {
          id: docRef.id,
          ...newMaterial,
          uploadedAt: new Date(),
          uploadedBy: 'admin',
        },
        ...materials
      ]);

      // Reset form
      setNewMaterial({ 
        title: '',
        courseCode: '',
        courseName: '',
        fileUrl: '',
        fileType: 'PDF',
        fileSize: '',
      });
      
      setIsAdding(false);
      alert('Material added successfully!');
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Failed to add material. Please try again.');
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'materials', id));
        setMaterials(materials.filter(material => material.id !== id));
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material. Please try again.');
      }
    }
  };

  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Materials</h1>
          <p className="text-sm text-muted-foreground">
            Manage and upload course materials for students
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? 'Cancel' : 'Add New Material'}
        </Button>
      </div>

      {/* Add New Material Form */}
      {isAdding && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Add New Material</h2>
          <form onSubmit={handleAddMaterial} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Lecture 1 - Introduction"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS 101"
                  value={newMaterial.courseCode}
                  onChange={(e) => setNewMaterial({...newMaterial, courseCode: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <Input
                  id="courseName"
                  placeholder="e.g., Introduction to Computer Science"
                  value={newMaterial.courseName}
                  onChange={(e) => setNewMaterial({...newMaterial, courseName: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1">
                  File Type
                </label>
                <select
                  id="fileType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newMaterial.fileType}
                  onChange={(e) => setNewMaterial({...newMaterial, fileType: e.target.value})}
                >
                  <option value="PDF">PDF</option>
                  <option value="DOC">Word Document</option>
                  <option value="PPT">PowerPoint</option>
                  <option value="XLS">Excel</option>
                  <option value="ZIP">ZIP Archive</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700 mb-1">
                  File Size (e.g., 2.4 MB)
                </label>
                <Input
                  id="fileSize"
                  placeholder="e.g., 2.4 MB"
                  value={newMaterial.fileSize}
                  onChange={(e) => setNewMaterial({...newMaterial, fileSize: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  File URL <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    id="fileUrl"
                    placeholder="https://example.com/files/lecture1.pdf"
                    value={newMaterial.fileUrl}
                    onChange={(e) => setNewMaterial({...newMaterial, fileUrl: e.target.value})}
                    required
                  />
                  <Button type="button" variant="outline" className="whitespace-nowrap">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter a direct download URL or upload a file
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search materials by title, course code, or name..."
            className="pl-10 w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                      <div>
                        <div>{material.title}</div>
                        <a 
                          href={material.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          View File
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{material.courseCode}</div>
                    <div className="text-xs text-gray-500">{material.courseName}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {material.fileType}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {material.fileSize || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {material.uploadedAt ? format(material.uploadedAt, 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => material.id && handleDeleteMaterial(material.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? 'No matching materials found' : 'No materials available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
