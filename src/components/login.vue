<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleLogin()" class="login-btn">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post(`login`, this.formdata)
      const { data: {
        meta: {msg, status},
        data: {token}
      } } = res
      if (status === 200) {
        localStorage.setItem('token', token)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login-form {
  background-color: #fff;
  width: 400px;
  border-radius: 10px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
