<template>
  <div>
    <!-- 默认插槽 -->
    <!--  <PageTools>
      <span>共25条记录</span>
    </PageTools> -->
    <!-- 具名插槽 -->
    <PageTools type="success" :show-before="showBefore">
      <template #before>
        <span>共25条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
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
  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
export default {
  components: {
    PageTools
  },
  data() {
    return {
      showBefore: true
    }
  }
}
</script>

<style>

</style>
