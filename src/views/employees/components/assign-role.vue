<template>
  <el-dialog
    title="提示"
    :visible="dialogVisible"
    width="50%"
    @close="onClose"
    @open="onOpen"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogVisible',false)">取 消</el-button>
      <el-button type="primary" @click="saveEmployeesRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoles, setEmployeesRoles } from '@/api/roles'
import { getDetailUserInfo } from '@/api/user'
export default {
  name: 'AssignRole',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      checkList: [],
      roles: []
    }
  },
  methods: {
    onClose() {
      this.$emit('update:dialogVisible', false)
      this.checkList = []
    },
    // 给角色分配权限
    async  saveEmployeesRole() {
      if (!this.checkList) this.$message.error('请选择必要的角色')
      try {
        const res = await setEmployeesRoles({
          id: this.userId,
          roleIds: this.checkList
        })
        this.$message.success('分配成功')
        console.log(res)
      } catch (error) {
        this.$message.error('分配失败')
      }
      this.onClose()
    },
    async onOpen() {
      const { rows } = await getRoles()
      this.roles = rows
      this.getEmployeesRoles()
    },
    async getEmployeesRoles() {
      const res = await getDetailUserInfo(this.userId)
      this.checkList = res.roleIds || []
      console.log(res)
    }
  }
}
</script>
