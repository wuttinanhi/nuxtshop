<script setup lang="ts">
import { UserRole } from "~/shared/enums/userrole.enum";
</script>
<template>
  <h1>Your Orders</h1>

  <div class="mt-5">
    <ClientOnly>
      <GenericOrderViewer :mode="UserRole.USER" />
    </ClientOnly>
  </div>
</template>
