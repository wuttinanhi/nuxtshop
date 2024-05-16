<script setup lang="ts">
const modalCloseButtonRef = ref<HTMLButtonElement>();

interface GenericModalOptions {
  modalID: string;
  modalTitle: string;
  openbuttonLabel: string;
  modalSize?: "sm" | "lg" | "xl";
}

const props = defineProps({
  modalOptions: {
    type: Object as PropType<GenericModalOptions>,
    required: true,
  },
});

const modalID = computed(() => props.modalOptions.modalID);

const modalTitle = computed(() => props.modalOptions.modalTitle);

const openModalbuttonLabel = computed(() => props.modalOptions.openbuttonLabel);

const modalSize = computed(() =>
  props.modalOptions.modalSize ? `modal-${props.modalOptions.modalSize}` : ""
);
</script>
<template>
  <!-- Button trigger modal -->
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    :data-bs-target="'#' + modalID"
  >
    {{ openModalbuttonLabel }}
  </button>

  <!-- Modal -->
  <div
    :id="modalID"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div :class="`modal-dialog modal-dialog-centered ` + modalSize">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ modalTitle }}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="modalCloseButtonRef"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
