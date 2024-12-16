// src/auth.js
import { account, databases} from './appwrite'
import { OAuthProvider } from "appwrite"

export const loginWithGoogle = async () => {
    await account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:5173/gsign',
        'http://localhost:5173/fail'
    )
}
export const addUser = async () => {
  try {
    const user = await account.get();
    const id = user.$id;

    // Attempt to fetch the document
    const result = await databases.getDocument(
      '674ec7d40029fa311303',
      '674ec8d3002f4e08b44c',
      id
    );
    console.log('Document exists:', result);
  } catch (error: any) {
    console.error('Error fetching document:', error);

    // Create the document if it doesn't exist
    if (error.code === 404) { // Assuming 404 is the "not found" error
      const user = await account.get(); // Re-fetch user for robustness
      const result = await databases.createDocument(
        '674ec7d40029fa311303',
        '674ec8d3002f4e08b44c',
        user.$id,
        { name: user.name || 'Unknown User' }
      );
      console.log('Document created:', result);
    } else {
      console.error('Unhandled error:', error);
    }
  }
};

export const newcourse = async () => {
  try {
    const user = await account.get();
    const id = user.$id;

    // Attempt to fetch the document
    const result = await databases.getDocument(
      '674ec7d40029fa311303',
      '674ec8d3002f4e08b44c',
      id
    );

    const enrolled = result.enrolled + 1;
  const uresult = await databases.updateDocument(
    '674ec7d40029fa311303', // databaseId
    '674ec8d3002f4e08b44c', // collectionId
    id, // documentId
    {'enrolled': enrolled}, // data (optional)
);

console.log(uresult);}
catch(error){
  console.log(error);
}
}


export const updateProgress = async (courseId: any, progress: any) => {
  try {
    const user = await account.get();
    const id = user.$id;

    // Fetch the existing document
    const result = await databases.getDocument(
      '674ec7d40029fa311303', // Database ID
      '674ec8d3002f4e08b44c', // Collection ID
      id // Document ID
    );

    // Ensure courses and progress arrays are initialized
    const courses = Array.isArray(result.courses) ? [...result.courses] : [];
    const progresses = Array.isArray(result.progress) ? [...result.progress] : [];

    if (courses.indexOf(courseId) !== -1) { 
      const index = courses.indexOf(courseId);
      progresses[index] = progress; // Update existing progress
  } else {
      courses.push(courseId);
      progresses.push(progress);
  }
  
    // Update the document
    const updatedResult = await databases.updateDocument(
      '674ec7d40029fa311303', // Database ID
      '674ec8d3002f4e08b44c', // Collection ID
      id, // Document ID
      { courses, progress: progresses } // Data to update
    );

    console.log('Updated document:', updatedResult);
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

export async function getProgress(courseId: any) {
  try {
    const user = await account.get();
    const id = user.$id;

    // Attempt to fetch the document
    const result = await databases.getDocument(
      '674ec7d40029fa311303',
      '674ec8d3002f4e08b44c',
      id
    );

    const progresses = Array.isArray(result.progress) ? [...result.progress] : [];
    const progress = progresses[courseId]
    console.log(progress);
    return progress;
  }
    catch(error){
      console.log(error)
    }
}


export const logoutUser = async () => {
    try {
      const user = await account.get(); // Check if a user is logged in
      console.log('User is logged in:', user);
      await account.deleteSession('current');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
export const getUser = async () => {
    return await account.get();
}

