<script setup lang="ts">
import type { IOrder } from "~/types/entity";

interface OrderViewerDetailProps {
  order: IOrder;
}

const props = defineProps<OrderViewerDetailProps>();

async function payOrder(order: IOrder) {
  try {
    const result = await $fetch(`/api/orders/pay/${order.id}`, {
      method: "POST",
      headers: buildAuthHeader(),
    });

    // alert user with confetti
    alert("Order paid successfully 🎉");

    // refresh page
    location.reload();
  } catch (error) {
    alert("Error when paying order");
  }
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title">Order #{{ order.id }}</h5>
    </div>
    <div class="card-body">
      <p class="card-text mb-3">
        <strong>Shipping:</strong> Address: {{ addressToString(order.address) }}
      </p>

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
          <tr v-for="(item, index) in order.items" :key="item.product.id">
            <th scope="row">{{ index }}</th>
            <td>{{ item.product.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.product.price }}</td>
            <td>{{ item.product.price * item.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer text-muted">
      <div class="d-flex justify-content-between">
        <div>
          <button
            class="btn btn-primary"
            v-show="order.status === 'wait_for_payment'"
            @click="payOrder(order)"
          >
            Pay Now
          </button>
        </div>

        <h5 class="card-title">Total: {{ order.totalPrice }}</h5>
      </div>
    </div>
  </div>
</template>
