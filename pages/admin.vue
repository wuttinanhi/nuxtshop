<script setup lang="ts">
import AdminOrderTable from '~/components/AdminOrderTable.vue';

// ...
</script>
<template>
    <ClientOnly>
        <h1>Admin</h1>
        <br />

        <AdminOrderTable />
    </ClientOnly>
</template>
