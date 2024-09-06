export interface User {
  id: string;
  email: string;
}

export interface Preference {
  id: number;
  userEmail: string; // Foreign key referencing the user, but no association
  name: string;
  hobbies: string[]; // JSON array
  skills: string[]; // JSON array
  teach: string;
  dob: Date;
  learn: string;
}

export interface Profile {
  id: string;
  userEmail: string;
  // Add other profile fields as needed
}
