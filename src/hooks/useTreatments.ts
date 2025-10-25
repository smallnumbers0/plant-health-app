/**
 * Treatment Data Hooks
 *
 * Custom hooks for fetching and mutating treatment data using React Query.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Treatment } from '../services/database.types';

/**
 * Fetch treatments for a specific plant
 */
export function useTreatments(plantId: string | undefined) {
  return useQuery<Treatment[]>({
    queryKey: ['treatments', plantId],
    queryFn: async () => {
      if (!plantId) throw new Error('Plant ID is required');

      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('plant_id', plantId)
        .order('step', { ascending: true });

      if (error) throw error;
      return data as Treatment[];
    },
    enabled: !!plantId,
  });
}

/**
 * Update treatment completion status
 */
export function useUpdateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      treatmentId,
      completed,
    }: {
      treatmentId: string;
      completed: boolean;
    }) => {
      const update: any = { completed };

      const { error } = await supabase
        .from('treatments')
        // @ts-expect-error - Supabase typing issue
        .update(update)
        .eq('id', treatmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
  });
}
