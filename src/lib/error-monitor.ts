type ErrorLevel = "error" | "warn" | "info";

interface ErrorLog {
  level: ErrorLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

const errorBuffer: ErrorLog[] = [];
const MAX_BUFFER = 100;

export function logError(
  message: string,
  context?: Record<string, unknown>,
  level: ErrorLevel = "error"
) {
  const entry: ErrorLog = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  errorBuffer.push(entry);
  if (errorBuffer.length > MAX_BUFFER) errorBuffer.shift();

  if (process.env.NODE_ENV === "development") {
    console[level === "info" ? "log" : level](`[DiamondIQ] ${message}`, context);
  }
}

export function getRecentErrors(limit = 20): ErrorLog[] {
  return errorBuffer.slice(-limit);
}
