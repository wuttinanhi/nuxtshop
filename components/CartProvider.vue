<script setup lang="ts">
import { KEY_CART, KEY_USER } from "~/shared/enums/keys";
import type { ICart, IProduct } from "~/types/entity";
import type { CartModifyRequest } from "~/types/general";

if (process.client) {
  const userInject = inject(KEY_USER, undefined);
  const token = userInject?.token.value;

  // getting user cart
  let {
    data: cart,
    refresh,
    execute,
  } = await useFetch("/api/carts/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    transform: (data) => {
      return data as ICart;
    },
    // do not execute on load
    immediate: false,
  });

  function getCart() {
    return cart.value;
  }

  async function createOrder() {
    try {
      const result = await $fetch(`/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        onResponseError: (error) => {
          alert(error.response._data.message);
        },
      });

      console.log("result.ok", result.ok);

      console.log("Order created");
      console.log(result);

      refresh();

      await navigateTo("/orders");
    } catch (e) {
      console.error(e);
    }
  }

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
        Authorization: "Bearer " + localStorage.getItem("token") || "",
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
        Authorization: "Bearer " + localStorage.getItem("token") || "",
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

  onMounted(() => {
    if (userInject?.user.value) {
      console.log("Cart not loaded, loading...");
      execute();
    }
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
