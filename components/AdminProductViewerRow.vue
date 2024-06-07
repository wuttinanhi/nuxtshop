<script setup lang="ts">
import { getImageURL } from "~/shared/utils";

const props = defineProps({
  product: {
    type: Object as () => any,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const product = ref(props.product);
</script>
<template>
  <tr v-show="!product.__clientDeleted">
    <th scope="row">{{ props.index + 1 }}</th>
    <td>
      <img
        :src="getImageURL(product.imageURL)"
        :alt="product.name"
        width="100"
        height="100"
      />
    </td>
    <td>{{ product.name }}</td>
    <td>{{ product.stock }}</td>
    <td>{{ product.price }}</td>
    <td>
      <div class="d-flex align-items-center gap-2">
        <AdminProductDialog :product="product" mode="update" />
      </div>
    </td>
  </tr>
</template>
