"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isApiKeyValid: boolean;
  isLoaded: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = "lang_detect_openai_key";

const validateApiKey = (key: string): boolean => {
  // Basic validation for OpenAI API key format
  return key.startsWith("sk-") && key.length > 20;
};

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API key from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = sessionStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKeyState(storedKey);
        setIsApiKeyValid(validateApiKey(storedKey));
      }
      setIsLoaded(true);
    }
  }, []);

  const setApiKey = (key: string) => {
    const trimmedKey = key.trim();
    const isValid = validateApiKey(trimmedKey);

    setApiKeyState(trimmedKey);
    setIsApiKeyValid(isValid);

    if (typeof window !== "undefined") {
      if (isValid) {
        sessionStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
      } else {
        sessionStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    }
  };

  const clearApiKey = () => {
    setApiKeyState(null);
    setIsApiKeyValid(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  return (
    <ApiKeyContext.Provider
      value={{ apiKey, setApiKey, clearApiKey, isApiKeyValid, isLoaded }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}
