<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  data() {
    return {

    }
  },
  methods: {
    beforeUpload(file) {
    //   if (file.size > 1024) {
    //     this.$message.error('to Big')
    //     return false
    //   }
    //   return true
    },
    async  success({ header, results }) {
      console.log(header, results)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr) // 调用导入接口
      this.$router.back()
    }
  }
}
</script>

<style>

</style>
