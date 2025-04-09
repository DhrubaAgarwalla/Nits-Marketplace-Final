import { supabase } from '@/utils/supabase';
import { Item, ItemCategory, ListingType } from '@/types';

// Get all items with optional filtering
export async function getItems(options?: {
  category?: ItemCategory;
  listingType?: ListingType;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('items')
    .select(`
      *,
      user:users(id, email, full_name, department, whatsapp_number, scholar_id)
    `)
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.listingType) {
    query = query.eq('listing_type', options.listingType);
  }

  if (options?.searchQuery) {
    query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
  }

  if (options?.minPrice !== undefined) {
    query = query.gte('price', options.minPrice);
  }

  if (options?.maxPrice !== undefined) {
    query = query.lte('price', options.maxPrice);
  }

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }

  // Map the snake_case database columns to camelCase for the frontend
  return data?.map(item => ({
    ...item,
    userId: item.user_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    listingType: item.listing_type,
    user: item.user ? {
      ...item.user,
      fullName: item.user.full_name,
      scholarId: item.user.scholar_id || '',
      whatsappNumber: item.user.whatsapp_number
    } : undefined
  })) as Item[];
}

// Get a single item by ID
export async function getItemById(id: string) {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      user:users(id, email, full_name, department, whatsapp_number, scholar_id)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching item:', error);
    throw error;
  }

  // Map the snake_case database columns to camelCase for the frontend
  if (data) {
    return {
      ...data,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      listingType: data.listing_type,
      user: data.user ? {
        ...data.user,
        fullName: data.user.full_name,
        scholarId: data.user.scholar_id || '',
        whatsappNumber: data.user.whatsapp_number
      } : undefined
    } as Item;
  }

  return null as unknown as Item;
}

// Create a new item
export async function createItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'user'>) {
  try {
    // Ensure userId is a string
    if (!item.userId || typeof item.userId !== 'string') {
      throw new Error('Invalid userId: ' + JSON.stringify(item.userId));
    }

    // Ensure price is a number
    if (typeof item.price !== 'number') {
      throw new Error('Price must be a number');
    }

    // Create a new object with the correct column names for Supabase
    // Don't spread the original item to avoid including camelCase properties
    const dbItem = {
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      listing_type: item.listingType, // Map listingType to listing_type
      condition: item.condition,
      images: item.images,
      user_id: item.userId, // Map userId to user_id
    };

    // Log the item being created
    console.log('Creating item with data:', JSON.stringify(dbItem, null, 2));

    const { data, error } = await supabase
      .from('items')
      .insert([dbItem])
      .select();

    if (error) {
      console.error('Supabase error creating item:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after creating item');
    }

    // Map the snake_case database columns to camelCase for the frontend
    return {
      ...data[0],
      userId: data[0].user_id,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
      listingType: data[0].listing_type
    } as Item;
  } catch (err) {
    console.error('Error creating item:', err);
    throw err;
  }
}

// Update an existing item
export async function updateItem(id: string, updates: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'user'>>) {
  try {
    // Convert camelCase to snake_case for database
    const dbUpdates: any = {};

    if (updates.userId) dbUpdates.user_id = updates.userId;
    if (updates.listingType) dbUpdates.listing_type = updates.listingType;

    // Copy other fields directly
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.price) dbUpdates.price = updates.price;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.condition) dbUpdates.condition = updates.condition;
    if (updates.images) dbUpdates.images = updates.images;

    console.log('Updating item with data:', JSON.stringify(dbUpdates, null, 2));

    const { data, error } = await supabase
      .from('items')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating item:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after updating item');
    }

    // Map the snake_case database columns to camelCase for the frontend
    return {
      ...data[0],
      userId: data[0].user_id,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
      listingType: data[0].listing_type
    } as Item;
  } catch (err) {
    console.error('Error in updateItem:', err);
    throw err;
  }
}

// Delete an item
export async function deleteItem(id: string) {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting item:', error);
    throw error;
  }

  return true;
}

// Upload an image for an item
export async function uploadItemImage(file: File, userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID is required for image upload');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `items/${fileName}`;

    console.log(`Uploading image to path: ${filePath}`);

    const { error } = await supabase.storage
      .from('item-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath);

    console.log(`Image uploaded successfully. Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('Error in uploadItemImage:', err);
    throw err;
  }
}

// Get items by user ID
export async function getItemsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId) // Use user_id instead of userId to match the database column
    .order('created_at', { ascending: false }); // Use created_at instead of createdAt

  if (error) {
    console.error('Error fetching user items:', error);
    throw error;
  }

  // Map the snake_case database columns to camelCase for the frontend
  return data?.map(item => ({
    ...item,
    userId: item.user_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    listingType: item.listing_type
  })) as Item[];
}
