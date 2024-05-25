<script setup lang="ts">
import { KEY_USER } from "~/shared/enums/keys";
import { UserRole } from "~/shared/enums/userrole.enum";
import type { IOrder } from "~/types/entity";

const order = ref<IOrder | null>(null);
const orderId = ref<number | null>(null);

if (process.client) {
  const userInject = inject(KEY_USER, undefined);
  const token = ref(userInject?.token);

  // get order id from route params
  const route = useRoute();

  // convert id to number
  orderId.value = parseInt(route.params.id as string, 10);

  const result = await $fetch(`/api/orders/info/${orderId.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
  });

  order.value = result as IOrder;
}
</script>

<template>
  <ClientOnly>
    <div v-if="order">
      <h3>Order Detail: {{ orderId }}</h3>
      <br />
      <OrderViewerDetail :order="order" :mode="UserRole.USER" />
    </div>
  </ClientOnly>
</template>
