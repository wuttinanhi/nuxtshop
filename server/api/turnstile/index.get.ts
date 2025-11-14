let turnstile_sitekey_cache = "";

export default defineEventHandler(async (event) => {
  if (turnstile_sitekey_cache.length <= 0) {
    const envTurnstileValue = process.env.TURNSTILE_SITE_KEY;
    if (envTurnstileValue) {
      console.log("TURNSTILE Enabled");
      turnstile_sitekey_cache = envTurnstileValue;
    } else {
      console.log("TURNSTILE Disabled");
    }
  }

  let enabled = turnstile_sitekey_cache.length >= 1;

  return {
    enabled: enabled,
    sitekey: turnstile_sitekey_cache,
  };
});
