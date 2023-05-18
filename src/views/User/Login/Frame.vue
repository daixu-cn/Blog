<template>
  <div id="LoginFrame">
    <router-view />
  </div>
</template>

<style lang="scss">
#LoginFrame {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #fbc2eb, #a6c1ee);

  .module {
    width: 350px;
    box-sizing: border-box;
    padding: 40px 30px 30px 30px;
    border-radius: 10px;
    background-color: $bg-color;

    .title {
      text-align: center;
      font-size: 24px;
    }

    .form {
      margin: 40px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      input {
        caret-color: #fbc2eb;
        width: 90%;
        padding: 10px 0;
        box-sizing: border-box;
        border: 0;
        outline: none;
        border-bottom: 1px solid #fbc2eb;
        margin-top: 20px;
        background-color: transparent;
        &:first-child {
          margin-top: 0;
        }
        &::placeholder {
          font-weight: bold;
          color: #acb7c9;
        }
        &:focus {
          animation: inputBorder 2s infinite;
        }
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
          -webkit-transition-delay: 111111s;
          -webkit-transition: color 11111s ease-out,
            background-color 111111s ease-out;
        }
        @keyframes inputBorder {
          50% {
            border-bottom: 1px solid #a6c1ee;
          }
        }
      }
    }
    .action,
    .action-small {
      width: 100%;
      margin-bottom: 20px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      user-select: none;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      border-radius: 5px;
      background: linear-gradient(to right, #fbc2eb, #a6c1ee, #fbc2eb);
      background-size: 200%;
      &:hover {
        animation: btnAnimate 1s infinite;
      }
      &:active {
        border-color: transparent;
      }
      @keyframes btnAnimate {
        50% {
          background-position: 200%;
        }
      }
    }
    .code-container {
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      .code {
        width: 53%;
      }
      .action-small {
        height: 36px;
        line-height: 36px;
        width: 45%;
        letter-spacing: 0;
        margin: 0;
      }
      .disabled {
        background: #f5f7fa;
        border-color: transparent;
        color: #c0c4cc;
        cursor: not-allowed;
      }
    }

    .auth {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 30px;
      span {
        color: #fbc2eb;
        cursor: pointer;
      }
      p {
        cursor: pointer;
        span {
          margin-left: 5px;
        }
      }
    }
  }
  @media screen and (max-width: 400px) {
    .frame {
      width: 90%;
      padding: 40px 20px;
    }
  }
}
</style>
