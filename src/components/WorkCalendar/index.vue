<template>
  <div>
    <el-row type="flex" justify="end">
      <el-col :span="4">
        <el-select v-model="currentYear" @change="updateCalendar">
          <el-option
            v-for="item in years"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="currentMouth" @change="updateCalendar">
          <el-option
            v-for="item in 12"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-calendar v-model="currentDate">
      <template
        slot="dateCell"
        slot-scope="{date}"
      >
        <div>
          <span>{{ date.getDate() }}</span>
          <span v-if="date.getDay()===6||date.getDay()===0" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  data() {
    return {
      currentYear: '2022',
      currentMouth: 10,
      currentDate: new Date(),
      years: ['2018', '2019', '2020', '2021', '2022', '2023']
    }
  },
  created() {
    this.initYear()
  },
  methods: {
    initYear() {
      const data = new Date()
      this.currentYear = data.getFullYear()
      this.years = Array(11).fill(this.currentYear).map((item, index) => {
        return item - 5 + index
      })
      console.log(this.years)
    },
    updateCalendar() {
      this.currentDate = this.currentYear + '-' + this.currentMouth
    }
  }
}
</script>

<style scoped lang = 'scss'>
::v-deep .el-calendar{
    .el-calendar__header{
    display: none;
    }
    .el-calendar-table td, .el-calendar-table tr:first-child td{
        border: none;
    }
    .rest{
            width: 20px;
            height: 20px;
            line-height: 20px;
            display: inline-block;
            color: #fff;
            border-radius: 50%;
            background: #fa7c4d;
            font-size: 12px;
            margin-left: 10px;
            padding-left: 4px
    }
}
</style>
