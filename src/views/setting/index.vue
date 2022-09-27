<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-row style="height:60px">
            <el-button type="primary" size="small" icon="el-icon-plus" style="margin-left:10px;" @click="handleAdd">新增角色</el-button>
          </el-row>

          <el-table
            v-loading="loading"
            style="width: 100%"
            :data="rolesList"
          >
            <el-table-column
              type="index"
              label="序号"
              width="120"
            />
            <el-table-column
              label="角色"
              width="240"
              prop="name"
            />
            <el-table-column
              label="描述"
              prop="description"
            />
            <el-table-column
              label="操作"
              width="240"
            >
              <el-button size="small" type="success">分配权限</el-button>
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
    <el-row type="flex" justify="end" align="middle" style="height: 60px">
      <!-- // background   添加背景
      // current-page 当前的页面
      // page-size    每一页展示的条数
      // page-sizes   每页显示个数选择器的选项设置
      // total        总共多少条数据
      // layout       布局
      // current-change 改变当前页码的触发（current-page 值改变的时候触发）
      // size-change 改变页面的数据条数的时候 触发（page-size 值改变的时候触发） -->
      <el-pagination
        v-if="total>0"
        background
        layout="prev, pager, next,sizes"
        :total="total"
        :current-page.sync="page.page"
        :page-size.sync="page.pagesize"
        :page-sizes="[2,4,6,8,10]"
        @current-change="getRoleList"
        @size-change="getRoleList"
      />
    </el-row>
    <role-dialog :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
  </div>
</template>

<script>
import { getRoleListAPI } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
export default {
  components: {
    roleDialog
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      dialogVisible: false,
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      rolesList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { total, rows } = await getRoleListAPI(this.page)
        this.total = total
        this.rolesList = rows
      } catch (error) {
        console.log(error)
      } finally { this.loading = false }
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>

</style>
