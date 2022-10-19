<template>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div id="main" style="width: 600px;height:400px;" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Radar',
  created() {

  },
  mounted() {
    this.initRadar()
  },
  methods: {
    initRadar() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '人物绩效图'
        },
        legend: {
          data: ['张小瑜', '老甜头']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '干饭', max: 100 },
            { name: '摸鱼', max: 100 },
            { name: '睡觉', max: 100 },
            { name: '学习', max: 100 },
            { name: '考勤', max: 100 },
            { name: '加班', max: 100 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [80, 50, 100, 80, 0, 100],
                name: '张小瑜'
              },
              {
                value: [100, 100, 50, 100, 100, 0],
                name: '老甜头'
              }
            ]
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }

}
</script>

<style>

</style>
