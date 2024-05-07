<script setup lang="ts">
import { ClientAuthService } from "~/clients/auth.client";
import { KEY_USER } from "~/shared/enums/keys";
import type { IUser } from "~/types/entity";

const user: Ref<IUser | undefined> = ref(undefined);
const token: Ref<string | undefined> = ref(ClientAuthService.getToken());

function setUser(user: IUser) {
  user.value = user;
}

try {
  token.value = ClientAuthService.getToken();
  const userFetch = await ClientAuthService.getUserData();
  user.value = userFetch;
} catch (error) {
  console.log("No user logged in", error);
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
