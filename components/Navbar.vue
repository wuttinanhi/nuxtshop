<script setup lang="ts">
import { ClientAuthService } from '~/clients/auth.client';

// import { NuxtLink } from '#build/components';

const userData = ref(null);

// onMounted(async () => {
//     const user = await ClientAuthService.getUserData();
//     console.log(user);
//     userData.value = user;
// })

try {
    const user = await ClientAuthService.getUserData();
    userData.value = user;
} catch (error) {
    // do nothing
}
</script>
<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <NuxtLink to="/" class="navbar-brand" aria-current="page">NUXTSHOP</NuxtLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <NuxtLink to="/" class="nav-link active" aria-current="page">Products</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/orders" class="nav-link active" aria-current="page">Orders</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/about" class="nav-link active" aria-current="page">About</NuxtLink>
                    </li>
                </ul>

                <!-- <form class="d-flex px-1" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-primary" type="submit">Search</button>
                </form> -->

                <div class="d-flex px-1 gap-1 py-2">
                    <NuxtLink to="/account" class="btn btn-primary">Account</NuxtLink>
                    <NuxtLink to="/cart" class="btn btn-primary" v-show="userData">🛒 Cart</NuxtLink>
                </div>
            </div>
        </div>
    </nav>
</template>