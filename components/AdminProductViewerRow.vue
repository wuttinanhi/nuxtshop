<script setup lang="ts">
import type { Product } from '~/types/general';

const props = defineProps({
    product: {
        type: Object as () => Product,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
});

const product = ref(props.product);
</script>
<template>
    <tr>
        <th scope="row">{{ props.index + 1 }}</th>
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
</template>
