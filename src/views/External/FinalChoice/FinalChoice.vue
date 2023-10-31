<template>
  <div id="External-FinalChoice">
    <el-breadcrumb separator="/" class="External-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/creations' }">
        创意空间
      </el-breadcrumb-item>
      <el-breadcrumb-item>最终选择</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="External-container">
      <h6 class="description">
        <span class="tips">
          Tips:
          该应用数据全部存储在本地(仅保存上一次的录入),不经过任何服务器(源码与本站一同开源)。
        </span>
      </h6>
      <el-table :data="tableData" class="option-table" empty-text="暂无选项～">
        <el-table-column label="选项配置:">
          <template #default="scope">
            <el-input
              v-model="tableData[scope.$index].option"
              placeholder="输入选项描述（例如：吃泡面）:"
            />
          </template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template #header>
            <el-button type="primary" @click="createOption">新增选项</el-button>
          </template>
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteOption(scope.$index)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="option-operator">
        <el-tabs v-model="operatorType">
          <el-tab-pane label="文本随机" name="operator-text">
            <TextModel
              v-if="optionsList.length >= 2"
              :options-list="optionsList"
            />
            <span v-else>请至少添加两个选项</span>
          </el-tab-pane>
          <el-tab-pane label="转盘随机" name="operator-turntable">
            <TurntableModel
              v-if="optionsList.length >= 2"
              :options-list="optionsList"
            />
            <span v-else>请至少添加两个选项</span>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, computed } from "vue"
import { TableData } from "./types"
import TextModel from "./TextModel.vue"
import TurntableModel from "./TurntableModel.vue"

const operatorType = ref("operator-text")
const defaultOptions = `[{"option":"Japan"},{"option":"Germany"},{"option":"America"},{"option":"Canada"},{"option":"Australia"}]`
const tableData: TableData[] = reactive(
  JSON.parse(
    localStorage.getItem("External-FinalChoice-options") || defaultOptions
  ) || JSON.parse(defaultOptions)
)
const optionsList = computed(() => {
  return tableData.filter(item => item.option)
})

watchEffect(() => {
  if (optionsList.value.length) {
    localStorage.setItem(
      "External-FinalChoice-options",
      JSON.stringify(optionsList.value)
    )
  } else {
    localStorage.removeItem("External-FinalChoice-options")
  }
})

function createOption() {
  tableData.push({
    option: ""
  })
}
function deleteOption(index: number) {
  tableData.splice(index, 1)
}
</script>

<style lang="scss">
#External-FinalChoice {
  .description {
    margin-bottom: $space;
    line-height: 1.5em;
    .tips {
      color: $color-danger;
    }
  }
  .External-container {
    .option-table {
      margin-bottom: 20px;
      .el-input__wrapper {
        box-shadow: none;
        background-color: transparent;
      }
    }
    .el-tabs {
      user-select: none;
      .el-tab-pane {
        width: 100%;
        height: 320px;
        font-size: 1.5em;
        color: $color-primary;
        @include flex-center;
      }
    }
  }
}
</style>
