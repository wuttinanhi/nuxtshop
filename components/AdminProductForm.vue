<script setup lang="ts">
import type { IProduct } from "@/types/entity";
import { KEY_USER } from "~/shared/enums/keys";
import { getImageURL } from "~/shared/utils";
import type { AdminProductFormMode } from "~/types/general";
import { ADMIN_REFRESH } from "../shared/enums/keys";

const injectUser = inject(KEY_USER, undefined);
const token = ref(injectUser?.token);

const fileInput = ref<HTMLInputElement | null>(null);
const imageFile = ref<File | null>(null);

const injectAdminRefresh = inject(ADMIN_REFRESH, undefined);

const props = defineProps({
  mode: {
    type: String as () => AdminProductFormMode,
  },
  product: {
    type: Object as () => IProduct,
  },
  modalCloseButtonRef: {
    type: Object as () => any,
  },
});

const product: Ref<IProduct> = ref({
  id: props.product ? props.product.id : 0,
  name: props.product ? props.product.name : "",
  description: props.product ? props.product.description : "",
  price: props.product ? props.product.price : 0,
  imageURL: props.product
    ? props.product.imageURL
    : "https://dummyjson.com/image/500/f5f5f5",
  imageData: props.product ? props.product.imageData : "",
  stock: props.product ? props.product.stock : 0,
});

const imageURL = ref(getImageURL(product.value.imageURL));

const buttonLabel = computed(() => {
  return props.mode === "update" ? "Update" : "Add";
});

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;
  imageURL.value = URL.createObjectURL(file);
  imageFile.value = file;
}

function onProductImageClick() {
  console.log("Image clicked");
  fileInput.value?.click();
}

function closeModal() {
  props.modalCloseButtonRef.click();
}

function refreshAdminTable() {
  setTimeout(() => {
    injectAdminRefresh?.refresh();
  }, 500);
}

async function onSubmit() {
  const formData = new FormData();

  // if image file is selected, append it to form data
  if (imageFile.value) {
    formData.append("image", imageFile.value as Blob);
    console.log("Image file appended");
    console.log(imageFile.value);
  }
  // if mode is update, append product id
  if (props.mode === "update") {
    formData.append("id", product.value.id!.toString());
  }

  // append other product data
  formData.append("name", product.value.name);
  formData.append("price", product.value.price.toString());
  formData.append("description", product.value.description);
  formData.append("stock", product.value.stock!.toString());

  const requestMethod: any = props.mode === "update" ? "PATCH" : "POST";

  const result: any = await $fetch("/api/admin/products", {
    method: requestMethod,
    headers: {
      Authorization: "Bearer " + token.value || "",
    },
    body: formData,
  });

  console.log(result);

  refreshAdminTable();

  product.value.imageURL = result.imageURL;
  closeModal();
}

async function deleteProduct() {
  // prompt user for confirmation
  const confirmation = confirm("Are you sure you want to delete this product?");
  if (!confirmation) return;

  const result = await $fetch("/api/admin/products/" + product.value.id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token.value || "",
    },
  });

  console.log(result);
  // set product.__clientDeleted to true
  product.value.__clientDeleted = true;

  refreshAdminTable();

  closeModal();
}
</script>

<template>
  <div v-show="props.mode && product">
    <form @submit.prevent="onSubmit">
      <div class="d-flex justify-content-center">
        <img
          :src="imageURL"
          :alt="product.name"
          width="200"
          height="200"
          @click="onProductImageClick"
        />
      </div>

      <div class="mb-3 mt-5">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="product.name"
        />
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input
          type="number"
          class="form-control"
          id="price"
          v-model="product.price"
          step="0.01"
        />
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="description"
          v-model="product.description"
          rows="5"
        >
          {{ product.description }}
        </textarea>
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Stock</label>
        <input
          type="number"
          class="form-control"
          id="stock"
          v-model="product.stock"
          step="1"
        />
      </div>

      <div class="mb-3">
        <input
          type="file"
          @change="onFileChange"
          style="display: none"
          ref="fileInput"
        />
      </div>

      <div class="d-flex justify-content-end gap-3">
        <button type="button" class="btn btn-danger" @click="deleteProduct">
          Delete
        </button>
        <button type="submit" class="btn btn-primary">{{ buttonLabel }}</button>
      </div>
    </form>
  </div>
</template>
