<script lang="ts" setup>
import {UserRole} from "~/shared/enums/userrole.enum";
</script>
<template>
  <h1>Your Orders</h1>

  <div class="mt-5">
    <ClientOnly>
      <GenericOrderViewer :mode="UserRole.USER" :show-user-data="false"/>
    </ClientOnly>
  </div>
</template>
