import type { InjectionKey } from "vue";
import type { IUser } from "~/types/entity";

export const KEY_USER = Symbol("KEY_USER") as InjectionKey<{
  user: Ref<IUser | undefined>;
  setUser: (user: IUser) => void;
  token: Ref<string | undefined>;
}>;
