<template>
  <div id="SystemFrame">
    <Header />
    <div class="SystemFrame-container">
      <Menu />
      <el-scrollbar wrap-class="SystemFrame-page">
        <router-view v-slot="{ Component }">
          <transition name="route" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from "@/views/Admin/Frame/Header/Header.vue"
import Menu from "./Menu/Menu.vue"
</script>

<style lang="scss">
#SystemFrame {
  .SystemFrame-container {
    display: flex;
    height: calc(100vh - 60px);
    & > .el-scrollbar {
      width: calc(100% - 200px);
      .SystemFrame-page {
        padding: $space $space 0 $space;
        box-sizing: border-box;
        background-color: #f5f5f5;
        .system-page {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          border-radius: $border-radius;
          background-color: $bg-color;
          .el-breadcrumb {
            margin-bottom: 20px;
          }
          .form-search {
            user-select: none;
            border-bottom: 1px solid #eee;
            margin-bottom: 18px;
            .el-input {
              width: 190px;
              .el-input__wrapper {
                width: 100%;
                box-sizing: border-box;
                .el-input__prefix {
                  display: none;
                }
              }
            }
          }
          .table {
            .el-table {
              border: var(--el-table-border);
              border-bottom: 0;
              .el-table__header-wrapper {
                thead {
                  tr {
                    th {
                      background-color: var(--el-table-row-hover-bg-color);
                      padding: 16px 0;
                      .operator {
                        width: 100%;
                      }
                    }
                  }
                }
              }
              .el-table__body-wrapper {
                tbody {
                  tr {
                    td {
                      padding: 16px 0;
                    }
                  }
                }
              }
              .image-slot {
                width: 100%;
                height: 100%;
                @include flex-center;
              }
            }

            .el-pagination {
              margin-top: 20px;
              justify-content: end;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 750px) {
    .SystemFrame-container {
      & > .el-scrollbar {
        width: 100%;
        .SystemFrame-page {
          padding: 0;
          .system-page {
            .form-search {
              .el-form-item {
                width: 100%;
                margin-right: 0;
                .el-input,
                .el-select {
                  width: 100%;
                }
                .query-reset {
                  flex: 1;
                }
              }
              .operator {
                .el-button {
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }
  }
}
html.dark {
  #SystemFrame {
    .SystemFrame-container {
      & > .el-scrollbar {
        .SystemFrame-page {
          background-color: #1e1e1e;
          .system-page {
            .form-search {
              border-bottom-color: $border-color;
            }
          }
        }
      }
    }
  }
}
</style>
