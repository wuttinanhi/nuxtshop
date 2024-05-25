<script setup lang="ts">
// get order id from route params
const route = useRoute();

// convert id to number
const orderId = ref(parseInt(route.query.order_id as string, 10));
</script>
<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 50vh"
  >
    <div class="text-center">
      <h1>Payment Success</h1>

      <NuxtLink :to="`/orders/${orderId}`" class="btn btn-primary">
        View Order Detail
      </NuxtLink>
    </div>
  </div>
</template>
