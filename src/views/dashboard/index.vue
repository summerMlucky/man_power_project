<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <svg-icon icon-class="eye" />
    <UploadImg @on-success="onSuccess1" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    onSuccess1(val) {
      console.log(val)
      console.log('onSuccess1', val)
    },
    onSuccess2(val) {
      console.log(val)
      console.log('onSuccess2', val)
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
