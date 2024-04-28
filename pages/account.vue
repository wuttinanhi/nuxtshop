<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { User } from '~/types/general';

const mode = ref('login')

const loginData = ref({
    email: '',
    password: ''
})

const userData = ref({
    id: 0,
    email: '',
    password: '',
    address: {
        address: '',
        city: '',
        state: '',
        zip: ''
    },
    firstName: '',
    lastName: '',
    role: 'user'
} as User)

async function loginSubmit() {
    // console.log(loginData.value)

    try {
        const res: any = await $fetch('/api/accounts/login', {
            method: 'POST',
            body: JSON.stringify(loginData.value)
        })

        if (!res.token) {
            throw new Error('Invalid login')
        }

        localStorage.setItem('token', res.token)

        await navigateTo('/')
    } catch (error) {
        alert('Error logging in')
    }
}

async function saveUser() {
    console.log(userData.value)
}

function registerSubmit() {
    console.log(loginData.value)
    console.log(userData.value)
}

function changeMode() {
    mode.value = mode.value === 'login' ? 'register' : 'login'
}

async function logout() {
    localStorage.removeItem('token')
    navigateTo('/')
}

onMounted(async () => {
    try {
        // get token from local storage
        const token = localStorage.getItem('token')

        if (token) {
            console.log('using token', token)

            // get user data
            const res: any = await $fetch('/api/accounts/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.id) {
                userData.value = res
            }
        }
    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <ClientOnly>
        <h1 class="mb-5">
            Account
        </h1>

        <form @submit.prevent="null" v-if="userData.id === 0">
            <div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        v-model="loginData.email">
                </div>

                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" v-model="loginData.password">
                </div>
            </div>

            <div v-show="mode === 'register'">
                <h3>Your Info</h3>
                <UserInfoForm :user="userData" />
            </div>

            <div>
                <div v-if="mode === 'login'" class="d-flex gap-2 mt-5">
                    <button type="submit" class="btn btn-primary" @click="loginSubmit">Login</button>
                    <button type="button" class="btn btn-outline-dark" @click="changeMode">Don't have an
                        account?</button>
                </div>
                <div v-else class="d-flex gap-2 mt-5">
                    <button type="submit" class="btn btn-primary" @click="registerSubmit">Register</button>
                    <button type="button" class="btn btn-outline-dark" @click="changeMode">Back to login</button>
                </div>
            </div>
        </form>

        <div v-else>
            <h3>Your Info</h3>
            <UserInfoForm :user="userData" />
            <button class="btn btn-primary mt-3" @click="saveUser">Save</button>

            <hr class="my-5" />

            <h4 class="mb-3">Action</h4>
            <button class="btn btn-danger" @click="logout">Logout</button>
        </div>
    </ClientOnly>
</template>