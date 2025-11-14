<script setup lang="ts">
import { ref } from "vue";
import { KEY_USER } from "~/shared/enums/keys";
import type { IUserInfo, IUserRegister } from "~/types/entity";
import type { WithTurnstile } from "~/types/general";
import Turnstile from "./utils/Turnstile.vue";

const injectUser = inject(KEY_USER, undefined);
const user = ref(injectUser?.user);

const formMode = ref("login");

const userForm: Ref<WithTurnstile<IUserInfo>> = ref(
  user.value
    ? (user.value as any)
    : {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        addressId: 0,
        address: {
          id: 0,
          addressText: "",
          city: "",
          state: "",
          zip: "",
        },
        role: "user",
        turnstileAnswer: "",
      }
);

function login() {
  try {
    injectUser?.login(
      userForm.value.email,
      userForm.value.password!,
      userForm.value.turnstileAnswer
    );
  } catch (error) {
    alert("Error logging in");
    console.log("error login", error);
  }
}

function register() {
  injectUser?.register(userForm.value as any as IUserRegister);
}

async function saveUser() {
  injectUser?.updateInfo(userForm.value);
}

function changeMode() {
  formMode.value = formMode.value === "login" ? "register" : "login";
}

// HANDLE TURNSTILE EMIT EVENT
function handleTurnstileVerify(token: string | null) {
  if (token) {
    console.log("Token received in parent:", token);
    userForm.value.turnstileAnswer = token;
  }
}
</script>

<template>
  <h1 class="mb-5">Account</h1>

  <div v-if="user">
    <h3>Your Info</h3>

    <UserInfoForm :user="userForm" />
    <button class="btn btn-primary mt-3" @click="saveUser">Save</button>

    <hr class="my-5" />

    <h4 class="mb-3">Action</h4>
    <button class="btn btn-danger" @click="injectUser?.logout">Logout</button>
  </div>

  <div v-else>
    <form @submit.prevent="null">
      <div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>

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

      <Turnstile @resp="handleTurnstileVerify" />

      <div v-if="formMode === 'login'" class="d-flex gap-2 mt-5">
        <button type="submit" class="btn btn-primary" @click="login">
          Login
        </button>

        <button type="button" class="btn btn-outline-dark" @click="changeMode">
          Don't have an account?
        </button>
      </div>

      <div v-else class="d-flex gap-2 mt-5">
        <button type="submit" class="btn btn-primary" @click="register">
          Register
        </button>

        <button type="button" class="btn btn-outline-dark" @click="changeMode">
          Back to login
        </button>
      </div>
    </form>
  </div>
</template>
