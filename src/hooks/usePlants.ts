/**
 * Plant Data Hooks
 *
 * Custom hooks for fetching and mutating plant data using React Query.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, PLANT_IMAGES_BUCKET } from '../services/supabase';
import type { DiagnosisResult, Plant } from '../services/database.types';

/**
 * Fetch all plants for the current user
 */
export function usePlants(userId: string | undefined) {
  return useQuery<Plant[]>({
    queryKey: ['plants', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Plant[];
    },
    enabled: !!userId,
  });
}

/**
 * Fetch a single plant by ID with its treatments
 */
export function usePlant(plantId: string | undefined) {
  return useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      if (!plantId) throw new Error('Plant ID is required');

      const { data, error } = await supabase
        .from('plants')
        .select(`
          *,
          treatments (*)
        `)
        .eq('id', plantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!plantId,
  });
}

/**
 * Upload plant image and create diagnosis
 */
export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      imageFile,
      onProgress,
    }: {
      userId: string;
      imageFile: File;
      onProgress?: (progress: number) => void;
    }) => {
      // 1. Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      if (onProgress) onProgress(25);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(PLANT_IMAGES_BUCKET)
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL for the image
      const { data: { publicUrl } } = supabase.storage
        .from(PLANT_IMAGES_BUCKET)
        .getPublicUrl(uploadData.path);

      if (onProgress) onProgress(50);

      // 3. Call AI worker for diagnosis
      const aiWorkerUrl = import.meta.env.VITE_AI_WORKER_URL;
      if (!aiWorkerUrl) {
        throw new Error('AI Worker URL not configured');
      }

      const diagnosisResponse = await fetch(aiWorkerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      if (!diagnosisResponse.ok) {
        throw new Error('AI diagnosis failed');
      }

      const diagnosis: DiagnosisResult = await diagnosisResponse.json();

      if (onProgress) onProgress(75);

      // 4. Save plant record to database
      const plantInsert: any = {
        user_id: userId,
        image_url: publicUrl,
        plant_name: diagnosis.plantName,
        diagnosis: diagnosis,
      };

      const { data: plantData, error: plantError } = await supabase
        .from('plants')
        .insert(plantInsert)
        .select()
        .single();

      if (plantError) throw plantError;
      if (!plantData) throw new Error('Failed to create plant record');

      // 5. Create treatment plan entries
      const treatments: any[] = diagnosis.recommendations.map((rec, index) => ({
        plant_id: (plantData as any).id,
        step: index + 1,
        description: rec.action,
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));

      const { error: treatmentError } = await supabase
        .from('treatments')
        // @ts-expect-error - Supabase typing issue
        .insert(treatments);

      if (treatmentError) throw treatmentError;

      if (onProgress) onProgress(100);

      return plantData;
    },
    onSuccess: () => {
      // Invalidate plants query to refetch
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
}

/**
 * Delete a plant
 */
export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plantId: string) => {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', plantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
}
