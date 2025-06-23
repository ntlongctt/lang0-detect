"use client";

import { useState, useTransition } from "react";
import { detectLanguage, type LanguageDetectionResult } from "./actions";
import { ApiKeyProvider, useApiKey } from "./context/ApiKeyContext";
import ApiKeySetup from "./components/ApiKeySetup";
import TokenUsageDisplay from "./components/TokenUsageDisplay";

function LanguageDetectionContent() {
  const { apiKey, isApiKeyValid } = useApiKey();
  const [text, setText] = useState("");
  const [result, setResult] = useState<LanguageDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApiKeyValid || !apiKey) {
      setError("Please configure your OpenAI API key first");
      return;
    }

    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await detectLanguage(text, apiKey);

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to detect language");
      }
    });
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isApiKeyValid) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Language Detector
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Detect languages in your text with AI-powered analysis
          </p>
        </div>

        {/* API Key Setup */}
        <div className="mb-8">
          <ApiKeySetup />
        </div>

        {/* Main Form - Only show when API key is configured */}
        {isApiKeyValid && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="text-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter text to analyze (100-1000 words recommended)
                </label>
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste or type your text here... (Ctrl/Cmd + Enter to submit)"
                  className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            resize-vertical transition-colors"
                  aria-describedby="text-help"
                />
                <div
                  id="text-help"
                  className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  Character count: {text.length} | Minimum: 10 characters
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending || text.trim().length < 10}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                            text-white font-medium py-3 px-6 rounded-lg
                            transition-colors focus:outline-none focus:ring-2 
                            focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Detect language in the provided text"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Detect Language"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 
                            text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                            dark:hover:bg-gray-700 transition-colors focus:outline-none 
                            focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Clear text and results"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                         rounded-lg p-4 mb-8"
            role="alert"
          >
            <div className="flex">
              <svg
                className="flex-shrink-0 h-5 w-5 text-red-400 mr-3 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Detection Results
            </h2>

            {/* Token Usage & Cost Display */}
            {result.tokenUsage && result.costEstimation && (
              <TokenUsageDisplay
                tokenUsage={result.tokenUsage}
                costEstimation={result.costEstimation}
              />
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Primary Language
                </h3>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {result.primary_language}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                  Languages Found
                </h3>
                <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                  {result.languages.length}
                </p>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  result.is_multilingual
                    ? "bg-orange-50 dark:bg-orange-900/20"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-1 ${
                    result.is_multilingual
                      ? "text-orange-800 dark:text-orange-200"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  Text Type
                </h3>
                <p
                  className={`text-lg font-semibold ${
                    result.is_multilingual
                      ? "text-orange-900 dark:text-orange-100"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {result.is_multilingual ? "Multilingual" : "Single Language"}
                </p>
              </div>
            </div>

            {/* Detailed Language Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Language Breakdown
              </h3>
              <div className="space-y-4">
                {result.languages.map((lang) => (
                  <div
                    key={`${lang.language_code}-${lang.language}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                              hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {lang.language}
                        </h4>
                        <span
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 
                                       text-gray-700 dark:text-gray-300 text-sm rounded-full"
                        >
                          {lang.language_code}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {Math.round(lang.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          confidence
                        </div>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lang.confidence * 100}%` }}
                        aria-label={`Confidence level: ${Math.round(lang.confidence * 100)}%`}
                      />
                    </div>

                    {/* Sample Text */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sample Text:
                      </h5>
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 
                                   dark:bg-gray-800 rounded p-3 border-l-4 border-blue-400"
                      >
                        "{lang.sample_text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LanguageDetectPage() {
  return (
    <ApiKeyProvider>
      <LanguageDetectionContent />
    </ApiKeyProvider>
  );
}
