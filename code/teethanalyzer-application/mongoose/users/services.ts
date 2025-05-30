import User from "./model";
import { UserType } from "./schema";

// Create a new user
export async function createUser(userData: Partial<UserType>) {
  return await User.create(userData);
}

// Find user by OAuth ID
export async function findUserByOauthId(oauthId: string) {
  return await User.findOne({ oauthId }).populate("scanRecords");
}

// Get user by ID
export async function findUserById(userId: string) {
  return await User.findById(userId).populate("scanRecords");
}

// Update user info
export async function updateUser(userId: string, update: Partial<UserType>) {
  return await User.findByIdAndUpdate(userId, update, { new: true });
}

// Delete user
export async function deleteUser(userId: string) {
  return await User.findByIdAndDelete(userId);
}


