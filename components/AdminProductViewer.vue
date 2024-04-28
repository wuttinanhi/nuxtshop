<script setup lang="ts">
import { ClientAuthService } from '~/clients/auth.client';
import type { Product } from '~/types/general';
import AdminProductDialog from './AdminProductDialog.vue';
import AdminOrderViewerRow from './AdminProductViewerRow.vue';

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
                <AdminOrderViewerRow :product="product" :index="index" v-for="(product, index) in data"
                    :key="product.id" />
            </tbody>
        </table>
    </ClientOnly>
</template>