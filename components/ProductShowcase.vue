<script setup lang="ts">
import type { IProduct } from "@/types/entity";
import type { CartModifyRequest } from '~/types/general';

const { pending, data } = await useFetch('/api/products/all',
    { transform: (data) => data as IProduct[] }
)

async function addToCart(product: IProduct) {
    console.log('Add to cart', product)

    const modifyRequest: CartModifyRequest = {
        mode: "add",
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

    console.log('Result', result)
}
</script>

<template>
    <div class="row g-3 p-md-5 " v-show="!pending">
        <div class="col-xs-12 col-md-4" v-for="product in data" :key="product.id">
            <div class="card">
                <img src="https://dummyjson.com/image/500/f5f5f5" class="card-img" alt="{{ product.imageURL }}">

                <div class="card-body">
                    <div class="text-center">
                        <h3 class="card-title">{{ product.name }}</h3>
                        <h5 class="card-text my-4">{{ product.price }}</h5>
                        <button class="btn btn-primary mt-3" @click="addToCart(product)">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>