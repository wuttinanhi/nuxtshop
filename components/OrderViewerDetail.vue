<script setup lang="ts">
import { defineProps } from 'vue';
import type { Order } from '~/types/general';

interface OrderViewerDetailProps {
    order: Order;
}

const props = defineProps<OrderViewerDetailProps>();
</script>

<template>
    <div class="card">
        <div class="card-header">
            <h5 class="card-title">Order #{{ order.id }}</h5>
            <p class="card-text">
                <strong>Address: {{ order.address }}</strong>
            </p>
        </div>
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="(item, index) in order.items" :key="item.id">
                        <th scope="row">{{ index }}</th>
                        <td>{{ item.name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-footer text-muted">
            <div class="d-flex justify-content-between">
                <a href="#" class="btn btn-primary">Go somewhere</a>
                <h5 class="card-title">Total: {{ order.totalPrice }}</h5>
            </div>
        </div>
    </div>
</template>