<script setup lang="ts">
import type { Order } from '~/types/general';

const currentTab = ref(0);
const tabs = [
    { title: 'Payment', },
    { title: 'Preparing' },
    { title: 'Shipping' },
    { title: 'Delivered' },
    { title: 'Canceled' },
];

function changeTab(index: number) {
    currentTab.value = index;
}

const { data: data } = useFetch('/api/orders')

const orders: Order[] = data.value as any

function numberToStatus(number: number) {
    switch (number) {
        case 0:
            return 'wait_for_payment'
        case 1:
            return 'preparing'
        case 2:
            return 'shipping'
        case 3:
            return 'delivered'
        case 4:
            return 'canceled'
        default:
            return 'wait_for_payment'
    }
}

function filterOrders() {
    const status = numberToStatus(currentTab.value)
    return orders.filter(order => order.status === status)
}
</script>

<template>
    <ClientOnly>
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
                <a class="nav-link" :class="{ active: currentTab === index }" href="#" @click="changeTab(index)">
                    {{ tab.title }}
                </a>
            </li>
        </ul>

        <div v-for="(order, index) in filterOrders()" :key="order.id" class="mt-5">
            <OrderViewerDetail :order="order" />
        </div>

    </ClientOnly>
</template>