<template>
  <div>
    <UserProvider>
      <CartProvider>
        <Navbar />

        <div class="container mt-5">
          <slot></slot>
        </div>

        <div style="margin-bottom: 30vh"></div>
      </CartProvider>
    </UserProvider>
  </div>
</template>

<script setup>
// This will add the script to the <head>
// only when this component is mounted.
useHead({
  script: [
    {
      src: "https://challenges.cloudflare.com/turnstile/v0/api.js",
      async: true,
      defer: true,
    },
  ],
});
</script>
