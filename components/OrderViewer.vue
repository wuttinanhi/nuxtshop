<script setup lang="ts">
import { KEY_USER } from "~/shared/enums/keys";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import type { IOrder } from "~/types/entity";

const userInject = inject(KEY_USER, undefined);

const currentTab = ref(OrderStatus.WaitForPayment);

const tabs = [
  { title: "Payment", status: OrderStatus.WaitForPayment },
  { title: "Preparing", status: OrderStatus.Preparing },
  { title: "Shipping", status: OrderStatus.Shipping },
  { title: "Delivered", status: OrderStatus.Delivered },
  { title: "Canceled", status: OrderStatus.Canceled },
];

function changeTab(newTab: OrderStatus) {
  console.log("Tab changed to: ", newTab);
  currentTab.value = newTab;
}

const {
  data: orders,
  error,
  pending,
} = await useFetch(() => `/api/orders/all?status=${currentTab.value}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + (userInject ? userInject.token.value : ""),
  },
  transform: (data) => {
    return data as IOrder[];
  },
  watch: [currentTab],
});
</script>

<template>
  <div v-if="userInject && userInject.token.value">
    <ul class="nav nav-pills nav-fill">
      <li class="nav-item" v-for="(tab, index) in tabs" :key="tab.status">
        <a
          class="nav-link"
          :class="{ active: currentTab === tab.status }"
          href="#"
          @click="changeTab(tab.status)"
        >
          {{ tab.title }}
        </a>
      </li>
    </ul>

    <div v-if="pending">
      <p class="text-center">Loading...</p>
    </div>
    <div v-else-if="error">
      <p class="text-center">Error: {{ error.message }}</p>
    </div>
    <div v-else>
      <div v-for="(order, index) in orders" :key="order.id" class="mt-5">
        <OrderViewerDetail :order="order" />
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-center">Please login to see your orders.</p>
  </div>
</template>
