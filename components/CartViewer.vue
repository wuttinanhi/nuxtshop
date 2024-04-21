<script setup lang="ts">
import type { Cart } from '~/types/general';

console.log('Client side', localStorage.getItem('token'))
let { data } = await useFetch('/api/carts/me', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    },
    transform: (data) => {
        return data as Cart
    }
})

async function createOrder() {
    try {
        await $fetch(`/api/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
            }
        })

        await navigateTo('/orders')
    } catch (error) {
        alert('Error when creating order')
    }
}

const totalPrice = computed(() => {
    if (!data.value) return 0
    return data.value.products.reduce((acc, item) => {
        return acc + item.product.price * item.quantity
    }, 0)
})
</script>

<template>
    <div v-if="data">
        <div class="card mb-5">
            <div class="card-body">
                <p class="card-text d-flex justify-content-between">
                <div>
                    <strong>Shipping:</strong> Address: {{ addressToString(data.user.address) }}
                </div>

                <NuxtLink to="/account" class="btn btn-primary">Edit Shipping Address</NuxtLink>
                </p>
            </div>
        </div>

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
                <tr v-for="(item, index) in data.products" :key="item.product.id">
                    <th scope="row">{{ index }}</th>
                    <td>{{ item.product.name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.product.price }}</td>
                    <td>{{ item.product.price * item.quantity }}</td>
                </tr>
            </tbody>
        </table>

        <div class="d-flex justify-content-end align-items-baseline gap-5 mt-5" v-show="data.products.length > 0">
            <h5 class="card-title">Total: {{ totalPrice }}</h5>

            <button class="btn btn-primary" @click="createOrder">Pay Now</button>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>