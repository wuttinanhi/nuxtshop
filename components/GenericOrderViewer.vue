<script setup lang="ts">
import { KEY_USER } from "~/shared/enums/keys";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import { UserRole } from "~/shared/enums/userrole.enum";
import type { IOrder } from "~/types/entity";

interface GenericOrderViewerProps {
  mode: UserRole;
}

const props = defineProps<GenericOrderViewerProps>();

const currentTab = ref(OrderStatus.All);

const userInject = inject(KEY_USER, undefined);
const token = userInject?.token.value;

const tabs = [
  { title: "All", status: OrderStatus.All },
  { title: "Wait for Payment", status: OrderStatus.WaitForPayment },
  { title: "Preparing", status: OrderStatus.Preparing },
  { title: "Shipping", status: OrderStatus.Shipping },
  { title: "Delivered", status: OrderStatus.Delivered },
  { title: "Canceled", status: OrderStatus.Canceled },
];

function changeTab(newTab: OrderStatus) {
  currentTab.value = newTab;
}

function getOrderFetchURL(): string {
  if (props.mode === UserRole.ADMIN) {
    return `/api/admin/orders?status=${currentTab.value}`;
  }
  return `/api/orders?status=${currentTab.value}`;
}

const {
  data: orders,
  error,
  pending,
} = await useFetch(() => getOrderFetchURL(), {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  transform: (data) => {
    return data as IOrder[];
  },
  watch: [currentTab],
});
</script>
<template>
  <div v-if="pending">
    <p class="text-center">Loading...</p>
  </div>

  <div v-else-if="error">
    <p class="text-center">Error: {{ error.message }}</p>
  </div>

  <div v-else>
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

    <div v-for="(order, index) in orders" :key="order.id" class="mt-5">
      <OrderViewerDetail
        :order="order"
        :mode="props.mode"
        v-if="currentTab === OrderStatus.All || currentTab === order.status"
      />
    </div>

    <div v-if="orders && orders.length === 0" class="mt-5">
      <p class="text-center">No orders found</p>
    </div>
  </div>
</template>
