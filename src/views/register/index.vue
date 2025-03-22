<script setup lang="ts">
import { User, Lock, Message, Phone } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import useUserStore from '@/store/modules/user.ts'

let registerForms = ref()
let useStore = useUserStore()
let loading = ref(false)
let $router = useRouter()
let registerForm = reactive({
  username: '13711021216',
  password: 'hzc.22580',
  confirmPassword: 'hzc.22580',
  email: 'edison.wongg@outlook.com',
  phone: '大傻瓜aaa',
  agreement: false
})
let showPassword = ref(false)

const register = async () => {
  // 表单校验
  await registerForms.value.validate()

  loading.value = true
  try {
    // 这里添加注册逻辑
    // await userRegister(registerForm)
    delete registerForm.confirmPassword
    delete registerForm.agreement
    await useStore.userRegister(registerForm)
    ElNotification({
      type: 'success',
      message: '注册成功',
      title: `欢迎加入我们`,
      duration: 1500
    })

    // 注册成功后跳转到登录页
    setTimeout(() => {
      $router.push('/login')
       }, 1500)
  } catch (error) {
    loading.value = false
    ElNotification({ type: 'error', message: '用户名已存在' })
  }
}

// 自定义密码确认验证
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  phone: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度应在5-20个字符之间', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'change' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' }
  ],
  agreement: [
    {
      validator: (rule: any, value: boolean, callback: any) => {
        if (value) {
          callback()
        } else {
          callback(new Error('请阅读并同意用户协议'))
        }
      },
      trigger: 'change'
    }
  ]
}
</script>

<template>
  <div class="register-container">
    <div class="register-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>

    <el-card class="register-card">
      <div class="register-header">
        <h1>注册账号</h1>
        <p class="subtitle">创建您的账号，开始使用我们的服务</p>
      </div>

      <el-form
        ref="registerForms"
        :model="registerForm"
        :rules="rules"
        label-position="top"
        class="register-form"
      >
        <el-form-item label="手机号码" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入手机号码"
            :prefix-icon="User"
            class="custom-input"
          />
        </el-form-item>

        <div class="form-row">
          <el-form-item label="邮箱" prop="email" class="form-col">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item label="昵称" prop="phone" class="form-col">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入昵称"
              :prefix-icon="Phone"
              maxlength="11"
              class="custom-input"
            />
          </el-form-item>
        </div>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            show-password
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="agreement" class="agreement-item">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意 <el-link type="primary" :underline="false" class="agreement-link">用户协议</el-link> 和 <el-link type="primary" :underline="false" class="agreement-link">隐私政策</el-link>
          </el-checkbox>
        </el-form-item>

        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="register"
          round
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </el-button>
      </el-form>

      <div class="login-link">
        已有账号? <router-link to="/login">返回登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-background {
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

.shape3 {
  width: 300px;
  height: 300px;
  top: 40%;
  left: 60%;
  background: linear-gradient(45deg, rgba(119, 255, 214, 0.2), rgba(76, 255, 200, 0.1));
  animation-delay: 4s;
  animation-duration: 10s;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.register-card {
  width: 100%;
  max-width: 520px;
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

.register-header {
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

.register-form {
  margin-top: 20px;
}

.form-row {
  display: flex;
  gap: 16px;

  .form-col {
    flex: 1;
  }
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

.agreement-item {
  margin-top: 10px;
  margin-bottom: 25px;

  :deep(.el-form-item__content) {
    line-height: 1.5;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #0071e3;
    border-color: #0071e3;
  }

  :deep(.el-checkbox__label) {
    color: #666;
    font-size: 14px;
  }
}

.agreement-link {
  font-size: 14px;
  font-weight: 500;
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

.login-link {
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

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .register-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .register-card {
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