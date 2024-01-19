<template>
  <div id="Checker" class="dropdown-container">
    <Icon class="icon-push" :loading="loading" @click="push" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import http from "@/server"

const loading = ref(false)
async function push() {
  try {
    loading.value = true
    await http.post("/server/checker")
  } finally {
    loading.value = false
  }
}
</script>
