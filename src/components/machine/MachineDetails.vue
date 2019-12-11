<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仪器预约</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/machineList' }">仪器列表</el-breadcrumb-item>
      <el-breadcrumb-item>仪器详情</el-breadcrumb-item>
    </el-breadcrumb>

  </div>
</template>

<script>
export default {
  data () {
    return {
      machineDetailsList: []
    }
  },
  created () {
    this.getMachineDetailsList()
  },
  methods: {
    async getMachineDetailsList () {
      const { data: res } = await this.$http.get(`machine/details/${this.$route.query.id}`)
      if (res.code !== 200) {
        return this.$message.error('获取仪器详情失败！')
      }
      this.machineDetailsList = res.data
      console.log(this.machineDetailsList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
