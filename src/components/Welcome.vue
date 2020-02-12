<template>
  <div>
    <h3 class="title">欢迎访问厦大仪器预约系统</h3>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <div>当前预约状况</div>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="reservationListNow"
                stripe>
        <el-table-column label="仪器id"
                         width="70px"
                         prop="machineId"></el-table-column>
        <el-table-column label="仪器图片"
                         width="170px">
          <template slot-scope="scope">
            <div class="machine_picture">
              <img :src="scope.row.machinePicture">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="仪器名"
                         prop="machineName">
          <template slot-scope="scope">
            <el-link type="primary"
                     style="font-size: 12px;"
                     @click="goToDetailpage(scope.row.machineId)">{{scope.row.machineName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="存放位置"
                         prop="installationLocation"></el-table-column>
        <el-table-column label="预约时间段"
                         width="280px">
          <template slot-scope="scope">
            {{scope.row.reservationStartTime}}至{{scope.row.reservationEndTime}}
          </template>
        </el-table-column>
        <el-table-column label="实际开始时间"
                         width="150px"
                         prop="actualStartTime"></el-table-column>
        <el-table-column label="实际结束时间"
                         width="150px"
                         prop="actualEndTime"></el-table-column>
        <el-table-column label="预约状态"
                         width="110px"
                         prop="role_name">
          <template slot-scope="scope">
            <el-tag size="mini"
                    type="success"
                    v-if="scope.row.reservationStatus===1">预约成功</el-tag>
            <el-tag size="mini"
                    type="success"
                    v-else-if="scope.row.reservationStatus===11">使用中</el-tag>
            <el-tag size="mini"
                    type="success"
                    v-else-if="scope.row.reservationStatus===31">使用正常</el-tag>
            <el-tag size="mini"
                    type="warning"
                    v-else-if="scope.row.reservationStatus===51">未按时使用</el-tag>
            <el-tag size="mini"
                    type="warning"
                    v-else-if="scope.row.reservationStatus===61">使用时间超时</el-tag>
            <el-tag size="mini"
                    type="danger"
                    v-else-if="scope.row.reservationStatus===81">未到场</el-tag>
            <el-tag size="mini"
                    type="info"
                    v-else-if="scope.row.reservationStatus===91">预约取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="80px">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        content="取消预约"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="cancelReservationById(scope.row.reservationId)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reservationListNow: []
    }
  },
  mounted () {
    this.getReservationListNow()
  },
  methods: {
    // 获取当前预约列表
    async getReservationListNow () {
      const { data: res } = await this.$http.get('reservation/myReservations/0')
      if (res.code !== 200) {
        return this.$message.error('获取当前预约列表失败！')
      }
      console.log(res)
      this.reservationListNow = res.data
    },
    // 取消预约
    async cancelReservationById (id) {
      const confirmResult = await this.$confirm(
        '是否取消该预约?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('操作取消！')
      }
      const { data: res } = await this.$http.delete('reservation/' + id)
      if (res.code !== 200) {
        return this.$message.error('取消预约失败！')
      }
      this.$message.success('该预约取消成功！')
      this.getReservationListNow()
    },
    // 进入详情页
    goToDetailpage (machineId) {
      this.$router.push({ name: 'InstrumentDetails', query: { id: machineId } })
    }
  }
}
</script>

<style lang="less" scoped>
.machine_picture {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
.title {
  text-align: center;
}
</style>
