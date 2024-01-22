<template>
  <div id="Search" class="dropdown-container">
    <Icon class="icon-search" @click="searchHandler" />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["open"])
function searchHandler() {
  const HeaderEL = document.querySelector("#Header") as HTMLElement
  HeaderEL.setAttribute("class", "hidden")

  const SearchModalEL = document.querySelector("#SearchModal") as HTMLElement
  SearchModalEL.style.display = "block"

  function listener(event: TransitionEvent) {
    if (event.target === HeaderEL) {
      emit("open")
      HeaderEL.removeEventListener("transitionend", listener)
    }
  }
  HeaderEL.addEventListener("transitionend", listener, false)
}
</script>
