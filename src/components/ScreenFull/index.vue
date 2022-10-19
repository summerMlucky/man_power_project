<template>
  <div>
    <div style="margin:0 10px">
      <SvgIcon icon-class="fullscreen" class-name="fullscreen" @click="onScreenFull" />
    </div>
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
console.log(ScreenFull)
export default {
  name: 'ScreenFull',
  methods: {
    onScreenFull() {
      if (!ScreenFull.isEnabled) return this.$message.error('卸载浏览器吧')
      ScreenFull.toggle()
    }
  }

}
</script>

<style scoped lang='scss'>
.fullscreen {
color: #fff;
}
</style>
