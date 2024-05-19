<script setup lang="ts">
import type { IOrderItem } from "~/types/entity";

const props = defineProps({
  items: {
    type: Array as PropType<IOrderItem[]>,
    required: true,
  },
});
</script>
<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Product</th>
        <th scope="col">Quantity</th>
        <th scope="col">Price</th>
        <th scope="col">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in props.items" :key="item.id">
        <th scope="row">{{ index + 1 }}</th>
        <td v-if="item.product">{{ item.product.name }}</td>
        <td v-if="item.product">{{ item.quantity }}</td>
        <td v-if="item.product">{{ item.product.price }}</td>
        <td v-if="item.product">{{ item.product.price * item.quantity }}</td>
      </tr>
    </tbody>
  </table>
</template>
