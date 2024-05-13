<script setup lang="ts">
import type { IProduct } from "@/types/entity";
import { KEY_USER } from "~/shared/enums/keys";
import AdminProductDialog from "./AdminProductDialog.vue";
import AdminProductViewerRow from "./AdminProductViewerRow.vue";

const injectUser = inject(KEY_USER, undefined);
const token = injectUser?.token.value;

let { data } = await useFetch(() => `/api/admin/products`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token || "",
  },
  transform: (data) => {
    return data as IProduct[];
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
        <AdminProductViewerRow
          :product="product"
          :index="index"
          v-for="(product, index) in data"
          :key="product.id"
        />
      </tbody>
    </table>
  </ClientOnly>
</template>
