<template>
  <div>
    <!-- 默认插槽 -->
    <!--  <PageTools>
      <span>共25条记录</span>
    </PageTools> -->
    <!-- 具名插槽 -->
    <PageTools type="success" :show-before="showBefore">
      <template #before>
        <span>共{{ total }}条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="handleAdd">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 作用域插槽 -->
    <!-- <PageTools>
      <template v-slot:before="scope">
        <span>共25条记录{{ scope }}</span>
      </template>
    </PageTools> -->
    <!-- 插槽语法
    1.新语法
    默认插槽
    作用域插槽
     -->
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{row}">
            {{ row.timeOfEntry|formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch
              :value="row.enableState===1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delBtn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next,total,sizes"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,4,8,10]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <add-employee :dialog-visible.sync="showDialog" />
  </div>
</template>

<script>
import AddEmployee from './components/add-employees.vue'
import PageTools from '@/components/PageTools'
import { getEmployeeList, delEmployee } from '@/api/employees'
import employeesType from '@/api/constant/employees'
export default {
  components: {
    PageTools,
    AddEmployee
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      showBefore: true,
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0,
      list: [],
      hireType: employeesType.hireType
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {

    async exportExcel() {
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      const exportExcelMapPath = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map(item => {
        return header.map(h => {
          if (h === '聘用形式') {
            const find = this.hireType.find(hire => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return find ? find.value : '未知'
          }
          return item[exportExcelMapPath[h]]
        })
      })
      const { export_json_to_excel } = await import('@/vendor/Export2Excel.js')
      export_json_to_excel({
        header, // 表头 必填
        multiHeader: [['手机号', '主要信息', '', '', '', '部门', '']],
        merges: ['A1:A2', 'B1:F1', 'F1:G1'],
        data, // 具体数据 必填
        filename: '人力资源员工信息', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    handleAdd() {
      this.showDialog = true
    },
    async delBtn(id) {
      try {
        await this.$confirm('您确认删除该条信息吗？')
        await delEmployee(id)
        this.$message.success('')
        this.getEmployeeList('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
      } finally {
        this.loading = false
      }
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = this.hireType.find(ele => ele.id === cellValue)
      return obj ? obj.value : '未知'
    }
  }
}
</script>

<style>

</style>
