import { encode } from "gpt-tokenizer";

// OpenAI pricing (as of 2024)
// These prices are per 1,000 tokens
export const OPENAI_PRICING = {
	"gpt-4": {
		input: 0.03, // $0.03 per 1K input tokens
		output: 0.06, // $0.06 per 1K output tokens
	},
	"gpt-4-turbo": {
		input: 0.01, // $0.01 per 1K input tokens
		output: 0.03, // $0.03 per 1K output tokens
	},
	"gpt-3.5-turbo": {
		input: 0.0015, // $0.0015 per 1K input tokens
		output: 0.002, // $0.002 per 1K output tokens
	},
	"gpt-4.1-nano": {
		input: 0.0001, // $0.10 per 1M tokens = $0.0001 per 1K tokens
		cacheInput: 0.000025, // $0.025 per 1M tokens = $0.000025 per 1K tokens
		output: 0.0004, // $0.40 per 1M tokens = $0.0004 per 1K tokens
	},
} as const;

export interface TokenUsage {
	inputTokens: number;
	cacheInputTokens?: number; // Optional for models that support cache input
	outputTokens: number;
	totalTokens: number;
}

export interface CostEstimation {
	inputCost: number;
	cacheInputCost?: number; // Optional for models that support cache input
	outputCost: number;
	totalCost: number;
	currency: string;
}

/**
 * Count tokens in text using gpt-tokenizer
 * Works reliably in web environments without WASM
 */
export function countTokens(text: string, model = "gpt-4"): number {
	try {
		// gpt-tokenizer uses GPT-4 encoding by default, which works for all models
		const tokens = encode(text);
		return tokens.length;
	} catch (error) {
		// Fallback to approximate token count (1 token ≈ 0.75 words)
		console.warn(
			"Failed to count tokens with gpt-tokenizer, using approximation:",
			error,
		);
		const wordCount = text.split(/\s+/).length;
		return Math.ceil(wordCount / 0.75);
	}
}

/**
 * Calculate cost estimation based on token usage and model
 */
export function calculateCost(
	tokenUsage: TokenUsage,
	model: keyof typeof OPENAI_PRICING = "gpt-4",
): CostEstimation {
	const pricing = OPENAI_PRICING[model] || OPENAI_PRICING["gpt-4"];

	const inputCost = (tokenUsage.inputTokens / 1000) * pricing.input;
	const outputCost = (tokenUsage.outputTokens / 1000) * pricing.output;

	// Calculate cache input cost if applicable
	let cacheInputCost = 0;
	if (tokenUsage.cacheInputTokens && "cacheInput" in pricing) {
		cacheInputCost = (tokenUsage.cacheInputTokens / 1000) * pricing.cacheInput;
	}

	const totalCost = inputCost + cacheInputCost + outputCost;

	const result: CostEstimation = {
		inputCost: Math.round(inputCost * 10000) / 10000, // Round to 4 decimal places
		outputCost: Math.round(outputCost * 10000) / 10000,
		totalCost: Math.round(totalCost * 10000) / 10000,
		currency: "USD",
	};

	// Add cache input cost if applicable
	if (cacheInputCost > 0) {
		result.cacheInputCost = Math.round(cacheInputCost * 10000) / 10000;
	}

	return result;
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
	if (cost < 0.0001) {
		return "<$0.0001";
	}
	return `$${cost.toFixed(4)}`;
}

/**
 * Format token count for display
 */
export function formatTokenCount(count: number): string {
	if (count < 1000) {
		return count.toString();
	}
	return `${(count / 1000).toFixed(1)}K`;
}
