<script setup lang="ts">
import { KEY_USER } from "~/shared/enums/keys";
import { OrderStatus, orderStatusToHuman } from "~/shared/enums/orderstatus.enum";
import { UserRole } from "~/shared/enums/userrole.enum";
import type { IOrder } from "~/types/entity";

interface OrderViewerDetailProps {
  order: IOrder;
  mode: UserRole;
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

    // alert user with confetti
    alert("Order paid successfully 🎉");

    // refresh page
    location.reload();
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
    })
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
      <p class="card-text mb-3">
      <div v-if="order.address">
        <strong>Shipping:</strong> Address: {{ addressToString(order.address) }}
      </div>
      <div v-else>
        <strong>Shipping:</strong> Address: Not available
      </div>
        <strong>Status:</strong> {{ orderStatusToHuman(order.status) }}
      </p>

      <OrderItemTable :items="order.items" />
    </div>
    <div class="card-footer text-muted">
      <div class="d-flex justify-content-between">
        <div>
          <div v-if="$props.mode === UserRole.USER">
            <button class="btn btn-primary" v-show="order.status ===  OrderStatus.WaitForPayment" @click="payOrder(order)" >
              Pay Now
            </button>

            <button class="btn btn-success" v-show="order.status === OrderStatus.Shipping" @click="confirmReceived(order)" >
              Confirm Received
            </button>
          </div>

          <div v-if="$props.mode === UserRole.ADMIN" class="d-flex gap-1">
            <button class="btn btn-primary" @click="updateOrderStatus(order.id, OrderStatus.Shipping)" v-if="order.status === 'preparing'">
              Update to Shipping
            </button>

            <button class="btn btn-danger" @click="updateOrderStatus(order.id, OrderStatus.Canceled)" v-if="order.status !== 'canceled'">
              Cancel
            </button>

            <GenericDialog :modal-options="{
              modalID: 'orderDetailModal',
              modalTitle: 'Order Detail',
              openbuttonLabel: 'View',
              modalSize: 'xl'
            }">
              <OrderItemTable :items="order.items"/>

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
