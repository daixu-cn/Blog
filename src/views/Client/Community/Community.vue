<template>
  <div id="Community">
    <div class="site">
      <div class="about">
        <h1>{{ $t("Community.aboutMe") }}</h1>
        <ul>
          <li>
            <label>{{ $t("Community.nickName") }}</label>
            <span class="colon">:</span>
            daixu
          </li>
          <li>
            <label>{{ $t("Community.occupation") }}</label>
            <span class="colon">:</span>
            {{ $t("Community.engineer") }}
          </li>
          <li>
            <label>{{ $t("Community.contactQQ") }}</label>
            <span class="colon">:</span>
            2064889594
          </li>
          <li>
            <label>{{ $t("Community.contactEmail") }}</label>
            <span class="colon">:</span>
            daixu.cn@outlook.com
          </li>
        </ul>
      </div>
      <div class="about">
        <h1>{{ $t("Community.aboutBlog") }}</h1>
        <ul>
          <li>
            <label>{{ $t("Community.domain") }}</label>
            <span class="colon">:</span>
            daixu.cn
          </li>
          <li>
            <label>{{ $t("Community.websiteTime") }}</label>
            <span class="colon">:</span>
            {{ dayjs("2021/02/05").format("L") }}
          </li>
          <li>
            <label>{{ $t("Community.staticPages") }}</label>
            <span class="colon">:</span>
            Vite4 + Vue3 + Element-Plus + Media queries
          </li>
          <li>
            <label>{{ $t("Community.systems") }}</label>
            <span class="colon">:</span>
            Koa2 + Sequelize + Redis + BandwagonHost VPS + Aliyun OSS
          </li>
          <li>
            <label>{{ $t("Community.website") }}</label>
            <span class="colon">:</span>
            {{ $t("Community.siteDescription") }}
          </li>
        </ul>
      </div>
    </div>
    <Comment />
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs"
import Comment from "@/components/Comment/Comment.vue"
</script>

<style lang="scss">
#Community {
  .site {
    margin-bottom: 50px;
    .about {
      &:first-child {
        margin-bottom: 30px;
      }
      h1 {
        display: inline-block;
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 10px;
        position: relative;
        z-index: 2;
        &::after {
          content: "";
          display: inline-block;
          width: 100%;
          height: 4px;
          background-color: $color-primary;
          position: absolute;
          z-index: -1;
          bottom: -1px;
          left: 0;
        }
      }
      ul {
        li {
          margin-bottom: 5px;
          line-height: 20px;
          label {
            display: inline-block;
            min-width: 60px;
            text-align-last: justify;
            text-align: justify;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
