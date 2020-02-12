<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仪器详情</el-breadcrumb-item>
      <el-breadcrumb-item>{{insDetailsInfo.machineName}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20"
              class="top_tab">
        <el-col :span="10"
                class="machine_pic">
          <img :src="insDetailsInfo.machinePicture">
        </el-col>
        <el-col :span="14"
                class="machine_right">
          <div class="machine_title">{{insDetailsInfo.machineName}}</div>
          <div class="top_viewer">
            <span>
              <i class="el-icon-view"></i>
              {{insDetailsInfo.viewCount}}人浏览
            </span>
            <span style="margin-left: 10px;">
              <i class="el-icon-star-off"></i>
              {{favoriteNum}}人收藏
            </span>
          </div>
          <div class="machine_intro">
            <el-row :gutter="20">
              <el-col :span="12">
                <div> <span class="blue_title">仪器分类：</span> {{insDetailsInfo.machineClassificationPo.machineClassification}}</div>
              </el-col>
              <el-col :span="12">
                <div><span class="blue_title">运行状态：</span>
                  <el-tag size="mini"
                          v-if="insDetailsInfo.status===0"
                          type="danger">异常</el-tag>
                  <el-tag size="mini"
                          v-else-if="insDetailsInfo.status===1"
                          type="success">正常</el-tag>
                  <el-tag size="mini"
                          v-else-if="insDetailsInfo.status===2"
                          type="warning">维修中</el-tag>
                  <el-tag size="mini"
                          v-else-if="insDetailsInfo.status===99"
                          type="info">废除</el-tag>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <div><span class="blue_title">所属单位：</span> {{insDetailsInfo.unit}}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div><span class="blue_title">品牌：</span> {{insDetailsInfo.machineBrand}}</div>
              </el-col>
              <el-col :span="12">
                <div><span class="blue_title">购置时间：</span> {{insDetailsInfo.acquisitionTime}}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div><span class="blue_title">收费标准：</span> {{insDetailsInfo.charges}}</div>
              </el-col>
              <el-col :span="12">
                <div><span class="blue_title">仪器负责人：</span> {{insDetailsInfo.machineContactPo.name}}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <div><span class="blue_title">所在地点：</span> {{insDetailsInfo.installationLocation}}</div>
              </el-col>
            </el-row>
          </div>
          <div class="bottombtn">
            <el-button type="primary"
                       icon="el-icon-date"
                       @click="calendarShow = true">预约</el-button>
            <el-tooltip effect="dark"
                        content="取消收藏"
                        placement="top"
                        :enterable="false"
                        v-if="insDetailsInfo.isFavorite === 1">
              <el-button type="warning"
                         icon="el-icon-star-on"
                         @click="cancelFavorite">已收藏</el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="添加收藏"
                        placement="top"
                        :enterable="false"
                        v-else>
              <el-button type="warning"
                         icon="el-icon-star-off"
                         @click="addFavorite">收藏</el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>

      <el-tabs :tab-position="'top'">
        <el-tab-pane label="基本信息"
                     name="0">
          <el-row :gutter="20">
            <el-col :span="12">
              <div> <span class="blue_title">品牌：</span> {{insDetailsInfo.machineBrand}}</div>
            </el-col>
            <el-col :span="12">
              <div><span class="blue_title">产地：</span> {{insDetailsInfo.machineOrigin}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div><span class="blue_title">分类：</span> {{insDetailsInfo.machineClassificationPo.machineClassification}}</div>
            </el-col>
            <el-col :span="12">
              <div><span class="blue_title">购置时间：</span> {{insDetailsInfo.acquisitionTime}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div><span class="blue_title">所属单位：</span> {{insDetailsInfo.unit}}</div>
            </el-col>
            <el-col :span="12">
              <div><span class="blue_title">所在地点：</span> {{insDetailsInfo.installationLocation}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div><span class="blue_title">用途：</span> {{insDetailsInfo.application}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div><span class="blue_title">主要指标：</span> {{insDetailsInfo.mainIndicators}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div><span class="blue_title">备注：</span>{{insDetailsInfo.remarks}}</div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="预约相关"
                     name="1">
          <el-row :gutter="20">
            <el-col :span="24">
              <div><span class="blue_title">最长预约时长：</span>{{insDetailsInfo.maximumAppointmentTime}}min</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div><span class="blue_title">收费标准：</span>{{insDetailsInfo.charges}}</div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="仪器负责人"
                     name="2">
          <el-row :gutter="20">
            <el-col :span="12">
              <div><span class="blue_title">负责人姓名：</span>{{insDetailsInfo.machineContactPo.name}}</div>
            </el-col>
            <el-col :span="12">
              <div><span class="blue_title">单位：</span>{{insDetailsInfo.machineContactPo.unit}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div><span class="blue_title">邮箱：</span>{{insDetailsInfo.machineContactPo.mail}}</div>
            </el-col>
            <el-col :span="12">
              <div><span class="blue_title">电话：</span>{{insDetailsInfo.machineContactPo.phone}}</div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop> -->
    <MyCalendar v-if='calendarShow === true'
                :machineId='insDetailsInfo.machineId'
                :machineName='insDetailsInfo.machineName'
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
      favoriteNum: 0,
      machineId: null,
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
      insDetailsInfo: {
        machineContactPo: {
          name: '',
          unit: '',
          phone: '',
          mail: ''
        },
        machineClassificationPo: {
          machineClassification: ''
        }
      },
      total: 0,
      // 添加预约的请求数据
      addForm: {}
    }
  },
  created () {
    this.machineId = this.$route.query.id
    this.getInsDetails()
    this.getFavoriteNum()
  },
  methods: {
    // 获取仪器详情
    async getInsDetails () {
      const { data: res } = await this.$http.get(`machine/details/user/${this.machineId}`)
      if (res.code !== 200) {
        return this.$message.error('获取仪器详情失败！')
      }
      this.insDetailsInfo = res.data
      console.log(res)
    },
    // 获取被收藏数量
    async getFavoriteNum () {
      const { data: res } = await this.$http.get(`favorite/num/${this.machineId}`)
      if (res.code !== 200) {
        return this.$message.error('获取被收藏数量失败！')
      }
      this.favoriteNum = res.data
      console.log(res)
    },
    // 取消收藏
    async cancelFavorite () {
      const { data: res } = await this.$http.delete('favorite/' + this.insDetailsInfo.machineId)
      if (res.code !== 200) {
        return this.$message.error('取消收藏失败！')
      }
      this.$message.success('已取消收藏！')
      this.insDetailsInfo.isFavorite = 0
      if (this.favoriteNum > 0) {
        this.favoriteNum -= 1
      }
    },
    // 添加收藏
    async addFavorite () {
      const { data: res } = await this.$http.post('favorite/' + this.insDetailsInfo.machineId)
      if (res.code !== 200) {
        return this.$message.error('添加收藏失败！')
      }
      this.$message.success('已添加收藏！')
      this.insDetailsInfo.isFavorite = 1
      this.favoriteNum += 1
    },
    // 预约组件关闭时，发起预约请求
    async addCalendarChanged (data) {
      this.calendarShow = false
      if (data.action === 'confirm') {
        this.addForm.machineId = this.machineId
        this.addForm.reservationStartTime = data.reservationStartTime
        this.addForm.reservationEndTime = data.reservationEndTime
        this.addForm.beginTime = data.beginTime
        this.addForm.endTime = data.endTime
        this.addForm.timeGap = data.timeGap
        const { data: res } = await this.$http.post('reservation/manual', this.addForm)
        console.log(res)
        if (res.code === 20003) {
          return this.$message.error('用户位于系统黑名单，预约失败!')
        } else if (res.code !== 200) {
          return this.$message.error('预约失败！')
        }
        this.$message.success('预约成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.top_viewer {
  color: #666666;
  font-size: 13px;
  padding: 0 15px 0 0;
  margin-top: 5px;
}
.machine_intro {
  margin-top: 15px;
  font-size: 14px;
  height: 35px;
  line-height: 35px;
}
.machine_title {
  color: #0f7ed0;
  font-size: 22px;
  padding-bottom: 5px;
  font-weight: bolder;
  line-height: 38px;
  height: 38px;
}
.machine_pic {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px;
  width: 415px;
  height: 304px;
  border: 1px solid #d7d9e0;
  img {
    width: 415px;
    height: 304px;
    // max-width: 100%;
    // max-height: 100%;
    object-fit: cover;
  }
}
.blue_title {
  color: rgb(45, 149, 225);
}
.el-tabs {
  margin: 10px 50px;
}
.el-tab-pane {
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  // display: inline-block;
}
.machine_right {
  margin: 0px 20px;
  max-width: 100%;
  width: 800px;
}
.bottombtn {
  display: flex;
  justify-content: flex-end;
  padding: 20px 20px;
}
</style>
