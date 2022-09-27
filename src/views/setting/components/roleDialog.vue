<template>
  <el-dialog
    title="新增角色"
    width="30%"
    :before-close="handleClose"
    :visible="dialogVisible"
  >
    <el-form
      ref="roleDialogForm"
      :model="formData"
      label-width="80px"
      :loadding="loadding"
    >
      <el-form-item
        prop="name"
        label="角色名称"
        :rules="[{required:true,message:'角色名称不能为空',trigger:'blur'}]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { addRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loadding: false,
      formData: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields()
    },
    async handleAdd() {
      try {
        this.$refs.roleDialogForm.validate()
        await addRole(this.formData)
        this.loadding = true
        this.$emit('refreshList')
        this.$message.success('角色新增成功')
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loadding = false
      }
    }
  }

}
</script>

