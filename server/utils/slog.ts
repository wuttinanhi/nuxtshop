// server/utils/slog.ts

/**
 * A server-side console.log wrapper that includes the file and line number.
 */
export function slog(...args: any[]) {
  // 1. Get the stack trace
  const stack = new Error().stack?.split("\n");

  if (!stack || stack.length < 3) {
    console.log(...args); // Fallback
    return;
  }

  // 2. Get the caller line
  //    stack[0] is "Error"
  //    stack[1] is this function (slog)
  //    stack[2] is the line that *called* this function
  const callerLine = stack[2].trim();

  // 3. Clean it up (remove 'at ' prefix and any parentheses)
  //    Example: "at file:///path/to/project/server/api/test.get.ts:6:5"
  let location = callerLine.replace(/^at /, "");

  // Try to make the path relative to the project
  const projectRoot = process.cwd();
  location = location.replace(`file://${projectRoot}`, ".");

  // 4. Log with the location prefix
  console.log(`[${location}]`, ...args);
}
