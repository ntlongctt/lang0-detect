"use client";

import { useState, useEffect, useCallback } from "react";
import { SystemStatusDashboard } from "./components/SystemStatusDashboard";
import { RefreshControls } from "./components/RefreshControls";

export interface QueueStats {
  active: number;
  waiting: number;
  delayed: number;
  completed: number;
  failed: number;
}

export default function SystemStatusPage() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError("");
      const response = await fetch(
        "https://rshld.eu/api/v1/queue/job/stats/info"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QueueStats = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMessage);
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleManualRefresh = useCallback(() => {
    setIsLoading(true);
    fetchStats();
  }, [fetchStats]);

  const handleAutoRefreshToggle = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => !prev);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!isAutoRefreshEnabled) return;

    const interval = setInterval(() => {
      fetchStats();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Status Monitor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring of queue job statistics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-8">
          <RefreshControls
            isAutoRefreshEnabled={isAutoRefreshEnabled}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            onAutoRefreshToggle={handleAutoRefreshToggle}
            onManualRefresh={handleManualRefresh}
          />
        </div>

        {/* Dashboard */}
        <SystemStatusDashboard
          stats={stats}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
