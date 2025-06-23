import {
  type TokenUsage,
  type CostEstimation,
  formatCost,
  formatTokenCount,
} from "../utils/tokenUtils";

interface TokenUsageDisplayProps {
  tokenUsage: TokenUsage;
  costEstimation: CostEstimation;
}

export default function TokenUsageDisplay({
  tokenUsage,
  costEstimation,
}: TokenUsageDisplayProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Token Usage & Cost
      </h3>

      <div
        className={`grid gap-4 ${costEstimation.cacheInputCost ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4"}`}
      >
        {/* Input Tokens */}
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Input Tokens
          </div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatTokenCount(tokenUsage.inputTokens)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatCost(costEstimation.inputCost)}
          </div>
        </div>

        {/* Cache Input Tokens - Only show if applicable */}
        {costEstimation.cacheInputCost && tokenUsage.cacheInputTokens && (
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Cache Input
            </div>
            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {formatTokenCount(tokenUsage.cacheInputTokens)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatCost(costEstimation.cacheInputCost)}
            </div>
          </div>
        )}

        {/* Output Tokens */}
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Output Tokens
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatTokenCount(tokenUsage.outputTokens)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatCost(costEstimation.outputCost)}
          </div>
        </div>

        {/* Total Tokens */}
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Total Tokens
          </div>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {formatTokenCount(tokenUsage.totalTokens)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Combined
          </div>
        </div>

        {/* Total Cost */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Cost
          </div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {formatCost(costEstimation.totalCost)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            USD (GPT-4.1-nano)
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>
              Input: {formatCost(costEstimation.inputCost)} (
              {tokenUsage.inputTokens} tokens)
            </span>
          </div>
          {costEstimation.cacheInputCost && tokenUsage.cacheInputTokens && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-500 rounded-full" />
              <span>
                Cache: {formatCost(costEstimation.cacheInputCost)} (
                {tokenUsage.cacheInputTokens} tokens)
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>
              Output: {formatCost(costEstimation.outputCost)} (
              {tokenUsage.outputTokens} tokens)
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          * Pricing based on GPT-4.1-nano rates: $0.10/1M input tokens,
          $0.025/1M cache input tokens, $0.40/1M output tokens
        </div>
      </div>
    </div>
  );
}
