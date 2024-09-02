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
let loginForm = reactive({ username: 'admin', password: '111111' })
let useStore = useUserStore()
const login = async () => {
  //表单校验
  await loginForms.value.validate()

  loading.value = true
  try {
    await useStore.userLogin(loginForm)
    
    let redirect: any = route.query.redirect
    await $router.push({ path: redirect || '/' })
    ElNotification({ type: 'success', message: 'Welcome', title: `Hi,Good ${getTime()}`,duration:1500 })
  } catch (error) {
    loading.value = false
    ElNotification({ type: 'error', message: (error as Error).message })
  }
}

const rules = {
  username: [{
    required: true,
    message: 'Please input username',
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
      max: 10,
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
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>HELLO</h1>
          <h2>Welcome to VUE3 DashBoard</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username" size="large"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" size="large"
                      show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="large" @click="login">login</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg");
  background-size: cover;


  .login_form {
    position: relative;
    width: 70%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    border-radius: 20px;
    padding: 40px;

    h1 {
      color: antiquewhite;
      font-size: 40px;
      font-weight: bold;
    }

    h2 {
      color: antiquewhite;
      font-size: 20px;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }

}
</style>