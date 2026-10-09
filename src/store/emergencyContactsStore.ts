import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface EmergencyContactRecord {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isTrusted: boolean;
}

interface NewContactInput {
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyContactsState {
  contacts: EmergencyContactRecord[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadContacts: () => Promise<void>;
  addContact: (contact: NewContactInput) => Promise<{ error?: string }>;
  deleteContact: (id: string) => Promise<{ error?: string }>;
  clearError: () => void;
}

export const useEmergencyContactsStore = create<EmergencyContactsState>((set, get) => ({
  contacts: [],
  loading: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadContacts: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ contacts: [], loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const contacts: EmergencyContactRecord[] = (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        relationship: row.relationship,
        isTrusted: row.is_trusted,
      }));

      set({ contacts, loading: false });
    } catch (err) {
      console.error('Error loading emergency contacts:', err);
      set({ loading: false, error: 'Could not load your contacts. Please try again.' });
    }
  },

  addContact: async (contact) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return { error: 'Please sign in to save a contact.' };
    }

    const name = contact.name.trim();
    const phone = contact.phone.trim();
    if (!name || !phone) {
      return { error: 'Name and phone number are required.' };
    }

    set({ saving: true, error: null });
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name,
          phone,
          relationship: contact.relationship.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      const newContact: EmergencyContactRecord = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        relationship: data.relationship,
        isTrusted: data.is_trusted,
      };

      set((state) => ({ contacts: [...state.contacts, newContact], saving: false }));
      return {};
    } catch (err) {
      console.error('Error adding emergency contact:', err);
      set({ saving: false });
      return { error: 'Could not save the contact. Please try again.' };
    }
  },

  deleteContact: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user) return { error: 'Please sign in.' };

    const previous = get().contacts;
    // Optimistic removal
    set({ contacts: previous.filter((c) => c.id !== id), error: null });
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return {};
    } catch (err) {
      console.error('Error deleting emergency contact:', err);
      // Roll back on failure
      set({ contacts: previous, error: 'Could not delete the contact. Please try again.' });
      return { error: 'Could not delete the contact. Please try again.' };
    }
  },
}));
