export enum GenerationType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  isLoading?: boolean;
  isError?: boolean;
  sources?: { uri: string; title: string }[];
}

export enum ModelProvider {
    GOOGLE = 'Google',
    OPENAI = 'OpenAI',
    ANTHROPIC = 'Anthropic',
    STABILITY = 'Stability AI',
    REPLICATE = 'Replicate',
    CUSTOM = 'Custom Endpoint',
}

export interface Settings {
  provider: ModelProvider;
  apiKey: string;
  imageModel: string;
  videoModel: string;
  customEndpoint: string;
}

// Fix: Define the AIStudio interface and augment the global Window type.
// This centralizes the definition and resolves conflicting declarations.
// FIX: To resolve a TypeScript declaration merging error, the AIStudio interface
// is now declared within the `declare global` block. This ensures it's part of the
// global scope and prevents conflicts when augmenting the Window interface.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
