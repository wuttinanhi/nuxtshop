<script setup lang="ts">
import type { IProduct, IStock } from "@/types/entity";
import { KEY_CART, KEY_USER } from "~/shared/enums/keys";
import { getImageURL } from "~/shared/utils";

const userInject = inject(KEY_USER, undefined);
const user = ref(userInject?.user);
const cartInject = inject(KEY_CART, undefined);

const { pending, data } = await useFetch("/api/products/all", {
  transform: (data) => {
    const totype = data as IProduct[];
    const have_stock = totype.map((product) => {
      product.stock = (product.stock as any as IStock).quantity;
      return product;
    });
    return have_stock;
  },
});

async function addToCart(product: IProduct) {
  if (!user.value) {
    navigateTo("/account");
    return;
  }
  cartInject?.addToCart(product);
}
</script>

<template>
  <div class="row g-3 p-md-5" v-show="!pending">
    <div class="col-xs-12 col-md-4" v-for="product in data" :key="product.id">
      <div class="card">
        <img
          :src="getImageURL(product.imageURL)"
          class="card-img"
          :alt="product.name"
          style="max-height: 300px; object-fit: cover; max-width: 100%"
        />

        <div class="card-body">
          <div class="text-center">
            <h3 class="card-title">{{ product.name }}</h3>
            <h5 class="card-text my-4">{{ product.price }}</h5>
            <button
              class="btn btn-primary mt-3"
              @click="addToCart(product)"
              :disabled="product.stock === 0"
            >
              Add to cart
            </button>

            <br />
            <p>Available: {{ product.stock }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
