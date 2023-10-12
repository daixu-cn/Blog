<template>
  <div id="External">
    <router-view />
  </div>
</template>

<style lang="scss">
#External {
  width: 100%;
  min-height: calc(100vh - 80px);
  .External-breadcrumb {
    margin-bottom: 20px;
    .is-link {
      color: $color-primary;
    }
  }
  .External-container {
    height: 100%;
  }
}
</style>
