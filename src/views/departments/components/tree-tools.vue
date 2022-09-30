<template>
  <el-row type="flex" :data="treeNode" justify="space-between" align="middle" style="hight:40px;width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <el-col><span>{{ treeNode.manager }}</span></el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="dele">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {
        // 添加
        // tree-Tools和add-Dept是兄弟组件，在tree-Tools里控制add-Dept的显示和隐藏
        // 统一在index中控制showDialog的true or false
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 编辑
      } else {
        // 删除
      }
      console.log(type)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
