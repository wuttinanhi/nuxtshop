<script lang="ts" setup>
import {UserRole} from "~/shared/enums/userrole.enum";
</script>
<template>
  <ClientOnly>
    <h2>Admin Orders Management</h2>
    <br/>

    <GenericOrderViewer :mode="UserRole.ADMIN" :show-user-data="true"/>
  </ClientOnly>
</template>
