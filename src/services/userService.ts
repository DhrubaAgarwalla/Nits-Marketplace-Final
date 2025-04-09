import { supabase } from '@/utils/supabase';
import { User } from '@/types';

// Get user profile by ID
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  if (!data) {
    throw new Error('User not found');
  }

  // Map the snake_case database columns to camelCase for the frontend
  return {
    ...data,
    fullName: data.full_name,
    scholarId: data.scholar_id,
    whatsappNumber: data.whatsapp_number,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as User;
}

// Create or update user profile
export async function upsertUser(user: Partial<User> & { id: string }) {
  // Convert camelCase to snake_case for database
  const dbUser: Record<string, any> = {
    id: user.id,
  };

  if (user.email !== undefined) dbUser.email = user.email;
  if (user.fullName !== undefined) dbUser.full_name = user.fullName;
  if (user.department !== undefined) dbUser.department = user.department;
  if (user.scholarId !== undefined) dbUser.scholar_id = user.scholarId;
  if (user.whatsappNumber !== undefined) dbUser.whatsapp_number = user.whatsappNumber;

  console.log('Upserting user with data:', JSON.stringify(dbUser, null, 2));

  const { data, error } = await supabase
    .from('users')
    .upsert([dbUser])
    .select();

  if (error) {
    console.error('Error upserting user:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No data returned after upserting user');
  }

  // Map the snake_case database columns to camelCase for the frontend
  return {
    ...data[0],
    fullName: data[0].full_name,
    scholarId: data[0].scholar_id,
    whatsappNumber: data[0].whatsapp_number,
    createdAt: data[0].created_at,
    updatedAt: data[0].updated_at
  } as User;
}

// Update user profile
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
  // Convert camelCase to snake_case for database
  const dbUpdates: Record<string, any> = {};

  if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
  if (updates.department !== undefined) dbUpdates.department = updates.department;
  if (updates.scholarId !== undefined) dbUpdates.scholar_id = updates.scholarId;
  if (updates.whatsappNumber !== undefined) dbUpdates.whatsapp_number = updates.whatsappNumber;
  if (updates.email !== undefined) dbUpdates.email = updates.email;

  console.log('Updating user with data:', JSON.stringify(dbUpdates, null, 2));

  const { data, error } = await supabase
    .from('users')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No data returned after updating user');
  }

  // Map the snake_case database columns to camelCase for the frontend
  return {
    ...data[0],
    fullName: data[0].full_name,
    scholarId: data[0].scholar_id,
    whatsappNumber: data[0].whatsapp_number,
    createdAt: data[0].created_at,
    updatedAt: data[0].updated_at
  } as User;
}
