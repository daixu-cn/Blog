<template>
  <div id="Decoration">
    <Lottie file-name="beer" class="beer" />
    <Lottie
      file-name="christmas-tree"
      class="christmas-tree"
      width="150px"
      height="150px"
    />
    <Lottie file-name="happy-new-year" class="happy-new-year" />
    <Lottie
      file-name="santa-claus"
      class="santa-claus"
      width="200px"
      height="200px"
    />
    <Lottie
      file-name="santa-claus2"
      class="santa-claus2"
      width="150px"
      height="150px"
    />
    <Lottie file-name="snowman" class="snowman" width="150px" height="150px" />
    <Lottie file-name="star" class="star" width="150px" height="150px" />
    <Lottie file-name="cloud" class="cloud" />
    <Lottie file-name="globe" class="globe" />
    <Lottie file-name="globe2" class="globe2" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
#Decoration {
  #Lottie {
    position: fixed;
    z-index: -1;
  }
  .santa-claus {
    bottom: -30px;
    right: 0;
  }
  .star {
    bottom: 0;
    left: 50%;
    transform: translateX(calc(-50% - 200px));
  }
  .santa-claus2 {
    bottom: -30px;
    left: 50%;
    transform: translateX(calc(-50% + 100px));
  }
  .snowman {
    bottom: -30px;
    left: 50%;
    transform: translateX(calc(-50% - 100px));
  }
  .christmas-tree {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .happy-new-year {
    bottom: 80px;
    left: 50%;
    transform: translateX(calc(-50% - 60px));
  }
  .beer {
    bottom: 80px;
    right: 150px;
  }
  .cloud {
    top: 60px;
    left: 0;
  }
  .globe {
    bottom: 30px;
    left: 50%;
    transform: translateX(calc(-50% + 60px));
  }
  .globe2 {
    bottom: 0;
    left: 0;
  }
  .hand {
    top: 150px;
    left: 0;
  }
}

@media (max-width: 950px) {
  #Decoration {
    display: none;
  }
}
</style>
