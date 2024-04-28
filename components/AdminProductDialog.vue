<script setup lang="ts">
import type { AdminProductFormMode, Product } from '~/types/general';

// import type { Product } from '~/types/general';
// const product = inject('product') as Ref<Product>;

const props = defineProps({
    product: {
        type: Object as () => Product,
    },
    mode: {
        type: String as () => AdminProductFormMode,
    }
});

const modalID = computed(() => {
    return props.product ? `productModal-` + props.product.id : 'productModal-create';
});

const modalTitle = computed(() => {
    return props.product ? `Updating ${props.product.name}` : 'New Product';
});

const buttonLabel = computed(() => {
    return props.mode === 'update' ? 'Update' : 'Add';
});

const modalCloseButtonRef = ref<HTMLButtonElement>();
</script>
<template>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#' + modalID">
        {{ buttonLabel }}
    </button>

    <!-- Modal -->
    <div class="modal fade " :id="modalID" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ modalTitle }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ref="modalCloseButtonRef"></button>
                </div>
                <div class="modal-body">
                    <AdminProductForm :product="props.product" :mode="props.mode"
                        :modalCloseButtonRef="modalCloseButtonRef" />
                </div>
            </div>
        </div>
    </div>
</template>