<script setup lang="ts">
import { ClientAuthService } from '~/clients/auth.client';
import type { Order, OrderStatus, OrderStatusAdmin } from '~/types/general';

const token = ClientAuthService.getToken();
const userData = await ClientAuthService.getUserData();

interface Tab {
    title: string;
    status: OrderStatusAdmin;
}

const currentTab: Ref<OrderStatusAdmin> = ref('all');

const tabs: Tab[] = [
    { title: 'All', status: 'all' },
    { title: 'Wait for payment', status: 'wait_for_payment' },
    { title: 'Preparing', status: 'preparing' },
    { title: 'Shipping', status: 'shipping' },
    { title: 'Delivered', status: 'delivered' },
    { title: 'Canceled', status: 'canceled' },
];

function changeTab(newTab: OrderStatusAdmin) {
    currentTab.value = newTab;
}

// getting admin order
let { data } = await useFetch(() => `/api/admin/orders/${currentTab.value}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token || ''
    },
    transform: (data) => {
        return data as Order[]
    },
    watch: [currentTab],
});

function updateOrderStatus(orderId: any, status: OrderStatus) {
    // if canceled prompt confirmation
    if (status === 'canceled') {
        const isConfirmed = confirm('Are you sure you want to cancel this order?');
        if (!isConfirmed) return;
    }

    const result = $fetch(`/api/admin/order/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token || ''
        },
        body: JSON.stringify({
            status: status
        }),
        onResponse: (ctx) => {
            if (ctx.response.status === 200) {
                console.log('Order updated to shipping');
            }
        }
    })
}
</script>
<template>
    <ul class="nav nav-pills nav-fill my-5">
        <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
            <a class="nav-link" :class="{ active: currentTab === tab.status }" href="#" @click="changeTab(tab.status)">
                {{ tab.title }}
            </a>
        </li>
    </ul>

    <table class="table mt-5">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Customer</th>
                <th scope="col">Total Price</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(order, index) in data" :key="order.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ order.user.firstName + ' ' + order.user.lastName }}</td>
                <td>{{ order.totalPrice }}</td>
                <td>{{ order.status }}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-primary" @click="updateOrderStatus(order.id, 'shipping')"
                            v-if="order.status === 'preparing'">
                            Update to Shipping
                        </button>
                        <button class="btn btn-danger" @click="updateOrderStatus(order.id, 'canceled')">
                            Cancel
                        </button>
                        <button class="btn btn-success">View</button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
