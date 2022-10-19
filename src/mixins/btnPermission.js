export default {
  computed: {
    isHasPression() {
      return function(permissionId) {
        return !this.$store.state.user.userInfo.roles.points.includes(permissionId)
      }
    }
  }
}
