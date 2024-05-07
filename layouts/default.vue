<template>
  <div>
    <Navbar />
    <UserLoader />

    <div class="container mt-5">
      <slot />
    </div>

    <div style="margin-bottom: 30vh"></div>
  </div>
</template>
