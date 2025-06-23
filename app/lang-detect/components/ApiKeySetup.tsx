"use client";

import { useState } from "react";
import { useApiKey } from "../context/ApiKeyContext";

interface ApiKeySetupProps {
  onComplete?: () => void;
}

export default function ApiKeySetup({ onComplete }: ApiKeySetupProps) {
  const { setApiKey, clearApiKey, isApiKeyValid, apiKey, isLoaded } =
    useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    if (!inputKey.startsWith("sk-")) {
      setError('Invalid API key format. OpenAI API keys start with "sk-"');
      return;
    }

    if (inputKey.length < 20) {
      setError("API key seems too short. Please check your key.");
      return;
    }

    setApiKey(inputKey);
    setInputKey("");
    onComplete?.();
  };

  const handleClear = () => {
    clearApiKey();
    setInputKey("");
    setError("");
  };

  // Show loading state while checking sessionStorage to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (isApiKeyValid) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-400 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                API Key Connected
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your OpenAI API key is ready to use (ends with: ...
                {apiKey?.slice(-4)})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 
                      focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
            aria-label="Remove API key"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-start">
        <svg
          className="flex-shrink-0 h-6 w-6 text-blue-400 mr-3 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
            OpenAI API Key Required
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            To use the language detection feature, please enter your OpenAI API
            key. Your key will be stored securely in your browser session only
            and never sent to our servers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="api-key-input"
                className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2"
              >
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  id="api-key-input"
                  type={isVisible ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 pr-12 border border-blue-300 dark:border-blue-600 rounded-lg 
                           bg-white dark:bg-blue-900/50 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-colors"
                  aria-describedby="api-key-help"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center
                           text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  aria-label={isVisible ? "Hide API key" : "Show API key"}
                >
                  {isVisible ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div
                id="api-key-help"
                className="mt-2 text-xs text-blue-600 dark:text-blue-400"
              >
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  platform.openai.com/api-keys
                </a>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!inputKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                       text-white font-medium py-3 px-4 rounded-lg
                       transition-colors focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2"
            >
              Save API Key
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
