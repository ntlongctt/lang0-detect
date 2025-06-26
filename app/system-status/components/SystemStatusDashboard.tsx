"use client";

import type { QueueStats } from "../page";

interface SystemStatusDashboardProps {
  stats: QueueStats | null;
  isLoading: boolean;
  error: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "red" | "green" | "gray";
  description: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  description,
}: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    gray: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200",
  };

  const iconColorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
    green: "text-green-600 dark:text-green-400",
    gray: "text-gray-600 dark:text-gray-400",
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
          <p className="text-xs opacity-60 mt-1">{description}</p>
        </div>
        <div className={`flex-shrink-0 ${iconColorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-4" />
      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
    </div>
  </div>
);

export function SystemStatusDashboard({
  stats,
  isLoading,
  error,
}: SystemStatusDashboardProps) {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Error Loading Data
            </h3>
            <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingCard key={`loading-card-${index}`} />
        ))}
      </div>
    );
  }

  const totalJobs =
    stats.active +
    stats.waiting +
    stats.delayed +
    stats.completed +
    stats.failed;

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Active Jobs"
          value={stats.active}
          color="blue"
          description="Currently processing"
          icon={
            <svg
              className="w-8 h-8"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.23 10.66a.75.75 0 00-1.06 1.061l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatCard
          title="Waiting Jobs"
          value={stats.waiting}
          color="yellow"
          description="In queue"
          icon={
            <svg
              className="w-8 h-8"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatCard
          title="Delayed Jobs"
          value={stats.delayed}
          color="gray"
          description="Scheduled for later"
          icon={
            <svg
              className="w-8 h-8"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V10a.75.75 0 00-.75-.75h-2.5a.75.75 0 000 1.5h1.75v2.5z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatCard
          title="Completed Jobs"
          value={stats.completed}
          color="green"
          description="Successfully finished"
          icon={
            <svg
              className="w-8 h-8"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatCard
          title="Failed Jobs"
          value={stats.failed}
          color="red"
          description="Encountered errors"
          icon={
            <svg
              className="w-8 h-8"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Queue Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              Total Jobs:
            </span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {totalJobs.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              Success Rate:
            </span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {totalJobs > 0
                ? ((stats.completed / totalJobs) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              Error Rate:
            </span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {totalJobs > 0
                ? ((stats.failed / totalJobs) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Pending:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {(stats.waiting + stats.delayed).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
