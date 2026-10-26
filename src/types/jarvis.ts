export type SystemStatus =
  | 'ONLINE'
  | 'NO_INTERNET'
  | 'AI_SERVICE_UNAVAILABLE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'AI_NOT_CONFIGURED'
  | 'OFFLINE_MODE'
  | 'LOCAL_AI_READY';

export type CoreState = 'idle' | 'listening' | 'processing' | 'speaking' | 'alert';

export type ActionType =
  | 'OPEN_APP'
  | 'FLASHLIGHT'
  | 'READ_DATETIME'
  | 'SEARCH_WEB'
  | 'WHATSAPP_PROPOSAL'
  | 'SHARE_TEXT'
  | 'DOCUMENT_PICKER'
  | 'BLOCKED_FINANCIAL';

export interface ActionProposal {
  id: string;
  type: ActionType;
  payload: {
    app?: 'youtube' | 'whatsapp' | 'freefire' | 'camera' | 'settings' | string;
    state?: 'on' | 'off' | 'toggle';
    query?: string;
    recipient?: string;
    phone?: string;
    text?: string;
    reason?: string;
    url?: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXECUTED' | 'FAILED';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'system';
  text: string;
  timestamp: string;
  actionProposal?: ActionProposal;
  grounding?: { queries?: string[] };
  securityAlert?: {
    layer: string;
    blocked: boolean;
  };
}

export interface SecurityControl {
  id: number;
  code: string;
  name: string;
  category: 'identity_permissions' | 'financial_isolation' | 'command_protection' | 'data_network';
  description: string;
  enforcement: string;
  status: 'ACTIVE' | 'ENFORCED' | 'TESTED';
}

export interface DeviceInfo {
  model: string;
  batteryLevel: number | null;
  isCharging: boolean | null;
  ramUsageEstimate: string;
  online: boolean;
  torchSupported: boolean;
  speechRecognitionSupported: boolean;
  speechSynthesisSupported: boolean;
}

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}
