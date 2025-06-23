"use server";

import OpenAI from "openai";

export interface LanguageDetectionResult {
	languages: Array<{
		language: string;
		language_code: string;
		confidence: number;
		sample_text: string;
	}>;
	primary_language: string;
	is_multilingual: boolean;
}

export async function detectLanguage(
	text: string,
	apiKey: string,
): Promise<{
	success: boolean;
	data?: LanguageDetectionResult;
	error?: string;
}> {
	try {
		if (!apiKey) {
			return {
				success: false,
				error: "OpenAI API key is required",
			};
		}

		if (!apiKey.startsWith("sk-")) {
			return {
				success: false,
				error: "Invalid API key format",
			};
		}

		if (!text.trim()) {
			return {
				success: false,
				error: "Please provide text to analyze",
			};
		}

		if (text.length < 10) {
			return {
				success: false,
				error:
					"Text must be at least 10 characters long for accurate detection",
			};
		}

		if (text.length > 5000) {
			return {
				success: false,
				error: "Text is too long. Please provide text under 5000 characters",
			};
		}

		// Create OpenAI client with the provided API key
		console.log(
			"🔑 Creating OpenAI client with API key:",
			`${apiKey.substring(0, 7)}...`,
		);
		const openai = new OpenAI({
			apiKey: apiKey,
		});

		console.log("✅ OpenAI client created successfully");
		console.log("📤 Sending request to OpenAI...");
		console.log("📝 Text length:", text.length);
		console.log("📝 Text preview:", `${text.substring(0, 100)}...`);

		const response = await openai.responses.create({
			prompt: {
				id: "pmpt_685956450e0881979624cfdc2b9f2bb800ef8bfdcd611bd5",
				version: "1",
			},
			input: [
				{
					role: "user",
					content: [
						{
							type: "input_text",
							text: text,
						},
					],
				},
			],
			reasoning: {},
			max_output_tokens: 2048,
			store: true,
		});

		console.log("📥 Received response from OpenAI");
		console.log("📊 Response structure:", {
			hasOutput: !!response.output,
			outputLength: response.output?.length || 0,
			outputType: typeof response.output?.[0],
		});

		console.log("🔍 Response received, processing...");

		// Handle the response from OpenAI
		if (response.output && response.output.length > 0) {
			const result = response.output[0];
			console.log("🔍 Raw result structure:", result);

			// Try to extract text content from the response
			let textContent = "";
			if (typeof result === "object" && result !== null) {
				// Check for content array structure (new format)
				if (
					"content" in result &&
					Array.isArray(result.content) &&
					result.content.length > 0
				) {
					const contentItem = result.content[0];
					if (
						typeof contentItem === "object" &&
						contentItem !== null &&
						"text" in contentItem
					) {
						textContent = contentItem.text as string;
						console.log("✅ Found text in content[0].text");
					}
				} else if ("text" in result && typeof result.text === "string") {
					// Check for direct text property
					textContent = result.text;
					console.log("✅ Found text in result.text");
				} else if ("content" in result && typeof result.content === "string") {
					// Check for direct content property (string)
					textContent = result.content;
					console.log("✅ Found text in result.content");
				} else if (typeof result === "string") {
					// Check if result itself is a string
					textContent = result;
					console.log("✅ Result is a string");
				}
			}

			if (textContent) {
				console.log("✅ Found text content, parsing JSON...");
				console.log(
					"📄 Raw response text:",
					`${textContent.substring(0, 200)}...`,
				);

				try {
					const parsedResult = JSON.parse(
						textContent,
					) as LanguageDetectionResult;
					console.log("🎉 Successfully parsed result:", parsedResult);

					// Validate the parsed result has required fields
					if (
						parsedResult.languages &&
						parsedResult.primary_language !== undefined &&
						parsedResult.is_multilingual !== undefined
					) {
						return {
							success: true,
							data: parsedResult,
						};
					}
				} catch (parseError) {
					console.log("❌ Failed to parse JSON:", parseError);
					console.log("📄 Text that failed to parse:", textContent);
					return {
						success: false,
						error: "Failed to parse response as JSON",
					};
				}
			}
			console.log("❌ No text content found in response");
			console.log("🔍 Raw result:", result);
		}

		if (!response.output || response.output.length === 0) {
			console.log("❌ No output in response");
			console.log("🔍 Full response:", response);
		}

		return {
			success: false,
			error: "Unexpected response format from OpenAI",
		};
	} catch (error) {
		console.error("Language detection error:", error);

		// Provide more specific error messages
		if (error instanceof Error) {
			if (
				error.message.includes("401") ||
				error.message.includes("Unauthorized")
			) {
				return {
					success: false,
					error: "Invalid API key. Please check your OpenAI API key.",
				};
			}
			if (error.message.includes("429")) {
				return {
					success: false,
					error: "Rate limit exceeded. Please try again later.",
				};
			}
			if (error.message.includes("insufficient_quota")) {
				return {
					success: false,
					error: "Insufficient API quota. Please check your OpenAI account.",
				};
			}
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: false,
			error: "An unexpected error occurred",
		};
	}
}
