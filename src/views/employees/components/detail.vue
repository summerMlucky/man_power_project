<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="登录账号设置" name="first">
            <!-- 表单添加校验
            1.form组件：  :model='' :rules:''
            2.form-item: prop 属性 -->
            <el-form ref="form" label-width="80px" :model="accountInnfo" :rules="accountInfoRules">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="accountInnfo.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInnfo.password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDetailUserInfo, saveUserDetailById } from '@/api/user'
import userInfo from '@/views/employees/components/user-info.vue'
import jobInfo from '@/views/employees/components/job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      accountInnfo: {},
      accountInfoRules: {
        username: [
          { required: true, message: '请输入员工名称 ', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, message: '密码长度最小6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadEmployeeInfo()
  },
  methods: {
    async loadEmployeeInfo() {
      const res = await getDetailUserInfo(this.$route.params.id)
      this.accountInnfo = res
    },
    // 更新用户信息
    async  updateEmployees() {
      // async和await有什么缺点
      // 错误 必须try catch 进行捕获错误
      try {
        await this.$refs.form.validate()
        await saveUserDetailById(this.accountInnfo)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    },
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
