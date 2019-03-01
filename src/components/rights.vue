<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户按钮 -->
    <el-button type="primary" class="addRoles">添加角色</el-button>
    <!-- 权限列表表格 -->
    <el-table :data="list" stripe height="400px" style="width: 100%">
      <!--
        create_time: 1486720211
        email: "adsfad@qq.com"
        id: 500
        mg_state: true
        mobile: "12345678"
        role_name: "主管"
        username: "admin"
      -->
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="authName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="220"></el-table-column>
      <el-table-column prop="level" label="层级" width="220">
          <template slot-scope="scope">
              <span v-if="scope.row.level === '0'">一级</span>
              <span v-if="scope.row.level === '1'">二级</span>
              <span v-if="scope.row.level === '2'">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style>
.addRoles {
  margin-top: 20px;
}
</style>
