// src/appwriteClient.js
import { Client, Databases,Query,ID } from 'appwrite';

// Create the Appwrite client
const client = new Client();

// Replace with your actual endpoint and project ID
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // or your self-hosted Appwrite URL
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Export the services you need
export const db = new Databases(client);
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const SIZES_COLLECTION_ID= import.meta.env.VITE_SIZES_COLLECTION_ID;
export const HEIGHTS_COLLECTION_ID = import.meta.env.VITE_HEIGHTS_COLLECTION_ID;
export const BILLS_COLLECTION_ID = import.meta.env.VITE_BILLS_COLLECTION_ID;


export {Query,ID};
