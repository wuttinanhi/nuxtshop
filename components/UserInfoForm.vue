<script setup lang="ts">
import type { IUserInfo } from "~/types/entity";

const props = defineProps({
  user: {
    type: Object as () => IUserInfo,
    required: true,
  },
});

const userRef = ref(props.user);
</script>

<template>
  <div class="row">
    <div class="col">
      <input
        type="text"
        class="form-control"
        placeholder="First name"
        aria-label="First name"
        v-model="userRef.firstName"
      />
    </div>
    <div class="col">
      <input
        type="text"
        class="form-control"
        placeholder="Last name"
        aria-label="Last name"
        v-model="userRef.lastName"
      />
    </div>
  </div>

  <form class="row g-3 mt-3">
    <div class="col-12">
      <label for="inputAddress" class="form-label">Address</label>
      <input
        type="text"
        class="form-control"
        id="inputAddress"
        placeholder="1234 Main St"
        v-model="userRef.address!.addressText"
      />
    </div>

    <div class="col-md-6">
      <label for="inputCity" class="form-label">City</label>
      <input
        type="text"
        class="form-control"
        id="inputCity"
        v-model="userRef.address!.city"
      />
    </div>
    <div class="col-md-4">
      <label for="inputState" class="form-label">State</label>
      <input
        type="text"
        class="form-control"
        id="inputState"
        v-model="userRef.address!.state"
      />
    </div>
    <div class="col-md-2">
      <label for="inputZip" class="form-label">Zip</label>
      <input
        type="text"
        class="form-control"
        id="inputZip"
        v-model="userRef.address!.zip"
      />
    </div>
  </form>
</template>
