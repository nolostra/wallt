import React, { useEffect, useState } from 'react';
import { getSimilarProfiles } from '@/lib/api';
import { Profile } from '@/types';

const SimilarProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarProfiles = async () => {
      try {
        const fetchedProfiles = await getSimilarProfiles();
        console.log("fetchedProfiles",fetchedProfiles);
        setProfiles(fetchedProfiles);
      } catch (err) {
        setError('Failed to load similar profiles. Please try again later.');
        console.error('Error fetching similar profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProfiles();
  }, []);

  if (loading) return <div className="text-center">Loading similar profiles...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (profiles.length === 0) return <div className="text-center">No similar profiles found.</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Similar Profiles</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">People with similar interests</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {profiles.map((profile) => (
          <li key={profile.id} className="px-4 py-4 sm:px-6">
            {/* <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 truncate">{profile.name}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {profile.matchPercentage}% Match
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  Favorite Color: {profile.favoriteColor}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  Favorite Food: {profile.favoriteFood}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <p>
                  Music: {profile.musicGenre}
                </p>
              </div>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimilarProfiles;