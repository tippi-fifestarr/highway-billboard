// Message type from the smart contract
export interface Message {
  content: string;
  author: string;
  timestamp: number;
}

// Extended message type with additional UI properties
export interface UIMessage extends Message {
  index?: number;  // Position in the list (for mile markers)
  isFeatured?: boolean;  // Whether this message is featured
}

// Wallet connection status
export enum WalletStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

// Contract service response types
export interface ContractResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

// Highway theme types
export type HighwayTheme = "day" | "night";