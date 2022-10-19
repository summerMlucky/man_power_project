<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="false">
        <template #after>
          <el-button type="primary" @click="showPermission(1,'0')">添加权限</el-button>
        </template>
      </PageTools>

      <el-table
        ref="table"
        :data="tableData"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column
          prop="name"
          label="名称"
        >
          <template slot-scope="{row}">
            <template v-if="row.type===1">
              <i class="el-icon-folder-opened" @click="expandColumn(row)">{{ row.name }}</i>
            </template>
            <template v-if="row.type===2">
              <i class="el-icon-folder" style="margin-left:20px" @click="expandColumn(row)">{{ row.name }}</i>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="标识"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button v-if="row.type===1" type="text" @click="showPermission(2,row.id)">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增权限弹框 -->
    <el-dialog
      title="新增权限"
      :visible.sync="addPerDialogVisible"
      width="50%"
      @close="onClose"
    >
      <el-form ref="form" label-width="80px" :model="addPermissionFrom" :rules="addPermissionRules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="addPermissionFrom.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="addPermissionFrom.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="addPermissionFrom.description" />
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch
            v-model="addPermissionFrom.enVisible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="saveAddPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissions, addPermissions } from '@/api/permissions'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permissions',
  data() {
    return {
      tableData: [],
      addPerDialogVisible: false,
      addPermissionFrom: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      },
      addPermissionRules: {
        name: [{
          required: true, message: '请输入权限名称', triggle: 'blur'
        }],
        code: [{
          required: true, message: '请输入权限标识', triggle: 'blur'
        }]
      }
    }
  },
  created() {
    this.loadPermissions()
  }, methods: {
    // 加载权限列表
    async loadPermissions() {
      const res = await getPermissions()
      this.tableData = tranListToTreeData(res, '0')
    },
    expandColumn(row) {
      console.log(row)
      row.isExpand = !row.isExpand
      this.$refs.table.toggleRowExpansion(row, row.isExpand)
    },
    showPermission(type, pid) {
      this.addPerDialogVisible = true
      this.addPermissionFrom.type = type
      this.addPermissionFrom.pid = pid
    },
    saveAddPermission() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const res = await addPermissions(this.addPermissionFrom)
        console.log(res)
        this.onClose()
      })
    },
    onClose() {
      this.addPerDialogVisible = false
      this.$refs.form.resetFields()// 只会制空校验的表单
      this.addPermissionFrom = {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-table__expand-icon{
  display: none !important;
}
</style>
