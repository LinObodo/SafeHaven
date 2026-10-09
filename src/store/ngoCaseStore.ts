import { create } from 'zustand';
import { NGOCase, NGOCaseStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface NewCaseInput {
  assignedNgo: string;
  notes: string;
}

interface NGOCaseState {
  cases: NGOCase[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadCases: () => Promise<void>;
  createCase: (input: NewCaseInput) => Promise<{ error?: string }>;
  updateStatus: (id: string, status: NGOCaseStatus) => Promise<{ error?: string }>;
  clearError: () => void;
}

const mapRow = (row: {
  id: string;
  survivor_id: string;
  assigned_ngo: string;
  status: NGOCaseStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}): NGOCase => ({
  id: row.id,
  survivorId: row.survivor_id,
  assignedNGO: row.assigned_ngo,
  status: row.status,
  notes: row.notes,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const useNGOCaseStore = create<NGOCaseState>((set, get) => ({
  cases: [],
  loading: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadCases: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ cases: [], loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      // RLS limits rows to cases where the user is the survivor or the NGO.
      const { data, error } = await supabase
        .from('ngo_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ cases: (data ?? []).map(mapRow), loading: false });
    } catch (err) {
      console.error('Error loading NGO cases:', err);
      set({ loading: false, error: 'Could not load cases. Please try again.' });
    }
  },

  createCase: async (input) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return { error: 'Please sign in to create a case.' };
    }

    const assignedNgo = input.assignedNgo.trim();
    if (!assignedNgo) {
      return { error: 'An NGO ID is required to refer a case.' };
    }

    set({ saving: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ngo_cases')
        .insert({
          survivor_id: user.id,
          assigned_ngo: assignedNgo,
          notes: input.notes.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ cases: [mapRow(data), ...state.cases], saving: false }));
      return {};
    } catch (err) {
      console.error('Error creating NGO case:', err);
      set({ saving: false });
      return { error: 'Could not create the case. Check the NGO ID and try again.' };
    }
  },

  updateStatus: async (id, status) => {
    const previous = get().cases;
    // Optimistic update
    set({
      cases: previous.map((c) => (c.id === id ? { ...c, status } : c)),
      error: null,
    });
    try {
      const { error } = await supabase
        .from('ngo_cases')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return {};
    } catch (err) {
      console.error('Error updating case status:', err);
      set({ cases: previous, error: 'Could not update the status. Please try again.' });
      return { error: 'Could not update the status. Please try again.' };
    }
  },
}));
