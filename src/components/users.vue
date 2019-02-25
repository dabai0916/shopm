<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchBox">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="list" stripe style="width: 100%">
      <!--
        create_time: 1486720211
        email: "adsfad@qq.com"
        id: 500
        mg_state: true
        mobile: "12345678"
        role_name: "主管"
        username: "admin"
      -->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="200">
        <template slot-scope="list">
          {{list.row.create_time | fmdate}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="用户状态" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" width="200"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 6,
      list: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      // 设置请求头token值
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      console.log(res)
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.list = data.users
      }
    }
  }
}
</script>

<style>
.searchBox {
  margin-top: 10px;
}
</style>
