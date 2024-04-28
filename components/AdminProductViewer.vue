<script setup lang="ts">
import { ClientAuthService } from '~/clients/auth.client';
import type { Product } from '~/types/general';
import AdminProductDialog from './AdminProductDialog.vue';

const token = ClientAuthService.getToken();
const userData = await ClientAuthService.getUserData();

let { data } = await useFetch(() => `/api/admin/products`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token || ''
    },
    transform: (data) => {
        return data as Product[]
    },
});
</script>

<template>
    <ClientOnly>
        <div class="my-5 d-flex justify-content-end">
            <AdminProductDialog mode="create" />
        </div>

        <table class="table mt-5">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in data" :key="product.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>
                        <img :src="product.imageURL" :alt="product.name" width="100" height="100">
                    </td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <AdminProductDialog :product="product" mode="update" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </ClientOnly>
</template>