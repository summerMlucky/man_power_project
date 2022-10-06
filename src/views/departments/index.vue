<template>
  <div class="departments-container">
    <el-card shadow="always">
      <tree-tools :tree-node="company" :is-root="false" @addDept="handelAddDept" />
    </el-card>
    <el-tree
      :data="departs"
      default-expand-all
      :props="defaultProps"
    >
      <!-- el-tree里面的这个内容data 就是插槽内容 循环-->
      <!-- slot-scope是 tree组件传给每个节点的插槽的内容的数据-->
      <tree-tools slot-scope="{ data }" :tree-node="data" @refreshList="getDepartments" @addDept="handelAddDept" @editDept="handelEditDept" />
    </el-tree>
    <!-- 弹窗 -->
    <add-dept ref="editDept" :show-dialog.sync="showDialog" :current-node="currentNode" />
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils/index'
import { getDepartments } from '@/api/departments'
import treeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
export default {
  components: {
    treeTools,
    addDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: {},
      showDialog: false,
      currentNode: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { depts, companyName, companyManage } = await getDepartments()
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage, id: '' }
    },
    handelAddDept(node) {
      this.showDialog = true
      this.currentNode = node
    },
    handelEditDept(node) {
      this.showDialog = true
      this.currentNode = { ...node }
      this.$refs.editDept.formData = { ...node }
    }
  }
}
</script>

<style scoped lang='scss'>
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-card__body {
    padding-right: 0px !important;
}
  .el-tree {
    .el-tree-node__content {
      // padding-right: 20px;
    }
  }
}

</style>
