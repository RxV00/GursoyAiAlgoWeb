'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DatabaseUserMeasurement, ProductWithDetails } from '@/lib/types/database'

// This is the data structure we'll use to create a new quote
export type NewQuotePayload = {
  product: ProductWithDetails;
  measurements: Record<string, number>;
  quantity: number;
  calculatedPrice: number;
};

/**
 * Creates a new quote (user_measurement) in the database for the authenticated user.
 * @param payload The data for the new quote.
 * @returns The newly created quote record or an error object.
 */
export async function createQuote(payload: NewQuotePayload): Promise<{ data?: DatabaseUserMeasurement; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a quote.' };
  }

  const { product, measurements, quantity, calculatedPrice } = payload;

  const newRecord: Omit<DatabaseUserMeasurement, 'id' | 'created_at' | 'updated_at'> = {
    user_id: user.id,
    product_id: product.id,
    measurements,
    quantity,
    // Ensure integer value for DB integer column
    calculated_price: Math.round(calculatedPrice),
  };

  const { data, error } = await supabase
    .from('user_measurements')
    .insert(newRecord)
    .select()
    .single();

  if (error) {
    console.error('Error creating quote:', error);
    return { error: 'Could not save your quote. Please try again.' };
  }

  // Revalidate measurement section or quotes listing if any page relies on it
  revalidatePath('/');

  return { data };
}
