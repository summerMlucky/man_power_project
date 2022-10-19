<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-row style="height:60px">
            <el-button type="primary" size="small" :disabled="isHasPression('role-add')" icon="el-icon-plus" style="margin-left:10px;" @click="handleAdd">新增角色</el-button>
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
              <template slot-scope="{row}">
                <el-button size="small" type="success" :disabled="isHasPression('role-assign')" @click="showSetPermission(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" :disabled="isHasPression('role-edit')" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" :disabled="isHasPression('role-delete')" @click="deleRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
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
    <role-dialog ref="editRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
    <!-- 分配权限弹窗 -->
    <set-permission :dialog-visible.sync="dialogVisibleSetPermission" :roles-id="currentRoleId" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleListAPI, deleteRole, getCompanyInfo } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
import SetPermission from './components/setPermission.vue'
import mixBtnPermission from '@/mixins/btnPermission'
export default {
  components: {
    roleDialog,
    SetPermission
  },
  mixins: [mixBtnPermission],
  data() {
    return {
      activeName: 'first',
      loading: false,
      dialogVisible: false,
      dialogVisibleSetPermission: false,
      currentRoleId: '',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      rolesList: [],
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
    // isHasPression() {
    //   return function(permissionId) {
    //     return !this.$store.state.user.userInfo.roles.points.includes(permissionId)
    //   }
    // }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 点击分配权限
    showSetPermission(id) {
      this.dialogVisibleSetPermission = true
      this.currentRoleId = id
    },
    async getCompanyInfo() {
      try {
        const res = await getCompanyInfo(this.companyId)
        this.companyInfo = res
      } catch (error) {
        console.log('error')
      }
    },
    async getRoleList() {
      try {
        this.loading = true
        const { total, rows } = await getRoleListAPI(this.page)
        this.total = total
        this.rolesList = rows
        // 解决方案：total 大于0 并且 rows的length === 0 这种情况并不是正在的没有数据 是有的，要重新发起请求
        if (total > 0 && rows.length === 0) {
          this.page.page--
          this.getRoleList()
        }
      } catch (error) {
        // console.log(error)
      } finally { this.loading = false }
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    editRole(rows) {
      this.$refs.editRole.formData = { ...rows }
      this.dialogVisible = true
    },
    async deleRole(id) {
      try {
        await this.$confirm('Are you sure you want to delete', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        await deleteRole(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getRoleList()
        // console.log('confirm')
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        console.log('cancel')
      }
    }
  }
}
</script>

<style>

</style>
