import React, { useState, useEffect } from 'react';
import { addPreference, fetchPreferences } from '@/lib/api';
import { Preference } from '@/types';

// Define the structure of form errors
interface FormErrors {
  [key: string]: string;
}

const PreferenceForm: React.FC = () => {
  // State for form fields
  const [preference, setPreference] = useState<Partial<Preference>>({
    name: '',
    hobbies: [],
    skills: [],
    teach: '',
    dob: undefined,
    learn: '',
  });

  // State for form errors, submission status, and loading state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For loading preferences

  // Fetch preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const fetchedPreferences = await fetchPreferences();
        console.log("fetchedPreferences",fetchedPreferences);
        
          setPreference(fetchedPreferences); // Assuming you want to load the first preference
       
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPreference((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    setPreference((prev) => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!preference.name) newErrors.name = 'Name is required';
    if (!preference.hobbies || preference.hobbies.length === 0) newErrors.hobbies = 'At least one hobby is required';
    if (!preference.skills || preference.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (!preference.teach) newErrors.teach = 'Teach field is required';
    if (!preference.learn) newErrors.learn = 'Learn field is required';
    if (!preference.dob) newErrors.dob = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await addPreference(preference);
        setSubmitSuccess(true);
        // Reset form after successful submission
        setPreference({
          name: '',
          hobbies: [],
          skills: [],
          teach: '',
          dob: undefined,
          learn: '',
        });
      } catch (error) {
        console.error('Failed to add preference:', error);
        setErrors({ submit: 'Failed to save preferences. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return <p>Loading preferences...</p>; // Display a loading message while fetching preferences
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={preference.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700">
          Hobbies (comma separated)
        </label>
        <textarea
          id="hobbies"
          name="hobbies"
          value={preference.hobbies?.join(', ')}
          onChange={(e) => handleArrayChange(e, 'hobbies')}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.hobbies ? 'border-red-500' : ''
          }`}
        ></textarea>
        {errors.hobbies && <p className="mt-1 text-sm text-red-500">{errors.hobbies}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills (comma separated)
        </label>
        <textarea
          id="skills"
          name="skills"
          value={preference.skills?.join(', ')}
          onChange={(e) => handleArrayChange(e, 'skills')}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.skills ? 'border-red-500' : ''
          }`}
        ></textarea>
        {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="teach" className="block text-sm font-medium text-gray-700">
          Teach
        </label>
        <input
          type="text"
          id="teach"
          name="teach"
          value={preference.teach}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.teach ? 'border-red-500' : ''
          }`}
        />
        {errors.teach && <p className="mt-1 text-sm text-red-500">{errors.teach}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={preference.dob ? new Date(preference.dob).toISOString().split('T')[0] : ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.dob ? 'border-red-500' : ''
          }`}
        />
        {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="learn" className="block text-sm font-medium text-gray-700">
          Learn
        </label>
        <input
          type="text"
          id="learn"
          name="learn"
          value={preference.learn}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.learn ? 'border-red-500' : ''
          }`}
        />
        {errors.learn && <p className="mt-1 text-sm text-red-500">{errors.learn}</p>}
      </div>

      {errors.submit && <p className="mt-2 text-sm text-red-500">{errors.submit}</p>}

      {submitSuccess && (
        <p className="mt-2 text-sm text-green-500">Preferences saved successfully!</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
};

export default PreferenceForm;
