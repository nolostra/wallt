import React, { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api';
import { Profile as ProfileType } from '@/types';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await getProfile();
        setProfile(fetchedProfile);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!profile) return <div className="text-center">No profile data available.</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.email ?? ''}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile;