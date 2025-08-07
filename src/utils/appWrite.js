// src/appwriteClient.js
import { Client, Databases,Query,ID, Account } from 'appwrite';

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
export const CART_COLLECTION_ID = import.meta.env.VITE_CART_COLLECTION_ID
export const HISTORY_COLLECTION_ID = import.meta.env.VITE_HISTORY_COLLECTION_ID

export const account = new Account(client)

export {Query,ID};


export async function getCurrentUser() {
  try {
    const user = await account.get();
    console.log("Logged-in user:", user);
    return user;
  } catch (error) {
    console.log("No user is logged in", error.message);
    return null;
  }
}

