<script setup lang="ts">
// Per-section status badge for v1 pages (#211). One line per section, so a code merge flips it in one edit:
//   <Status available />                  code on Laratype master
//   <Status issue="93" pr="204" />         planned; `pr` names the open code PR, when there is one
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ available?: boolean; issue?: number | string; pr?: number | string }>()
const { lang } = useData()

const vi = computed(() => lang.value === 'vi-VN')
const repo = 'https://github.com/Laratypes/Laratype'
</script>

<template>
  <span v-if="props.available" class="VPBadge tip status-badge">{{ vi ? 'Có sẵn' : 'Available' }}</span>
  <span v-else class="VPBadge warning status-badge">
    {{ vi ? 'Lên kế hoạch' : 'Planned' }} ·
    <a :href="`${repo}/issues/${props.issue}`" target="_blank" rel="noreferrer">#{{ props.issue }}</a>
    <template v-if="props.pr">
      ({{ vi ? 'đang review' : 'in review' }}:
      <a :href="`${repo}/pull/${props.pr}`" target="_blank" rel="noreferrer">#{{ props.pr }}</a>)
    </template>
  </span>
</template>

<style scoped>
.status-badge a {
  color: inherit;
  text-decoration: underline;
}
</style>
