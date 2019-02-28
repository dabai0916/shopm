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
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="addUserList()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
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
      <el-table-column prop="id" label="#" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="220"></el-table-column>
      <el-table-column label="创建日期" width="300">
        <template slot-scope="scope">{{scope.row.create_time | fmdate}}</template>
      </el-table-column>
      <el-table-column prop="status" label="用户状态" width="200">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="showEditBox(scope.row)"
            icon="el-icon-edit"
            circle
            plain
            size="small"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="showDelBox(scope.row)"
            circle
            plain
            size="small"
          ></el-button>
          <el-button
            @click="showDiaRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            plain
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="formdata">
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="formdata.username" hide-required-asterisk disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px">
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="80px">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="用户名">{{ formdata.username }}</el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择">
            <el-option label="请选择" disabled :value="-1"></el-option>
            <!-- v-for渲染 -->
            <el-option 
            :label="item.roleName"
            :value="item.id"
            v-for="(item, i) in roles" 
            :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: 15,
      list: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      selectVal: -1,
      roles: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //分配角色
    async setRole() {
      const res = await this.$http.put(`users/${this.formdata.id}/role`, {
        rid: this.selectVal
      })
      const {meta: {msg, status}, data} = res.data
      if(status === 200) {
        this.dialogFormVisibleRole = false
        this.$message.success(msg)
      }
    },
    async showDiaRole(user) {
      this.dialogFormVisibleRole = true;
      this.formdata = user;
      const res = await this.$http.get(`roles`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
        // console.log(this.formdata.id)
      }
      const res2 = await this.$http.get(`users/${user.id}`)
      // const {meta:{msg, status}, data} = res2.data
      this.selectVal = res2.data.data.rid
    },
    //修改用户状态
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    showEditBox(user) {
      this.dialogFormVisibleEdit = true;
      this.formdata = user;
      user.email = "";
      user.mobile = "";
    },
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(this.formdata);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        console.log("1");
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      }
    },
    //删除用户
    showDelBox(users) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //删除请求
          const res = await this.$http.delete(`users/${users.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功");
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async addUser() {
      const res = await this.$http.post(`users`, this.formdata);
      this.dialogFormVisibleAdd = false;
      this.getTableData();
    },
    addUserList() {
      // this.formdata = ''
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    getAllUsers() {
      this.getTableData();
    },
    searchUser() {
      this.getTableData();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      // 设置请求头token值
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
      }
    }
  }
};
</script>

<style>
.searchBox {
  margin-top: 10px;
}
.delAlert {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
