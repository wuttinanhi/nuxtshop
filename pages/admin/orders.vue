<script setup lang="ts">
import AdminOrderViewer from '~/components/AdminOrderViewer.vue';

// ...
</script>
<template>
    <ClientOnly>
        <h1>Admin</h1>
        <br />

        <AdminOrderViewer />
    </ClientOnly>
</template>
