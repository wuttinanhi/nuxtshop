<script setup lang="ts">
import { UserRole } from "~/shared/enums/userrole.enum";
</script>
<template>
  <ClientOnly>
    <h2>Admin Orders Management</h2>
    <br />

    <GenericOrderViewer :mode="UserRole.ADMIN" />
  </ClientOnly>
</template>
