<template>
  <div id="Community">
    <div class="site">
      <div class="about">
        <h1>关于我</h1>
        <ul>
          <li>
            <label>网名</label>
            <span class="colon">:</span>
            daixu
          </li>
          <li>
            <label>职业</label>
            <span class="colon">:</span>
            WEB开发工程师
          </li>
          <li>
            <label>联系QQ</label>
            <span class="colon">:</span>
            2064889594
          </li>
          <li>
            <label>联系邮箱</label>
            <span class="colon">:</span>
            wywangt@outlook.com
          </li>
        </ul>
      </div>
      <div class="about">
        <h1>关于博客</h1>
        <ul>
          <li>
            <label>网站域名</label>
            <span class="colon">:</span>
            daixu.cn
          </li>
          <li>
            <label>上线时间</label>
            <span class="colon">:</span>
            {{ dayjs("2021/02/05").format("L") }}
          </li>
          <li>
            <label>静态页面</label>
            <span class="colon">:</span>
            Vite4 + Vue3 + Element-Plus + Media queries
          </li>
          <li>
            <label>后台系统</label>
            <span class="colon">:</span>
            Koa2 + Sequelize + Redis
          </li>
          <li>
            <label>网站介绍</label>
            <span class="colon">:</span>
            本站搭建主要目的于IT技术交流,日常生活记录。本站支持QQ、GitHub、Google进行快捷登录。
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
        font-weight: 600;
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
