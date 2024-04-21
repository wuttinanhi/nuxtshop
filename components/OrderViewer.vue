<script setup lang="ts">
import type { Order } from '~/types/general';

const currentTab = ref(0);
const tabs = [
    { title: 'Payment', },
    { title: 'Preparing' },
    { title: 'Shipping' },
    { title: 'Arrived' },
    { title: 'Canceled' },
];

function changeTab(index: number) {
    currentTab.value = index;
}

const { data: data } = useFetch('/api/orders')

const orders: Order[] = data.value as any
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

        <div v-for="(order, index) in orders" :key="order.id" class="mt-5">
            <OrderViewerDetail :order="order" />
        </div>

    </ClientOnly>
</template>