<script setup lang="ts">
import { ClientAuthService } from "~/clients/auth.client";
import { KEY_USER } from "~/shared/enums/keys";
import type { IUser, IUserInfo, IUserRegister } from "~/types/entity";

if (import.meta.client) {
  const user: Ref<IUser | undefined> = ref(undefined);
  const token: Ref<string | undefined> = ref(undefined);

  async function loaduser() {
    token.value = ClientAuthService.getToken();
    const userData = await ClientAuthService.getUserData();
    user.value = userData;
  }

  async function login(
    email: string,
    password: string,
    turnstileAnswer?: string
  ) {
    const res: any = await $fetch("/api/accounts/login", {
      method: "POST",
      body: JSON.stringify({ email, password, turnstileAnswer }),
    });

    if (!res.token) {
      throw new Error("Invalid login");
    }

    localStorage.setItem("token", res.token);

    await loaduser();

    window.location.href = "/";

    return res;
  }

  async function register(data: IUserRegister) {
    try {
      const res: any = await $fetch("/api/accounts/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log(res);

      alert("User registered successfully");
      await navigateTo("/account", { replace: true });
      return;
    } catch (error) {
      const e = error as Error;
      console.log(e.name, "=>", e.message);

      if (e.name.includes("FetchError")) {
        const response = await (error as any).response;
        const data = response._data;

        if (String(data).includes("exists")) {
          alert("User already exists");
          return;
        }

        alert("Error registering user: " + data);
      }
    }
  }

  async function updateInfo(data: IUserInfo) {
    try {
      const res: any = await $fetch("/api/accounts/update", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token.value}` },
      });

      console.log(res);

      alert("User update successfully");
      await navigateTo("/account", { replace: true });
      return;
    } catch (error) {
      const e = error as Error;
      console.log(e.name, "=>", e.message);
      alert("Error updating user: " + e.message);
    }
  }

  async function logout(redirectTo = "/") {
    console.log("logging out...");
    localStorage.removeItem("token");
    user.value = undefined;
    navigateTo(redirectTo);
  }

  try {
    await loaduser();
  } catch (error) {
    console.log("No user logged in:", (error as Error).message);
    if (localStorage.getItem("token")) {
      console.log("Invalid token, logging out...");
      logout("/account");
    }
  }

  provide(KEY_USER, {
    user,
    token,
    login,
    updateInfo,
    register,
    logout,
  });
}
</script>
<template>
  <slot />
</template>
