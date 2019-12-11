<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仪器预约</el-breadcrumb-item>
      <el-breadcrumb-item>仪器列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      检索条件
    </el-card>
    <el-card shadow="hover"
             v-for="item in machineList"
             :key="item.machineId">
      <el-row :gutter="0">
        <el-col :span="10">
          <!-- <img :src="getImgUrl(item.machinePicture)"
               alt=""
               width="100px"
               @click="jumpTodetails(item.machineId)"> -->
          <img src="https://cn.vuejs.org/images/logo.png"
               alt=""
               height="200px"
               @click="jumpTodetails(item.machineId)">
        </el-col>
        <el-col :span="14">
          <el-row>
            <el-col :span="24"
                    class="title">
              <span>
                <el-link @click="jumpTodetails(item.machineId)"><i class="el-icon-view el-icon--right"></i> {{item.machineName}}</el-link>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>仪器分类:{{item.machineClassification}}</div>
            </el-col>
            <el-col :span="12">
              <div>运行状态:{{item.status}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>所属单位:{{item.unit}}</div>
            </el-col>
            <el-col :span="12">
              <div>存放位置:{{item.installationLocation}}</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-button style="float: right; padding: 3px 0"
                 type="primary"
                 icon="el-icon-phone-outline">预约</el-button>
      <el-button style="float: right; padding: 3px 0"
                 type="warning"
                 icon="el-icon-star-off">收藏</el-button>
    </el-card>
    <!-- 页脚跳转 -->
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page"
                     :page-sizes="[1, 2, 5]"
                     :page-size="size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tatal">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      machineList: [],
      page: 1,
      size: 2,
      tatal: 0
    }
  },
  created () {
    this.getMachineList()
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
      this.getMachineList()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getMachineList()
    },
    getImgUrl (img) {
      return require('../../assets/machine_images/' + img)
    },
    async getMachineList () {
      const { data: res } = await this.$http.get(`machine/list/page=${this.page}&size=${this.size}`)
      if (res.code !== 200) {
        return this.$message.error('获取仪器列表失败！')
      }
      this.tatal = res.data.total
      this.machineList = res.data.list
      console.log(this.machineList)
    },
    jumpTodetails (machineId) {
      this.$router.push({ name: 'MachineDetails', query: { id: machineId } })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
  margin-left: 3%;
  margin-right: 3%;
  // > div {
  //   line-height: 20px;
  // }
}
</style>
