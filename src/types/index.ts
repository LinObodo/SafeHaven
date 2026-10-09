export interface User {
  id: string;
  email?: string;
  role: 'victim' | 'ngo' | 'emergency';
  isAnonymous: boolean;
  createdAt: Date;
  lastLogin: Date;
}

export interface SafetyPlan {
  id: string;
  userId: string;
  emergencyContacts: EmergencyContact[];
  safeLocations: string[];
  importantDocuments: string[];
  escapeRoutes: string[];
  warningSignals: string[];
  personalItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isTrusted: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: 'legal' | 'health' | 'mental-wellness' | 'child-support' | 'housing' | 'financial';
  description: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  triggerWords?: string[];
  isEmergency?: boolean;
}

export type NGOCaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface NGOCase {
  id: string;
  survivorId: string;
  assignedNGO: string;
  status: NGOCaseStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}