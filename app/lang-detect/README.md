# Language Detection Feature

A modern, AI-powered language detection tool built with Next.js and OpenAI.

## Features

- ✨ **AI-Powered Detection**: Uses OpenAI's language models for accurate detection
- 🌍 **Multi-language Support**: Detects multiple languages in a single text
- 📊 **Confidence Scores**: Shows confidence levels for each detected language
- 🎨 **Modern UI**: Beautiful, accessible interface with dark mode support
- ⚡ **Real-time Analysis**: Fast processing with loading states
- 📱 **Responsive Design**: Works perfectly on all devices

## Setup Instructions

1. **Install Dependencies**: Make sure you have all packages installed:

   ```bash
   pnpm install
   ```

2. **Set up OpenAI API Key**:

   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

3. **Start Development Server**:

   ```bash
   pnpm dev
   ```

4. **Access the Feature**: Navigate to `/lang-detect` in your browser

## Usage

1. Enter or paste text (10-5000 characters) in the textarea
2. Click "Detect Language" or press Ctrl/Cmd + Enter
3. View the detailed results including:
   - Primary language
   - All detected languages with confidence scores
   - Sample text for each language
   - Whether the text is multilingual

## API Response Format

The feature returns data in the following format:

```json
{
  "languages": [
    {
      "language": "English",
      "language_code": "en",
      "confidence": 0.98,
      "sample_text": "example text in this language"
    }
  ],
  "primary_language": "English",
  "is_multilingual": false
}
```

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **AI Model**: OpenAI with custom prompt
- **Language**: TypeScript
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Server actions for optimal performance

## Environment Variables

Create a `.env.local` file with:

```
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: Make sure to add `.env.local` to your `.gitignore` file to keep your API key secure.
