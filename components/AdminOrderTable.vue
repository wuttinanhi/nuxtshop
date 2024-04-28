<script setup lang="ts">
import { ClientAuthService } from '~/clients/auth.client';
import type { Order, OrderStatus } from '~/types/general';

const token = ClientAuthService.getToken();
const userData = await ClientAuthService.getUserData();

// getting admin order
let { data } = await useFetch('/api/admin/orders', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token || ''
    },
    transform: (data) => {
        return data as Order[]
    },
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
    <div v-if="data">
        <table class="table">
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
                            <button class="btn btn-primary" @click="updateOrderStatus(order.id, 'shipping')">
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
    </div>
</template>