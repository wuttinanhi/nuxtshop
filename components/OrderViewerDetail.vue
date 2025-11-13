<script lang="ts" setup>
import { KEY_USER } from "~/shared/enums/keys";
import {
  OrderStatus,
  orderStatusToHuman,
} from "~/shared/enums/orderstatus.enum";
import { UserRole } from "~/shared/enums/userrole.enum";
import type { IOrder } from "~/types/entity";

interface OrderViewerDetailProps {
  order: IOrder;
  mode: UserRole;
  showUserData: boolean;
}

const props = defineProps<OrderViewerDetailProps>();

const userInject = inject(KEY_USER, undefined);
const token = ref(userInject?.token);

async function payOrder(order: IOrder) {
  try {
    const result = await $fetch(`/api/orders/pay/${order.id}`, {
      method: "POST",
      headers: buildAuthHeader(),
    });

    console.log(result);
    const { url } = result;

    // redirect to payment gateway
    window.location.href = url;

    // alert user with confetti
    // alert("Order paid successfully 🎉");

    // refresh page
    // location.reload();
  } catch (error) {
    alert("Error when paying order");
  }
}

function updateOrderStatus(orderId: any, status: OrderStatus) {
  // if canceled prompt confirmation
  if (status === "canceled") {
    const isConfirmed = confirm("Are you sure you want to cancel this order?");
    if (!isConfirmed) return;
  }

  const result = $fetch(`/api/admin/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
    body: JSON.stringify({
      status: status,
    }),
    onResponse: (ctx) => {
      if (ctx.response.status === 200) {
        console.log("Order updated to shipping");
      }
    },
  });

  console.log(result);
  props.order.status = status;
}

async function confirmReceived(order: IOrder) {
  // prompt confirmation
  const isConfirmed = confirm("Are you sure you received this order?");
  if (!isConfirmed) return;

  const result = await $fetch(`/api/orders/received/${order.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
    body: JSON.stringify({
      status: status,
    }),
  });

  console.log(result);
  props.order.status = OrderStatus.Delivered;
}
</script>
<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title">Order #{{ order.id }}</h5>
    </div>
    <div class="card-body">
      <p class="card-text mb-3"></p>

      <div v-if="props.showUserData">
        <strong>Customer:</strong> {{ order.user.firstName }}
        {{ order.user.lastName }} ({{ order.user.email }})
      </div>

      <div v-if="order.delivery_address">
        <strong>Shipping Address:</strong>
        {{ addressToString(order.delivery_address) }}
      </div>
      <div v-else><strong>Shipping Address:</strong> Not available</div>

      <p>
        <strong>Status:</strong>
        {{ orderStatusToHuman(order.status) }}
        <span
          v-if="order.status === OrderStatus.WaitForPayment"
          class="text-secondary"
        >
          (please wait for a moment for status to be updated)
        </span>
      </p>
      <br />

      <OrderItemTable :items="order.items" />
    </div>
    <div class="card-footer text-muted">
      <div class="d-flex justify-content-between">
        <div>
          <div v-if="$props.mode === UserRole.USER">
            <button
              v-show="order.status === OrderStatus.WaitForPayment"
              class="btn btn-primary"
              @click="payOrder(order)"
            >
              Pay Now
            </button>

            <button
              v-show="order.status === OrderStatus.Shipping"
              class="btn btn-success"
              @click="confirmReceived(order)"
            >
              Confirm Received
            </button>
          </div>

          <div v-if="$props.mode === UserRole.ADMIN" class="d-flex gap-1">
            <button
              v-if="order.status === 'preparing'"
              class="btn btn-primary"
              @click="updateOrderStatus(order.id, OrderStatus.Shipping)"
            >
              Update to Shipping
            </button>

            <button
              v-if="order.status !== 'canceled' && order.status !== 'delivered'"
              class="btn btn-danger"
              @click="updateOrderStatus(order.id, OrderStatus.Canceled)"
            >
              Cancel
            </button>

            <GenericDialog
              :modal-options="{
                modalID: 'orderDetailModal',
                modalTitle: 'Order Detail',
                openbuttonLabel: 'View',
                modalSize: 'xl',
              }"
            >
              <div v-if="order.delivery_address" class="my-5">
                <strong>Shipping Address:</strong>
                {{ addressToString(order.delivery_address) }}
              </div>
              <div v-else><strong>Shipping Address:</strong> Not available</div>

              <OrderItemTable :items="order.items" />

              <div class="d-flex flex-row-reverse align-items-center">
                <h5 class="card-title">Total: {{ order.totalPrice }}</h5>
              </div>
            </GenericDialog>
          </div>
        </div>

        <div>
          <h5 class="card-title">Total: {{ order.totalPrice }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>
