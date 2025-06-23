# 🛠️ Debugging Next.js Server Actions

A comprehensive guide to debugging server actions in Next.js applications.

## 🎯 **Quick Debugging Setup**

Your language detection action is now equipped with comprehensive logging. Here's how to debug it effectively:

### **1. 📊 Console Logging (Recommended)**

Your action now includes detailed console logs. To see them:

```bash
# Terminal where you ran `pnpm dev`
# You'll see logs like:
🔑 Creating OpenAI client with API key: sk-proj...
✅ OpenAI client created successfully
📤 Sending request to OpenAI...
📝 Text length: 156
📝 Text preview: Hello world, this is a test...
📥 Received response from OpenAI
📊 Response structure: { hasOutput: true, outputLength: 1, outputType: 'object' }
✅ Found text content, parsing JSON...
📄 Raw response text: {"languages":[{"language":"English"...
🎉 Successfully parsed result: { languages: [...], primary_language: "English", is_multilingual: false }
```

### **2. 🔍 Browser DevTools**

1. **Open DevTools**: Press `F12` or `Cmd+Option+I`
2. **Go to Network Tab**: Monitor API calls
3. **Filter by Fetch/XHR**: See server action requests
4. **Console Tab**: Check for client-side errors

### **3. 🎯 VS Code Debugger Setup**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "serverReadyAction": {
        "pattern": "ready - started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      },
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Then:

1. Set breakpoints in your action file
2. Press `F5` to start debugging
3. Trigger your action from the browser

## 🚨 **Common Issues & Solutions**

### **Issue 1: Debugger Statements Not Working**

```typescript
// ❌ Don't use debugger in production or with linting
debugger;

// ✅ Use console.log instead
console.log("🔍 Debug point reached", { variable });
```

### **Issue 2: OpenAI API Errors**

```typescript
// Check your console for specific error messages:
// "401 Unauthorized" = Invalid API key
// "429 Too Many Requests" = Rate limit exceeded
// "insufficient_quota" = No credits remaining
```

### **Issue 3: Response Format Issues**

```typescript
// Your action now logs the raw response structure
// Look for these logs to understand the response format:
console.log("📊 Response structure:", {
  hasOutput: !!response.output,
  outputLength: response.output?.length || 0,
  outputType: typeof response.output?.[0],
});
```

## 🛠️ **Advanced Debugging Techniques**

### **1. Custom Logging Hook**

Create `hooks/useDebugLog.ts`:

```typescript
export function useDebugLog(label: string) {
  return (data: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🐛 [${label}]`, data);
    }
  };
}
```

Usage:

```typescript
const debug = useDebugLog("LanguageDetection");
debug("Starting detection process...");
```

### **2. Error Boundary for Actions**

Create `components/ActionErrorBoundary.tsx`:

```typescript
'use client';

import { useEffect } from 'react';

export function ActionErrorBoundary({ children, onError }: {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      onError?.(event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [onError]);

  return <>{children}</>;
}
```

### **3. Request/Response Interceptor**

Add to your action:

```typescript
const requestLog = {
  timestamp: new Date().toISOString(),
  textLength: text.length,
  apiKeyPrefix: apiKey.substring(0, 7),
  requestId: Math.random().toString(36).substring(7),
};

console.log("📋 Request Log:", requestLog);
```

## 🔧 **Debugging Checklist**

When your action fails, check:

- [ ] **API Key**: Is it valid and has the right format?
- [ ] **Network**: Can you reach OpenAI's servers?
- [ ] **Quota**: Do you have sufficient API credits?
- [ ] **Text Input**: Is the text within acceptable limits?
- [ ] **Response Format**: Is OpenAI returning the expected structure?
- [ ] **JSON Parsing**: Is the response valid JSON?

## 📱 **Mobile Debugging**

For mobile testing:

1. Use Chrome DevTools remote debugging
2. Check `chrome://inspect` on desktop
3. Connect your mobile device
4. Access the debugging interface

## 🎨 **Visual Debugging**

Add visual indicators in your UI:

```typescript
// Add to your component
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
    Debug: {isPending ? 'Processing...' : 'Ready'}
  </div>
)}
```

## 🚀 **Performance Debugging**

Monitor action performance:

```typescript
const startTime = performance.now();
// ... your action logic
const endTime = performance.now();
console.log(`⏱️ Action took ${endTime - startTime} milliseconds`);
```

## 📝 **Next Steps**

1. **Test your action** - Trigger it and watch the console logs
2. **Check Network tab** - Monitor the requests in DevTools
3. **Verify API key** - Ensure it's working with a simple test
4. **Monitor quotas** - Check your OpenAI dashboard for usage

Your action is now fully instrumented for debugging! 🎉
