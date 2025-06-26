"use client";

interface RefreshControlsProps {
  isAutoRefreshEnabled: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;
  onAutoRefreshToggle: () => void;
  onManualRefresh: () => void;
}

export function RefreshControls({
  isAutoRefreshEnabled,
  isLoading,
  lastUpdated,
  onAutoRefreshToggle,
  onManualRefresh,
}: RefreshControlsProps) {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Last Updated Info */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isAutoRefreshEnabled
                ? "bg-green-500 animate-pulse"
                : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {formatLastUpdated(lastUpdated)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Auto-refresh Toggle */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="auto-refresh-toggle"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Auto-refresh (5s)
            </label>
            <button
              id="auto-refresh-toggle"
              type="button"
              onClick={onAutoRefreshToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAutoRefreshEnabled
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-600"
              }`}
              role="switch"
              aria-checked={isAutoRefreshEnabled}
              aria-label="Toggle auto-refresh"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAutoRefreshEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={onManualRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Manually refresh data"
          >
            <svg
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}
