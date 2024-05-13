<script setup lang="ts">
import type { IProduct } from "@/types/entity";
import { KEY_USER } from "~/shared/enums/keys";
import type { CartModifyRequest } from "~/types/general";

const userInject = inject(KEY_USER);
const token = userInject?.token.value;

const { pending, data } = await useFetch("/api/products/all", {
  transform: (data) => data as IProduct[],
});

async function addToCart(product: IProduct) {
  console.log("Add to cart", product);

  const modifyRequest: CartModifyRequest = {
    mode: "add",
    productID: product.id!,
    quantity: 1,
  };

  const result = await $fetch("/api/carts/modify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(modifyRequest),
  });

  console.log(result);
}
</script>

<template>
  <div class="row g-3 p-md-5" v-show="!pending">
    <div class="col-xs-12 col-md-4" v-for="product in data" :key="product.id">
      <div class="card">
        <img
          :src="product.imageURL"
          class="card-img"
          alt="{{ product.imageURL }}"
          style="max-height: 300px; object-fit: cover; max-width: 100%"
        />

        <div class="card-body">
          <div class="text-center">
            <h3 class="card-title">{{ product.name }}</h3>
            <h5 class="card-text my-4">{{ product.price }}</h5>
            <button class="btn btn-primary mt-3" @click="addToCart(product)">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
