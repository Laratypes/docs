<script setup lang="ts">
// Route-based banner on every page (#210): v1 pages point to the 0.5.4 archive, archive pages point back to v1.
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { isV05Path } from '../../versions'

const route = useRoute()
const { lang } = useData()

const archive = computed(() => isV05Path(route.path))
const vi = computed(() => lang.value === 'vi-VN')
</script>

<template>
  <div class="version-banner" role="note">
    <template v-if="archive && vi">
      Bạn đang đọc tài liệu Laratype 0.5.4, bản hiện có trên npm. Framework đang được thiết kế lại thành v1:
      xem <a href="/vi/">tài liệu v1</a>.
    </template>
    <template v-else-if="archive">
      You are reading the docs for Laratype 0.5.4, the current npm release. The framework is being redesigned as v1:
      see the <a href="/">v1 docs</a>.
    </template>
    <template v-else-if="vi">
      v1 đang được phát triển và chưa có trên npm. Bản 0.5.4 (bản hiện có trên npm) xem tại <a href="/vi/v0.5/">/vi/v0.5/</a>.
    </template>
    <template v-else>
      v1 is in development, not on npm yet. For 0.5.4 (current npm release) see <a href="/v0.5/">/v0.5/</a>.
    </template>
  </div>
</template>

<style scoped>
.version-banner {
  padding: 8px 24px;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.version-banner a {
  font-weight: 600;
  color: inherit;
  text-decoration: underline;
}
</style>
