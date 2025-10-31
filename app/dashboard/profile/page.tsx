'use client';

import { useState, useEffect } from 'react';
import { 
    UserIcon,       // Alternative to User
    Edit3,          // Alternative edit icon
    CheckCircle,    // Check with circle
    XCircle,        // X with circle
    Camera as CameraIcon  // Renamed import
  } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricNumber: '',
    department: 'Mathematics',
    level: '100',
    phone: '',
    address: '',
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const loadedProfile = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: currentUser.email || '',
            matricNumber: userData.matricNumber || '',
            department: userData.department || 'Mathematics',
            level: userData.level || '100',
            phone: userData.phone || '',
            address: userData.address || '',
          };
          setProfile(loadedProfile);
          setTempProfile(loadedProfile);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        firstName: tempProfile.firstName,
        lastName: tempProfile.lastName,
        matricNumber: tempProfile.matricNumber,
        department: tempProfile.department,
        level: tempProfile.level,
        phone: tempProfile.phone,
        address: tempProfile.address,
      });
      
      setProfile({ ...tempProfile });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your personal information and account settings.</p>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit3 className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Edit Profile
            </button>
          ) : (
            <div className="space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <XCircle className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your personal details and information.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Profile Photo</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="relative">
                    {selectedImage ? (
                      <img
                        className="h-20 w-20 rounded-full object-cover"
                        src={selectedImage}
                        alt="Profile"
                      />
                    ) : (
                      <UserIcon className="h-20 w-20 text-gray-300" aria-hidden="true" />
                    )}
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                        <CameraIcon className="h-5 w-5 text-indigo-600" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex space-x-4 w-full">
                    <input
                      type="text"
                      name="firstName"
                      value={tempProfile.firstName}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={tempProfile.lastName}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                ) : (
                  <span className="flex-grow">{`${profile.firstName} ${profile.lastName}`}</span>
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempProfile.email}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                ) : (
                  <span className="flex-grow">{profile.email}</span>
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Matric Number</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="matricNumber"
                    value={tempProfile.matricNumber}
                    onChange={handleChange}
                    placeholder="e.g. 20CS/12345"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                ) : (
                  <span className="flex-grow">{profile.matricNumber || 'Not set'}</span>
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <select
                    name="department"
                    value={tempProfile.department}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>Mathematics</option>
                  </select>
                ) : (
                  profile.department
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Level</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <select
                    name="level"
                    value={tempProfile.level}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>100</option>
                    <option>200</option>
                    <option>300</option>
                    <option>400</option>
                  </select>
                ) : (
                  `Level ${profile.level}`
                )}
              </dd>
            </div>
            
          </dl>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account security and preferences.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Change Password</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => alert('Password change functionality coming soon')}
                >
                  Change Password
                </button>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Two-Factor Authentication</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Disabled
                </span>
                <button
                  type="button"
                  className="ml-4 font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => alert('2FA setup coming soon')}
                >
                  Enable
                </button>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Delete Account</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <button
                  type="button"
                  className="font-medium text-red-600 hover:text-red-500"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('Account deletion would be processed here');
                    }
                  }}
                >
                  Delete Account
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
