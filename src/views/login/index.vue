<script setup lang="ts">
import { getTime } from '@/utils/time.ts'
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'

let loginForms = ref()
let loading = ref(false)
let $router = useRouter()
let route = useRoute()
let loginForm = reactive({ username: '13711021216', password: 'hzc.22580', remember: false })
let showPassword = ref(false)
let useStore = useUserStore()
const login = async () => {
  //表单校验
  await loginForms.value.validate()

  loading.value = true
  try {
    await useStore.userLogin(loginForm)

    let redirect: any = route.query.redirect
    await $router.push({ path: redirect || '/' })
    ElNotification({ type: 'success', message: 'Welcome', title: `Hi,Good ${getTime()}`, duration: 1500 })
  } catch (error) {
    loading.value = false
    ElNotification({ type: 'error', message: (error as Error).message })
  }
}

const rules = {
  username: [{
    required: true,
    message: '请输入手机号码',
    trigger: 'blur',
  },
    {
      required: true,
      min: 5,
      message: 'the Account Length Must Be At Least 5 Digits',
      trigger: 'change',
    },
    {
      required: true,
      max: 11,
      message: 'the Account Length Cannot Be exceed 10 Digits',
      trigger: 'change',
    },
  ],
  password: [{
    required: true,
    trigger: 'blur',
    message: 'Please input password',
  }],
}
</script>

<template>
  <div class="login-container">
    <div class="login-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
    </div>

    <el-card class="login-card">
      <div class="login-header">
        <h1>登录</h1>
        <p class="subtitle">欢迎回来，请输入您的账号信息</p>
      </div>

      <el-form
        ref="loginForms"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="手机号码" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入手机号码"
            :prefix-icon="User"
            maxlength="11"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            class="custom-input"
          />
        </el-form-item>

        <div class="options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-link">忘记密码?</el-link>
        </div>

        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="login"
          round
        >
          {{ loading ? '登录中...' : '登录' }}
        </el-button>
      </el-form>

      <div class="register-link">
        还没有账号? <router-link to="/register">立即注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  animation: float 8s infinite ease-in-out;
}

.shape1 {
  width: 500px;
  height: 500px;
  top: -250px;
  right: -100px;
  background: linear-gradient(45deg, rgba(76, 175, 255, 0.2), rgba(54, 127, 255, 0.1));
}

.shape2 {
  width: 400px;
  height: 400px;
  bottom: -200px;
  left: -100px;
  background: linear-gradient(45deg, rgba(255, 119, 119, 0.2), rgba(255, 76, 76, 0.1));
  animation-delay: 2s;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  :deep(.el-card__body) {
    padding: 40px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
  background: linear-gradient(45deg, #0071e3, #42b0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #86868b;
  font-size: 16px;
  margin-bottom: 10px;
}

.login-form {
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #1d1d1f;
  padding-bottom: 8px;
  font-size: 15px;
}

.custom-input {
  :deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    padding: 2px 15px;

    &:hover, &:focus-within {
      box-shadow: 0 3px 12px rgba(0, 113, 227, 0.15);
    }
  }

  :deep(.el-input__inner) {
    height: 48px;
    font-size: 15px;
  }

  :deep(.el-input__prefix) {
    color: #0071e3;
  }
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #0071e3;
    border-color: #0071e3;
  }

  :deep(.el-checkbox__label) {
    color: #666;
  }
}

.forgot-link {
  font-size: 14px;
  color: #0071e3;
  transition: color 0.3s;

  &:hover {
    color: #005bb5;
  }
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  height: 50px;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #0071e3, #42b0ff);
  border: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);

  &:hover, &:focus {
    background: linear-gradient(45deg, #005bb5, #0071e3);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 113, 227, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.register-link {
  margin-top: 30px;
  text-align: center;
  font-size: 15px;
  color: #86868b;

  a {
    color: #0071e3;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 1.5px;
      bottom: -2px;
      left: 0;
      background-color: #0071e3;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #005bb5;

      &:after {
        width: 100%;
      }
    }
  }
}

@media (max-width: 480px) {
  .login-card {
    max-width: 100%;

    :deep(.el-card__body) {
      padding: 30px 20px;
    }
  }

  h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>