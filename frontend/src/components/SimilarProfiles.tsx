import React, { useEffect, useState } from "react";
import { getSimilarProfiles } from "@/lib/api";

const SimilarProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch similar profiles
  const fetchSimilarProfiles = async () => {
    setLoading(true);
    setError(null); // Clear previous error if any
    try {
      const fetchedProfiles = await getSimilarProfiles();
      setProfiles(fetchedProfiles.similarProfiles);
    } catch (err) {
      setError("Failed to load similar profiles. Please try again later.");
      console.error("Error fetching similar profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profiles when the component mounts
  useEffect(() => {
    fetchSimilarProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div> {/* Add a loader */}
      </div>
    );
  }
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (profiles.length === 0)
    return <div className="text-center">No similar profiles found.</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Similar Profiles
          </h3>
          {/* Refresh Button on the right */}
          <button
            onClick={fetchSimilarProfiles}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          People with similar interests
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {profiles.map((value: any) => (
          <li key={value.name} className="px-4 py-4 sm:px-6 bg-orange-100 m-2 border rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 truncate">
                {value.name}
              </p>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  Age: {value.age}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  Hobbies: {value.similarPreferences.hobbies.join(", ")}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <p>Skills: {value.similarPreferences.skills.join(", ")}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimilarProfiles;
