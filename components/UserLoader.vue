<script setup lang="ts">
import { ClientAuthService } from "~/clients/auth.client";
import { KEY_USER } from "~/shared/enums/keys";
import type { IUser } from "~/types/entity";

const user: Ref<IUser | undefined> = ref(undefined);
const token: Ref<string | undefined> = ref(undefined);

function setUser(user: IUser) {
  user.value = user;
}

try {
  if (process.client) {
    const userData = await ClientAuthService.getUserData();

    user.value = userData;
    token.value = ClientAuthService.getToken();

    console.log("UserLoader > User loaded", user.value);
    console.log("UserLoader > Token:", token.value);
  }
} catch (error) {
  console.log("No user logged in:", (error as Error).message);
}

provide(KEY_USER, {
  user,
  setUser,
  token,
});
</script>
<template>
  <div></div>
</template>
