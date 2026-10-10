<script setup lang="ts">
// Callout for a v1 feature that is not merged yet: <Planned issue="105" />.
// Pages may still describe its planned design from the spec (Laratypes/Laratype docs/v1), with examples
// marked illustrative (#211). For a per-section badge use <Status issue="N" />.
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ issue: number | string; title?: string }>()
const { lang } = useData()

const vi = computed(() => lang.value === 'vi-VN')
const href = computed(() => `https://github.com/Laratypes/Laratype/issues/${props.issue}`)
</script>

<template>
  <div class="custom-block warning">
    <p class="custom-block-title">{{ title ?? (vi ? 'Đang lên kế hoạch' : 'Planned') }}</p>
    <p v-if="vi">
      Tính năng này chưa có trong code. Theo dõi tại
      <a :href="href" target="_blank" rel="noreferrer">Laratypes/Laratype#{{ issue }}</a>.
    </p>
    <p v-else>
      Not implemented yet. Tracked in
      <a :href="href" target="_blank" rel="noreferrer">Laratypes/Laratype#{{ issue }}</a>.
    </p>
  </div>
</template>
