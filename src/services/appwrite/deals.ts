import { Client, Databases, ID, Models } from "appwrite";
import config from "../../envConfig/config";

const client = new Client()
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

const databases = new Databases(client);

const DATABASE_ID = config.appwriteDatabaseId;
const COLLECTION_ID = config.appwriteCollectionId

export const createDeal = async (deal: {
  title: string;
  description: string;
  price: number;
  buyerId: string;
  sellerId: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  dueDate?: string;
  tags?: string[];
  priority: "low" | "medium" | "high";
}) => {
  try {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), deal);
  } catch (err) {
    console.error("Error creating deal:", err);
    throw err;
  }
};

export const getAllDeals = async () => {
  try {
    return await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
  } catch (err) {
    console.error("Error fetching deals:", err);
    throw err;
  }
};

export const getDealById = async (dealId: string): Promise<Models.Document> => {
  try {
    return await databases.getDocument(DATABASE_ID, COLLECTION_ID, dealId);
  } catch (err) {
    console.error("Error fetching deal by ID:", err);
    throw err;
  }
};
