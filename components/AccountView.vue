<script setup lang="ts">
import { ref } from "vue";
import { KEY_USER } from "~/shared/enums/keys";
import type { IUser } from "~/types/entity";

const injectUser = inject(KEY_USER, undefined);
const token = injectUser?.token.value;

const formMode = ref("login");

const userForm = ref({
  id: 0,
  email: "",
  password: "",
  address: {
    address: "",
    city: "",
    state: "",
    zip: "",
  },
  firstName: "",
  lastName: "",
  role: "user",
} as IUser);

async function loginSubmit() {
  try {
    const res: any = await $fetch("/api/accounts/login", {
      method: "POST",
      body: JSON.stringify({
        email: userForm.value.email,
        password: userForm.value.password,
      }),
    });

    if (!res.token) {
      throw new Error("Invalid login");
    }

    localStorage.setItem("token", res.token);

    await navigateTo("/");
  } catch (error) {
    alert("Error logging in");
  }
}

async function saveUser() {
  console.log(userForm.value);
}

function registerSubmit() {
  console.log(userForm.value);
}

function changeMode() {
  formMode.value = formMode.value === "login" ? "register" : "login";
}

async function logout() {
  console.log("logging out...");
  localStorage.removeItem("token");
  navigateTo("/");
}
</script>

<template>
  <h1 class="mb-5">Account</h1>

  TOKEN: {{ injectUser === undefined }} {{ injectUser?.token }}

  <div v-if="injectUser && injectUser.token">
    <h3>Your Info</h3>

    <UserInfoForm :user="userForm" />
    <button class="btn btn-primary mt-3" @click="saveUser">Save</button>

    <hr class="my-5" />

    <h4 class="mb-3">Action</h4>
    <button class="btn btn-danger" @click="logout">Logout</button>
  </div>
  <div v-else>
    <form @submit.prevent="null">
      <div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label"
            >Email address</label
          >
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            v-model="userForm.email"
          />
        </div>

        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            v-model="userForm.password"
          />
        </div>
      </div>

      <div v-show="formMode === 'register'">
        <h3>Your Info</h3>
        <UserInfoForm :user="userForm" />
      </div>

      <div>
        <div v-if="formMode === 'login'" class="d-flex gap-2 mt-5">
          <button type="submit" class="btn btn-primary" @click="loginSubmit">
            Login
          </button>

          <button
            type="button"
            class="btn btn-outline-dark"
            @click="changeMode"
          >
            Don't have an account?
          </button>
        </div>

        <div v-else class="d-flex gap-2 mt-5">
          <button type="submit" class="btn btn-primary" @click="registerSubmit">
            Register
          </button>

          <button
            type="button"
            class="btn btn-outline-dark"
            @click="changeMode"
          >
            Back to login
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
