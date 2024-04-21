<script setup lang="ts">
import type { Product } from '~/types/general';

const { pending, data: data } = await useFetch('/api/products')

const products: Product[] = data.value
</script>

<template>
    <div class="row row-cols-3 g-4">
        <div class="col" v-for="product in products" :key="product.id">
            <div class="card">
                <img src="https://cdn.dummyjson.com/product-images/1/1.jpg" class="card-img"
                    alt="{{ product.imageURL }}">

                <div class="card-body">
                    <div class="text-center">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <h3 class="card-text">{{ product.price }}</h3>
                        <button class="btn btn-primary mt-3">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>