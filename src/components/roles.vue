<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="primary" class="addRoles">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="lv1" v-for="(item1,i) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="delRights(scope.row, item1)" closable type="danger">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="lv2" v-for="(item2,i) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="delRights(scope.row, item2)"
                    closable
                    type="info"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delRights(scope.row, item3)"
                    v-for="(item3,i) in item2.children"
                    :key="item3.id"
                    closable
                    type="success"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain size="small"></el-button>
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
    <!-- 修改权限对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleRight">
      <el-tree
        :data="treelist"
        ref="treeDom"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrChecked"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      treelist: [],
      dialogFormVisibleRight: false,
      arrChecked: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      currRoleId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async setRoles() {
        const arr1 = this.$refs.treeDom.getHalfCheckedKeys()
        const arr2 = this.$refs.treeDom.getCheckedKeys()
        const arr = [...arr1, ...arr2]
        // console.log(arr)
        // console.log(this.currRoleId)
        const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
            rids : arr.join(',')
        })
        // console.log(res);
        
        if(res.data.meta.status === 200) {
            this.dialogFormVisibleRight = false
            this.getTableData()
            this.$message.success(res.data.meta.msg)
        }
    },
    async showDiaRole(role) {
      this.dialogFormVisibleRight = true;
      this.currRoleId = role.id
      const res = await this.$http.get(`rights/tree`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      this.treelist = data;
      const temp = [];
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            temp.push(item3.id);
          });
        });
      });
      this.arrChecked = temp;
    },
    async delRights(role, right) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      }
    },
    async getTableData() {
      const res = await this.$http.get(`roles`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      console.log(res);
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
.lv1 {
  margin-bottom: 10px;
}
.lv2 {
  margin-bottom: 10px;
}
</style>
