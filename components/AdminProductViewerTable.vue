<script setup lang="ts">
import type { IProduct, IStock } from "@/types/entity";
import { ADMIN_REFRESH, KEY_USER } from "~/shared/enums/keys";
import AdminProductDialog from "./AdminProductDialog.vue";

const injectUser = inject(KEY_USER, undefined);
const token = ref(injectUser?.token);

let { data, refresh } = await useFetch(
  () => `/api/admin/products?refresh=${Date.now()}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value || "",
    },
    transform: (data) => {
      const totype = data as IProduct[];
      const newWithStock = totype.map((product) => {
        product.stock = (product.stock as any as IStock).quantity;
        return product;
      });
      return newWithStock;
    },
  }
);

function refreshAdminProductTable() {
  console.log("Refreshing Admin Product Table...");
  refresh();
}

provide(ADMIN_REFRESH, {
  refresh: refreshAdminProductTable,
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
          <th scope="col">Stock</th>
          <th scope="col">Price</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <AdminProductViewerRow
          :product="product"
          :index="index"
          v-for="(product, index) in data"
          :key="`product-${index}-${product.stock}`"
        />
      </tbody>
    </table>
  </ClientOnly>
</template>
