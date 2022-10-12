<template>
  <el-dialog title="新增员工" :visible="dialogVisible" @close="handleClose">
    <!-- 表单 -->
    <el-form
      ref="HrsaasAddEmployee"
      label-width="120px"
      :rules="rules"
      :model="formData"
    >
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-show="showTree" v-loading="loading" :data="treeData" :default-expand-all="true" :props="{label:'name'}" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  name: 'HrsaasAddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTree: false,
      loading: false,
      treeData: [],
      hireType: EmployeeEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // - 用户名必填，username，长度为1-4位
      // - 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
      // - 聘用形式必填， formOfEmployment
      // - 工号必填，workNumber
      // - 部门必填，departmentName
      // - 入职时间必填， timeOfEntry
      // - 转正时间可选，correctionTime
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '用户姓名不能为空' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }],
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { trigger: 'blur', pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ],
        formOfEmployment: [
          { required: true, trigger: 'change', message: '聘用形式不能为空' }
        ],
        workNumber: [
          { required: true, trigger: 'blur', message: '工号不能为空' }
        ],
        departmentName: [
          { required: true, trigger: 'change', message: '部门不能为空' }
        ],
        timeOfEntry: [
          { required: true, trigger: 'blur', message: '入职时间不能为空' }
        ]
      }
    }
  },
  methods: {
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    async  submit() {
      try {
        await addEmployee(this.formData)
        await this.$refs.HrsaasAddEmployee.validate()
        this.$parent.getEmployeeList()
        this.handleClose()
      } catch (error) {
        console.log(error)
      }
    },
    handleClose() {
      this.$refs.HrsaasAddEmployee.resetFields()
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$emit('update:dialogVisible', false)
      this.showTree = false
    }
  }
}
</script>
<style scoped>

</style>
