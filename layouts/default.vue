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
