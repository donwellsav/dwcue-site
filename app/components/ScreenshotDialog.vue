<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="screenshot-dialog"
      :aria-labelledby="titleId"
      @cancel="handleCancel"
      @close="handleNativeClose"
      @click="handleBackdropClick"
    >
      <div class="screenshot-dialog__chrome">
        <div class="screenshot-dialog__bar">
          <div>
            <span class="screenshot-dialog__eyebrow">{{ t('redesign.dialog.label') }}</span>
            <strong :id="titleId">{{ caption }}</strong>
          </div>
          <button class="screenshot-dialog__close" type="button" :aria-label="t('redesign.dialog.close')" @click="requestClose">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="screenshot-dialog__image-wrap">
          <img v-if="src" :src="src" :alt="alt" />
        </div>
        <p class="screenshot-dialog__hint">{{ t('redesign.dialog.hint') }}</p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from '../composables/useI18n';

const props = defineProps<{
  open: boolean;
  src: string;
  alt: string;
  caption: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const { t } = useI18n();
const dialogRef = ref<HTMLDialogElement | null>(null);
const returnTarget = ref<HTMLElement | null>(null);
const titleId = 'screenshot-dialog-title';

const restoreFocus = () => {
  const target = returnTarget.value;
  returnTarget.value = null;
  if (target?.isConnected) target.focus();
};

const requestClose = () => emit('update:open', false);

const handleCancel = (event: Event) => {
  event.preventDefault();
  requestClose();
};

const handleNativeClose = () => {
  if (props.open) emit('update:open', false);
  void nextTick(restoreFocus);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) requestClose();
};

watch(
  () => props.open,
  async (open) => {
    await nextTick();
    const dialog = dialogRef.value;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnTarget.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      return;
    }

    if (!open && dialog.open) dialog.close();
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  if (dialogRef.value?.open) dialogRef.value.close();
});
</script>
