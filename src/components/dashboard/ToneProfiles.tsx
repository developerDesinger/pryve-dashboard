"use client";

import { useState, useEffect } from "react";
import AddToneProfileModal from "./AddToneProfileModal";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { toneProfilesAPI, type ToneProfile } from "@/lib/api/toneProfiles";
import { useToast } from "@/hooks/useToast";
import { PageLoader } from "@/components/ui/loader";
import { useAuth } from "@/contexts/AuthContext";
import { useToneProfileForm } from "@/contexts/ToneProfileFormContext";
import { cookieUtils } from "@/lib/cookies";

// Icon mapping for display
const iconMapping: { [key: string]: { src: string; bg: string } } = {
  "heart": { src: "/icons/Tone/heart.svg", bg: "#fce7f3" },
  "grounded": { src: "/icons/Tone/Icon (7).svg", bg: "#fef2f2" },
  "smileys": { src: "/icons/Tone/smileys.svg", bg: "#eff6ff" },
  "direct": { src: "/icons/Tone/Icon (8).svg", bg: "#fff7ed" },
  "professional": { src: "/icons/Tone/Icon (9).svg", bg: "#f0fdf4" },
};

interface ToneProfilesProps {
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string | null) => void;
  onEditProfile: (profileId: string) => void;
}

export default function ToneProfiles({ selectedProfileId, onProfileSelect, onEditProfile }: ToneProfilesProps) {
  const [profiles, setProfiles] = useState<ToneProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    profileId: string | null;
    profileName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    profileId: null,
    profileName: "",
    isDeleting: false,
  });
  const { showSuccess, showError } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { loadProfileData } = useToneProfileForm();

  // Fetch profiles on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);



  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Check if token exists in cookies
      const token = cookieUtils.getAuthToken();
      
      if (!token) {
        showError('No authentication token found. Please login again.');
        return;
      }
      
      const response = await toneProfilesAPI.getAllToneProfiles();
      if (response.success && response.data) {
        setProfiles(response.data);
      } else {
        setProfiles([]);
        showError(response.message || 'Failed to fetch tone profiles');
      }
    } catch (error) {
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProfile = async (profileId: string) => {
    try {
      const response = await toneProfilesAPI.toggleToneProfile(profileId);
      if (response.success && response.data) {
        setProfiles(prev => 
          prev.map(profile => 
            profile.id === profileId 
              ? { ...profile, isActive: response.data!.isActive }
              : profile
          )
        );
        showSuccess(`Profile ${response.data.isActive ? 'enabled' : 'disabled'} successfully`);
      } else {
        showError(response.message || 'Failed to toggle profile');
      }
    } catch (error) {
      showError('Network error. Please check your connection and try again.');
    }
  };

  const handleProfileClick = (profileId: string) => {
    if (selectedProfileId === profileId) {
      onProfileSelect(null); // Deselect if already selected
    } else {
      onProfileSelect(profileId); // Select this profile
    }
  };

  const handleEditClick = (profileId: string) => {
    // Find the profile data and load it into the form
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      loadProfileData(profile);
    }
    onEditProfile(profileId);
  };

  const handleAddProfile = async (newProfile: Omit<ToneProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await toneProfilesAPI.createToneProfile({
        name: newProfile.name,
        description: newProfile.description,
        icon: newProfile.icon,
        coreIdentity: newProfile.coreIdentity || '',
        safetyGuidelines: newProfile.safetyGuidelines || [],
        comfortingInstructions: newProfile.comfortingInstructions || '',
        maxWords: newProfile.maxWords || 200,
        responseStyle: newProfile.responseStyle || 'Warm and Supportive',
        bannedWords: newProfile.bannedWords || [],
        moodToToneRouting: newProfile.moodToToneRouting || {},
      });
      
      if (response.success && response.data) {
        setProfiles(prev => [...prev, response.data!]);
        showSuccess('Tone profile created successfully');
      } else {
        showError(response.message || 'Failed to create tone profile');
      }
    } catch (error) {
      showError('Network error. Please check your connection and try again.');
    }
  };

  const handleDeleteClick = (profileId: string, profileName: string) => {
    setDeleteModal({
      isOpen: true,
      profileId,
      profileName,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.profileId) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const response = await toneProfilesAPI.deleteToneProfile(deleteModal.profileId);
      
      if (response.success) {
        setProfiles(prev => prev.filter(p => p.id !== deleteModal.profileId));
        showSuccess('Tone profile deleted successfully');
        // If the deleted profile was selected, clear the selection
        if (selectedProfileId === deleteModal.profileId) {
          onProfileSelect(null);
        }
        setDeleteModal({
          isOpen: false,
          profileId: null,
          profileName: "",
          isDeleting: false,
        });
      } else {
        showError(response.message || 'Failed to delete tone profile');
        setDeleteModal(prev => ({ ...prev, isDeleting: false }));
      }
    } catch (error) {
      showError('Network error. Please check your connection and try again.');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      profileId: null,
      profileName: "",
      isDeleting: false,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
        <div className="text-center py-8">
          <p className="text-gray-500">Please login to view tone profiles</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
        <PageLoader text="Loading tone profiles..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <svg width="16" height="16" className="sm:w-5 sm:h-5 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Tone Profiles</h2>
            <p className="text-[12px] sm:text-[14px] text-gray-600 font-normal">Configure Pryve's different personality modes</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 bg-[#757575] text-white rounded-lg text-sm font-medium hover:brightness-95 transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Profile
        </button>
      </div>

      {/* Profile Cards */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {profiles.map((profile) => (
          <div 
            key={profile.id} 
            className={`bg-white rounded-xl p-3 sm:p-4 border shadow-sm cursor-pointer transition-all ${
              selectedProfileId === profile.id 
                ? 'border-[#757575] ring-2 ring-[#757575] ring-opacity-20' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleProfileClick(profile.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconMapping[profile.icon]?.bg || '#f3f4f6' }}
                >
                  <img src={iconMapping[profile.icon]?.src || '/icons/Tone/heart.svg'} alt={profile.name} className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                    <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 truncate">{profile.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-medium flex-shrink-0 ${
                      profile.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-[12px] sm:text-[14px] text-gray-700 font-normal leading-relaxed">{profile.description}</p>
                </div>
              </div>
              
              {/* Buttons - only show for selected profile */}
              {selectedProfileId === profile.id && (
                <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleProfile(profile.id);
                    }}
                    className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[12px] font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    {profile.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(profile.id);
                    }}
                    className="px-2 sm:px-3 py-1 bg-[#757575] text-white rounded-lg text-[10px] sm:text-[12px] font-medium hover:brightness-95 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(profile.id, profile.name);
                    }}
                    className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[12px] font-medium border border-red-500 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete profile"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tone profiles found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first tone profile</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#757575] text-white rounded-lg text-sm font-medium hover:brightness-95 transition-colors"
          >
            Create Profile
          </button>
        </div>
      )}

        {/* Add Profile Modal */}
        <AddToneProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddProfile}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Tone Profile"
          message={`Are you sure you want to delete "${deleteModal.profileName}"? This action cannot be undone and will permanently remove the profile and all its settings.`}
          confirmText="Delete Profile"
          cancelText="Cancel"
          type="danger"
          isLoading={deleteModal.isDeleting}
        />
      </div>
    );
  }
