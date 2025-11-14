<script setup lang="ts">
import {
  TurnstileService,
  type TurnstileServiceGetResult,
} from "~/clients/turnstile.client";

const turnstileData = ref<null | TurnstileServiceGetResult>(null);

const el = ref();

const emit = defineEmits(["resp"]);

if (import.meta.client) {
  onMounted(async () => {
    const turnstileFetchResult = await TurnstileService.get();
    turnstileData.value = turnstileFetchResult;

    if (!window.turnstile) {
      console.error("window.turnstile is not set", window.turnstile);
      return;
    }

    if (turnstileFetchResult.enabled && window.turnstile) {
      console.log("turnstile setup");
      console.log("turnstileFetchResult", turnstileData.value);
      console.log("el", el.value);

      window.turnstile.render(el.value, {
        sitekey: turnstileFetchResult.sitekey,
        callback: function (token: string) {
          console.log("Success:", token);
          emit("resp", token); // Send the token to the parent
        },

        // 3. (Recommended) Handle errors and expiration
        "error-callback": function () {
          console.error("Turnstile error or expired.");
          emit("resp", null); // Send null on failure
        },

        "expired-callback": function () {
          console.warn("Turnstile expired, resetting.");
          emit("resp", null); // Send null on expiration
        },
      });
    }
  });
}
</script>

<template>
  <!-- TURNSTILE START -->
  <ClientOnly>
    <component is="div" ref="el" />
  </ClientOnly>
  <!-- TURNSTILE END -->
</template>
