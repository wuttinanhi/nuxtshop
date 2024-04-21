import type { Address } from "~/types/general";

export function addressToString(address: Address) {
  return `${address.address} ${address.city} ${address.state} ${address.zip}`;
}
