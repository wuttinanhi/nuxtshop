export async function validateTurnstile(
  secret_key: string,
  token: string,
  remoteip = undefined
) {
  const formData = new FormData();

  formData.append("secret", secret_key);
  formData.append("response", token);
  if (remoteip) {
    formData.append("remoteip", remoteip);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return { success: false, "error-codes": ["internal-error"] };
  }
}

export async function validateTurnstileRequestWrapper(
  turnstileAnswer: string | undefined
) {
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

  // 1. Skip validation if the secret key is not set
  if (!turnstileSecretKey) {
    return;
  }

  // 2. Check if the answer exists
  if (!turnstileAnswer || turnstileAnswer.length <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "turnstileAnswer not set",
    });
  }

  // 3. Validate the token
  const validationResult = await validateTurnstile(
    turnstileSecretKey,
    turnstileAnswer
  );

  const errorCodes: string[] = validationResult["error-codes"] || [];

  // 4. Handle server-side secret key error
  if (errorCodes.includes("invalid-input-secret")) {
    console.error(
      "Error: Invalid Turnstile secret key (server side):",
      validationResult
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }

  // 5. Handle all other client-side failures
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Turnstile validation failed",
    });
  }

  // If we reach here, validation was successful
}
