<template>
  <div>
    <UserProvider>
      <Navbar />

      <div class="container mt-5">
        <slot />
      </div>

      <div style="margin-bottom: 30vh"></div>
    </UserProvider>
  </div>
</template>
