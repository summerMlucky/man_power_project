<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="showDialog" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const codeCheck = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = true
      if (this.formData.id) {
        // 编辑模式 因为编辑模式下 不能算自己
        isRepeat = depts.some(item => this.formData.id !== item.id && item.code === value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? callback(new Error(`模块下已存在${value}编码`)) : callback()
    }
    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = true

      if (this.formData.id) {
        // 编辑模式
        // 找到同层级的数据 pid相同就是同级
        const deptsj1 = depts.filter(item => item.pid === this.currentNode.pid && this.currentNode.id !== item.id)
        isRepeat = deptsj1.some(item => item.name === value)
        // console.log(isRepeat)
        // console.log(deptsj1)
      } else {
        // 新增模式
        const deptsj = depts.filter(item => item.pid === this.currentNode.id)
        isRepeat = deptsj.some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`模块下已存在${value}名称`)) : callback()
      //   console.log(deptsj)
      callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      peoples: [],
      loading: false,
      rules: {
        name: [{ required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }],
        manager: [{ required: true, message: '部门管理者必填', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  created() {
    console.log(this.currentNode)
  },
  methods: {
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      this.peoples = res
      console.log(res)
    },
    handleClose() {
      this.$emit('update:showDialog', false)
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async submit() {
      try {
        // 表单校验通过validates()
        await this.$refs.addDeptForm.validate()
        this.loading = true
        if (this.formData.id) {
          await updateDepartments({ ...this.formData })
        } else {
          await addDepartments({ ...this.formData }, this.currentNode.id)
        }
        this.$message.success(`${this.formData.id ? '编辑' : '添加'}成功`)
        this.$parent.getDepartments()
        this.handleClose()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
