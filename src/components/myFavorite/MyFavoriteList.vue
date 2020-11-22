<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
      <el-breadcrumb-item>收藏列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入仪器名"
                    v-model="queryInfo.machineName"
                    clearable
                    @clear="getFavoriteList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getFavoriteList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="favoriteList"
                stripe>
        <el-table-column label="仪器ID"
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
                         width="200px"
                         prop="machineName">
          <template slot-scope="scope">
            <el-link type="primary"
                     style="font-size: 12px;"
                     @click="goToDetailpage(scope.row.machineId)">{{scope.row.machineName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="仪器分类"
                         prop="machineClassification"></el-table-column>
        <el-table-column label="所属单位"
                         prop="unit"></el-table-column>
        <el-table-column label="存放位置"
                         prop="installationLocation"></el-table-column>
        <el-table-column label="收藏时间"
                         width="160px"
                         prop="favoriteTime"></el-table-column>
        <el-table-column label="状态"
                         width="70px">
          <template slot-scope="scope">
            <el-tag size="mini"
                    v-if="scope.row.status===0"
                    type="danger">异常</el-tag>
            <el-tag size="mini"
                    v-else-if="scope.row.status===1"
                    type="success">正常</el-tag>
            <el-tag size="mini"
                    v-else-if="scope.row.status===2"
                    type="warning">维修中</el-tag>
            <el-tag size="mini"
                    v-else-if="scope.row.status===99"
                    type="info">废除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120px">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        content="预约"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         icon="el-icon-date"
                         size="mini"
                         @click="showCalendarDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="取消收藏"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-star-on"
                         size="mini"
                         @click="cancelFavorite(scope.row.machineId)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <MyCalendar v-if='calendarShow === true'
                :machineId='addForm.machineId'
                :machineName='addForm.machineName'
                @calendarChanged='addCalendarChanged'></MyCalendar>

  </div>
</template>

<script>
import MyCalendar from '@/utils/MyCalendar'
export default {
  components: {
    MyCalendar
  },
  data () {
    return {
      calendarShow: false,
      // 获取收藏列表的参数对象
      queryInfo: {
        // 仪器名称
        machineName: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      favoriteList: [],
      total: 0,
      // 添加预约的请求数据
      addForm: {}
    }
  },
  mounted () {
    this.getFavoriteList()
  },
  methods: {
    // 获取收藏列表
    async getFavoriteList () {
      const { data: res } = await this.$http.get('favorite/list', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取收藏列表失败！')
      }
      this.favoriteList = res.data.list
      this.total = res.data.total
      console.log(res)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getFavoriteList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFavoriteList()
    },
    // 显示预约组件
    showCalendarDialog (row) {
      this.addForm.machineId = row.machineId
      this.addForm.machineName = row.machineName
      this.calendarShow = true
    },
    // 预约组件关闭时，发起预约请求
    async addCalendarChanged (data) {
      this.calendarShow = false
      if (data.action === 'confirm') {
        this.addForm.reservationStartTime = data.reservationStartTime
        this.addForm.reservationEndTime = data.reservationEndTime
        // this.addForm.beginTime = data.beginTime
        // this.addForm.endTime = data.endTime
        // this.addForm.timeGap = data.timeGap
        const { data: res } = await this.$http.post('reservation/manual', this.addForm)
        console.log(res)
        if (res.code === 20003) {
          return this.$message.error('用户位于系统黑名单，预约失败!')
        } else if (res.code !== 200) {
          return this.$message.error('预约失败！')
        }
        this.$message.success('预约成功')
      }
    },
    // 取消收藏
    async cancelFavorite (machineId) {
      const confirmResult = await this.$confirm(
        '是否取消收藏?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('操作取消')
      }
      const { data: res } = await this.$http.delete('favorite/' + machineId)
      if (res.code !== 200) {
        return this.$message.error('取消收藏失败！')
      }
      this.$message.success('已取消收藏！')
      this.getFavoriteList()
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
</style>
