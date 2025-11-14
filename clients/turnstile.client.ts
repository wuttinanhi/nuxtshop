/// <reference types="@types/cloudflare-turnstile" />

export class TurnstileService {
  public static async get() {
    const req = await fetch("/api/turnstile");
    const resJson = await req.json();
    return resJson as TurnstileServiceGetResult;
  }
}

export interface TurnstileServiceGetResult {
  enabled: boolean;
  sitekey: string;
}

declare global {
  interface Window {
    // @types/cloudflare-turnstile doesn't provide full api
    turnstile: Turnstile.Turnstile;
  }
}
