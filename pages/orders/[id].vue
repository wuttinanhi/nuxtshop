<script lang="ts" setup>
import {KEY_USER} from "~/shared/enums/keys";
import {UserRole} from "~/shared/enums/userrole.enum";
import type {IOrder} from "~/types/entity";

const order = ref<IOrder | null>(null);
const loadError = ref<string | null>(null);
const orderId = ref<number | null>(null);

if (process.client) {
  try {
    const userInject = inject(KEY_USER, undefined);
    const token = ref(userInject?.token);

    // get order id from route params
    const route = useRoute();

    // convert id to number
    orderId.value = parseInt(route.params.id as string, 10);

    const result = await $fetch(`/api/orders/${orderId.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
    });

    order.value = result as unknown as IOrder;
  } catch (error) {
    const e = error as Error;
    // if error message contains unauthorized
    if (e.message.includes("401")) {
      loadError.value = "Unauthorized";
    } else {
      loadError.value = e.message;
    }
  }
}
</script>

<template>
  <ClientOnly>
    <div v-if="order">
      <h3>Order Detail: {{ orderId }}</h3>
      <br/>
      <OrderViewerDetail :mode="UserRole.USER" :order="order" :show-user-data="true"/>
    </div>

    <div v-if="loadError" class="text-center">
      <h3>Error: {{ loadError }}</h3>
    </div>
  </ClientOnly>
</template>
