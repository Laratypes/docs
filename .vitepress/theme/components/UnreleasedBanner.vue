<script setup lang="ts">
// Shown on every v1 "next" page (/next/, /vi/next/), route-based so no page can forget it (#210).
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { lang } = useData()

const visible = computed(() => /^\/(vi\/)?next(\/|$)/.test(route.path))
const vi = computed(() => lang.value === 'vi-VN')
</script>

<template>
  <div v-if="visible" class="unreleased-banner" role="note">
    <template v-if="vi">
      Bạn đang đọc tài liệu Laratype v1, phiên bản chưa phát hành. API vẫn có thể thay đổi.
      Bản hiện tại xem tại <a href="/vi/">v0.5.4</a>.
    </template>
    <template v-else>
      You are reading the docs for Laratype v1, which is not released yet. APIs can still change.
      For the current release see <a href="/">v0.5.4</a>.
    </template>
  </div>
</template>

<style scoped>
.unreleased-banner {
  padding: 8px 24px;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.unreleased-banner a {
  font-weight: 600;
  color: inherit;
  text-decoration: underline;
}
</style>
