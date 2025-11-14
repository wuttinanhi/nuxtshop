<script setup lang="ts">
import { KEY_CART, KEY_USER } from "~/shared/enums/keys";
import type { ICart, IOrder, IProduct } from "~/types/entity";
import type { CartModifyRequest } from "~/types/general";

if (import.meta.client) {
  const userInject = inject(KEY_USER, undefined);
  const token = ref(userInject?.token);
  // const cart = ref<ICart | null>(null);

  if (import.meta.dev) {
    console.log("CartProvider token", token.value);
  }

  let { data: cart, refresh } = await useFetch(() => "/api/carts/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
    transform: (data) => {
      return data as ICart;
    },
    watch: [token],
  });

  // if (cartValue.value) {
  //   cart.value = cartValue.value;
  // }

  function getCart() {
    return cart.value;
  }

  async function createOrder() {
    try {
      const result = await $fetch(`/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.value,
        },
        onResponseError: (error: any) => {
          alert(error.response._data.message);
        },
      });

      refresh();

      const order = result as IOrder;

      console.log("======== Order created ========");
      console.log(order);
      console.log("===============================");

      await navigateTo(`/orders/` + order.id);
    } catch (e) {
      console.error(e);
    }
  }

  async function addToCart(product: IProduct) {
    console.log(`Adding ${product.name} to cart`);

    const modifyRequest: CartModifyRequest = {
      mode: "add",
      productID: product.id!,
      quantity: 1,
    };

    const result = await $fetch("/api/carts/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify(modifyRequest),
      onResponseError: (error: any) => {
        alert(error.response._data.message);
      },
    });

    console.log("addToCart fetch response", result);

    refresh();
  }

  async function removeAll(product: IProduct) {
    console.log("Remove from cart", product);

    const modifyRequest: CartModifyRequest = {
      mode: "remove",
      productID: product.id!,
      quantity: 1,
    };

    const result = await $fetch("/api/carts/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value || "",
      },
      body: JSON.stringify(modifyRequest),
    });

    console.log("Remove Result", result);

    // refresh cart
    refresh();
  }

  async function changeQuantity(product: IProduct, quantity: number) {
    console.log("Change product quantity", product, quantity);

    const modifyRequest: CartModifyRequest = {
      mode: "set",
      productID: product.id!,
      quantity: quantity,
    };

    const result = await $fetch("/api/carts/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value || "",
      },
      body: JSON.stringify(modifyRequest),
    });

    console.log(result);

    // refresh cart
    refresh();
  }

  const totalPrice = computed(() => {
    if (!cart.value) return 0;
    return calculateTotalPrice(cart.value.items);
  });

  provide(KEY_CART, {
    cart,
    getCart,
    createOrder,
    addToCart,
    removeAll,
    changeQuantity,
    totalPrice,
  });
}
</script>

<template>
  <slot></slot>
</template>
