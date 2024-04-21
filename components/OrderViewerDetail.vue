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
        </div>
        <div class="card-body">
            <p class="card-text mb-3">
                <strong>Shipping:</strong> Address: {{ addressToString(order.address) }}
            </p>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
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
                <div>
                    <a href="#" class="btn btn-primary" v-show="order.status === 'wait_for_payment'">Pay Now</a>
                </div>

                <h5 class="card-title">Total: {{ order.totalPrice }}</h5>
            </div>
        </div>
    </div>
</template>