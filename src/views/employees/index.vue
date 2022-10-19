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
        <el-button size="small" :disabled="isHasPression('employee-import')" type="warning" @click="$router.push('/import')">导入</el-button>
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
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img
              :src="row.staffPhoto"
              alt=""
              style="border-radius: 50%;
            width: 100px;
            height: 100px;
            padding: 10px;"
              @click="genQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" :disabled="isHasPression('employee-look')" @click="goDetail(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="showSetRole(row.id)">角色</el-button>
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
      <!-- 二维码弹出框 -->
      <el-dialog
        title="图片二维码"
        :visible.sync="QrCodeDialogVisible"
        width="30%"
      >
        <el-row type="flex" justify="center">
          <!-- 1.懒渲染：内容默认没有创建，弹层显示的时候才创建 -->
          <canvas ref="canvas" />
        </el-row>
      </el-dialog>
    </el-card>
    <add-employee :dialog-visible.sync="showDialog" />
    <!-- 分配权限弹出框 -->
    <AssignRole :dialog-visible.sync="dialogVisibleSetRole" :user-id="currentId" />
  </div>
</template>

<script>
import AddEmployee from './components/add-employees.vue'
import PageTools from '@/components/PageTools'
import AssignRole from '@/views/employees/components/assign-role'
import { getEmployeeList, delEmployee } from '@/api/employees'
import employeesType from '@/api/constant/employees'
import QRCode from 'qrcode'
import mixBtnPermission from '@/mixins/btnPermission'
export default {
  components: {
    PageTools,
    AddEmployee,
    AssignRole
  },
  mixins: [mixBtnPermission],
  data() {
    return {
      dialogVisibleSetRole: false,
      showDialog: false,
      loading: false,
      showBefore: true,
      QrCodeDialogVisible: false,
      currentId: '',
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
    // 点击分配角色
    showSetRole(id) {
      this.dialogVisibleSetRole = true
      this.currentId = id
    },
    genQrCode(staffPhoto) {
      // 当QrCodeDialogVisible数据更新，此时视图还没有创建出来（数据更新同步，视图更新异步）
      // 那等到视图更新完后，this.$refs.canvas为什么还是获取不到?
      // 因为只在created() 里调用了一次

      // 2.vue数据驱动/组件系统
      // 数据驱动：数据变化=>视图变化
      // 数据变化同步=>vue背后 将视图更新（异步的）
      // 为什么？如果是同步，数据变则视图立即变 太消耗性能
      // 等所有数据变化了，更新视图
      console.log(staffPhoto)
      if (!staffPhoto) return this.$message.error('暂无头像')
      this.QrCodeDialogVisible = true
      // 方法：等视图更新后触发，获取到最新的视图
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, staffPhoto, function(error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    },
    goDetail(row) {
      this.$router.push('/employees/detail/' + row.id)
    },
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
