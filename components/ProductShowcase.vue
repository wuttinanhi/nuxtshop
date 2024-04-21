<script setup lang="ts">
import type { Product } from '~/types/general';

const { pending, data } = await useFetch('/api/products/all',
    { transform: (data) => data as Product[] }
)
</script>

<template>
    <div class="row row-cols-3 g-4" v-show="!pending">
        <div class="col" v-for="product in data" :key="product.id">
            <div class="card">
                <img src="https://cdn.dummyjson.com/product-images/1/1.jpg" class="card-img"
                    alt="{{ product.imageURL }}">

                <div class="card-body">
                    <div class="text-center">
                        <h3 class="card-title">{{ product.name }}</h3>
                        <h5 class="card-text my-4">{{ product.price }}</h5>
                        <button class="btn btn-primary mt-3">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>