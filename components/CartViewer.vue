<script setup lang="ts">
import type { ICart, IProduct } from "@/types/entity";
import type { CartModifyRequest } from "~/types/general";


const cartVersion = ref(0)

// getting user cart
let { data } = await useFetch('/api/carts/me', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
    },
    transform: (data) => {
        return data as ICart
    },
    watch: [cartVersion]
})

async function createOrder() {
    try {
        const result = await $fetch(`/api/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
            },
            onResponseError: (error) => {
                alert(error.response._data.message)
            }
        })

        console.log("result.ok", result.ok)

        console.log('Order created')
        console.log(result)

        await navigateTo('/orders')
    } catch (e) {
        console.error(e)
    }
}

async function removeAll(product: IProduct) {
    console.log('Remove from cart', product)

    const modifyRequest: CartModifyRequest = {
        mode: "remove",
        productID: product.id!,
        quantity: 1,
    }

    const result = await $fetch("/api/carts/modify", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
        },
        body: JSON.stringify(modifyRequest)
    })

    console.log('Remove Result', result)

    cartVersion.value++
}

async function changeQuantity(product: IProduct, quantity: number) {
    console.log('Change product quantity', product, quantity)

    const modifyRequest: CartModifyRequest = {
        mode: "set",
        productID: product.id!,
        quantity: quantity,
    }

    const result = await $fetch("/api/carts/modify", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
        },
        body: JSON.stringify(modifyRequest)
    })

    console.log('Change Quantity Result', result)

    cartVersion.value++
}

const totalPrice = computed(() => {
    if (!data.value) return 0
    return calculateTotalPrice(data.value.items)
})

</script>

<template>
    <div v-if="data">
        <div class="card mb-5">
            <div class="card-body">
                <p class="card-text d-flex justify-content-between">
                <div v-if="data.user && data.user.address">
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
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data.items" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ item.product!.name }}</td>
                    <td>
                        <button class="btn btn-primary"
                            @click="changeQuantity(item.product!, item.quantity - 1)">-</button>
                        {{ item.quantity }}
                        <button class="btn btn-primary"
                            @click="changeQuantity(item.product!, item.quantity + 1)">+</button>
                    </td>
                    <td>{{ (item.product!.price).toFixed(2) }}</td>
                    <td>{{ (item.product!.price * item.quantity).toFixed(2) }}</td>
                    <td>
                        <button class="btn btn-danger" @click="removeAll(item.product!)">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="d-flex justify-content-end align-items-baseline gap-5 mt-5" v-if="data.items.length > 0">
            <h5 class="card-title">Total: {{ totalPrice.toFixed(2) }}</h5>
            <button class="btn btn-primary" @click="createOrder">Pay Now</button>
        </div>
        <div class="d-flex justify-content-center align-items-baseline mt-5" v-else>
            <h5 class="card-title">Cart is empty</h5>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>