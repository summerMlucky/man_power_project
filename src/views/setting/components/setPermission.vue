<template>
  <el-dialog
    title="分配权限"
    :visible="dialogVisible"
    width="50%"
    @close="onClose"
    @open="onOpen"
  >
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      node-key="id"
      lazy
      show-checkbox
      default-expand-all
      :default-checked-keys="defCheckKeys"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPermissions } from '@/api/permissions'
import { tranListToTreeData } from '@/utils/index'
import { getRolesPermissionById, AddRolesPermission } from '@/api/roles'
export default {
  name: 'SetPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rolesId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      defCheckKeys: [],
      data: [],
      defaultProps: {
        label: 'name'
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('update:dialogVisible', false)
    },
    async onConfirm() {
      // 给角色分配权限
      try {
        await AddRolesPermission({
          id: this.rolesId,
          permIds: this.$refs.tree.getCheckedKeys()
        })
        this.$message.success('分配成功')
      } catch (error) {
        this.$message.error('分配失败')
      }

      this.onClose()
    },
    async onOpen() {
      const res = await getPermissions()
      this.data = tranListToTreeData(res, '0')
      this.getRolePermissions()
    },
    // 获取角色详情
    async getRolePermissions() {
      const res = await getRolesPermissionById(this.rolesId)
      this.defCheckKeys = res.permIds
    }
  }
}
</script>

<style>

</style>
