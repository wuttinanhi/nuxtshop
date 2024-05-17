<script setup lang="ts">
import { KEY_CART } from "~/shared/enums/keys";

const cartInject = inject(KEY_CART);
const cart = ref(cartInject?.cart);
</script>

<template>
  <div v-if="cart">
    <div class="card mb-5">
      <div class="card-body">
        <p class="card-text d-flex justify-content-between">
          <!-- <div v-if="cart && cart.user">
              <strong>Shipping:</strong> Address: {{ addressToString(user.address) }}
          </div> -->

          <NuxtLink to="/account" class="btn btn-primary">
            Edit Shipping Address
          </NuxtLink>
        </p>
      </div>
    </div>

    <table class="table" v-if="cart">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Product</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
          <th scope="col">Total</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart.items" :key="item.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.product!.name }}</td>
          <td>
            <button
              class="btn btn-outline-primary"
              @click="
                cartInject?.changeQuantity(item.product!, item.quantity - 1)
              "
            >
              -
            </button>
            &nbsp;&nbsp;{{ item.quantity }}&nbsp;&nbsp;
            <button
              class="btn btn-outline-primary"
              @click="
                cartInject?.changeQuantity(item.product!, item.quantity + 1)
              "
            >
              +
            </button>
          </td>
          <td>{{ item.product!.price.toFixed(2) }}</td>
          <td>{{ (item.product!.price * item.quantity).toFixed(2) }}</td>
          <td>
            <button
              class="btn btn-danger"
              @click="cartInject?.removeAll(item.product!)"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="cart && cart.items.length > 0"
      class="d-flex justify-content-end align-items-baseline gap-5 mt-5"
    >
      <h5 class="card-title">
        Total: {{ Number(cartInject?.totalPrice.value).toFixed(2) }}
      </h5>
      <button class="btn btn-primary" @click="cartInject?.createOrder">
        Place Order
      </button>
    </div>

    <div class="d-flex justify-content-center align-items-baseline mt-5" v-else>
      <h5 class="card-title">Cart is empty</h5>
    </div>
  </div>
</template>
