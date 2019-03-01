<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a href="#" class="loginout" @click="handleBack">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
            
            :unique-opened="false"
            :router="true"
            >
          <el-submenu 
          :index="item1.order+''" 
          v-for="(item1, i) in menus"
          :key = item1.id
          >
            <template slot="title">
              <i class="el-icon-location-outline"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item-group>
                <el-menu-item :index="item2.path+''" v-for="(item2, i) in item1.children" :key=item2.id>
                    <i class="el-icon-menu"></i>
                    <span>{{item2.authName}}</span>
                </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <el-main class="main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    }
  },
  beforeMount () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('请先登录')
    }
  },
  created () {
    this.getMenu()
  },
  methods: {
    async getMenu() {
      const res = await this.$http.get(`menus`)
      // console.log(res)
      const {meta: {msg, status}, data} = res.data
      if(status === 200) {
        this.menus = data
      }
    },
    handleBack () {
      // 清除token
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('退出成功')
    }
  }
}
</script>

<style>
.container {
  background: #b3c0d1;
  height: 100%;
}
.middle {
  text-align: center;
  line-height: 60px;
}
.aside {
  /*  */
}
.main {
  /* background: blue; */
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
