<template>
  <div class='yycalendar_super_view'
       v-if="show">
    <div class='yycalendar_bg_view'></div>
    <div class='yycalendar_content_view'>
      <div class='yycalendar_top1_view'>
        <span class='yycalendar_top_title_text'>{{machineName}}</span>
        <el-button class="yycalendar_top_del_img"
                   @click='delClick'>
          <i class="el-icon-close"></i>
        </el-button>
      </div>

      <div class='yycalendar_top2_view'>
        <el-button :class="timeRangeInfo.newtimeStamp <= timeRangeInfo.timeStamp ? 'yycalendar_changebtn_view' : 'yycalendar_changebtn_view_s'"
                   @click="_lastDay">前一天</el-button>
        <!-- 这里应该用日期选择器el-date-picker提高便捷度 -->
        <div class='yycalendar_top2_center_view'>
          <div mode="date"
               @change="toAnyDay"
               :start="beginDate"
               :end="endDate">
            <div class='yycalendar_top2_center_title'>{{timeRangeInfo.year}}.{{timeRangeInfo.month}}.{{timeRangeInfo.day}}</div>
            <div class='yycalendar_top2_center_subtitle'>{{timeRangeInfo.week}}</div>
          </div>
        </div>
        <el-button :class=" days === dateGap ? 'yycalendar_changebtn_view' : 'yycalendar_changebtn_view_s'"
                   @click='_nextDay'>后一天</el-button>
      </div>
      <div class='yycalendar_time_view'>

        <div class='scroll_super_view'>
          <div v-for='(item, index) in timeRangeInfo.list'
               :key='index'>
            <div :class="isForbiddened[index] || item.isDisabled? 'time_item_view_disabled' : (isSelect[index] ? 'time_item_view_checked' : 'time_item_view')"
                 :style="(index + 1) % 5 == 0 ? 'margin-right: 0rpx;' : 'margin-right: 23rpx;'"
                 @click.stop="_checkedClick(item, index)"
                 :data-idx='index'>{{item.timeStr}}</div>
          </div>
        </div>

      </div>
      <div class="yycalendar_bottombtn_view">
        <el-button class='yycalendar_bottombtn_cancel_view'
                   @click='delClick'>取消</el-button>
        <el-button class='yycalendar_bottombtn_yes_view'
                   type="primary"
                   @click='_bottomYesBtnClick'>确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['machineId', 'machineName'],
  data () {
    return {
      beginTime: '08:00',
      endTime: '23:00',
      timeGap: 30,
      show: true,
      timeRangeInfo: [],
      days: 0,
      isSelect: [], // 时间段是否被选中
      isForbiddened: [], // 这里代码有冗余，需要把timeRangeInfo中的list中的isDisabled属性删除
      beginDate: '', // picker的起始日期，从今日开始
      endDate: '', // picker的终止日期
      dateGap: 30, // 默认最高约到30天
      isDisabledIndexList: {}
    }
  },
  methods: {
    // 屏蔽已经被选择过的时间点
    async querySituation () {
      let newDate = new Date()
      newDate.setDate(new Date().getDate() + this.days)
      const { data: res } = await this.$http.get('reservation/querySituation', {
        params:
        {
          machineId: this.machineId,
          beginTime: this.dateToString(newDate, false) + ' ' + this.beginTime + ':00',
          endTime: this.dateToString(newDate, false) + ' ' + this.endTime + ':00',
          timeGap: this.timeGap
        }
      })
      // console.log(res)
      this.isForbiddened = []
      for (let i = 0; i < res.data.length; i++) {
        this.isForbiddened[res.data[i]] = true
        this.$forceUpdate()
        // this.timeRangeInfo.list[i].isDisabled = true
      }
    },
    getTimeRange (beginTime, endTime, timeGap, days) {
      let showDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let date = new Date()
      let newDate = new Date()
      if (days === undefined || days === '') {
        newDate = date
        // 设置picker的时间范围
        let temp = new Date()
        this.beginDate = this.dateToString(temp, false)
        temp.setDate(temp.getDate() + this.dateGap)
        this.endDate = this.dateToString(temp, false)
      } else {
        newDate.setDate(date.getDate() + days)
      }
      const year = newDate.getFullYear()
      const month = this.formatNumber(newDate.getMonth() + 1)
      const day = this.formatNumber(newDate.getDate())
      const week = showDay[newDate.getDay()]

      let date1 = new Date(year + '/' + month + '/' + day + ' ' + beginTime)
      let date2 = new Date(year + '/' + month + '/' + day + ' ' + endTime)

      let s = date.getTime(); let news = newDate.getTime(); let s1 = date1.getTime(); let s2 = date2.getTime()
      let total = (s2 - s1) / 1000
      let min = parseInt(total / 60)// 计算整数分
      // let timeGap = timeGap
      let amount = min / timeGap
      let timeRange = []
      let timeStr = this.formatNumber(date1.getHours()) + ':' + this.formatNumber(date1.getMinutes())
      let timeInfo = {}
      let isDisabled = false
      if (s1 < s) {
        isDisabled = true
      }
      timeInfo['timeStamp'] = s1
      timeInfo['timeStr'] = timeStr
      timeInfo['isDisabled'] = isDisabled
      timeRange.push(timeInfo)

      // console.log(222)
      // console.log(this.isDisabledIndexList)

      for (let i = 0; i < amount; i++) {
        let timeInfo = {}

        date1.setMinutes(date1.getMinutes() + timeGap, date1.getSeconds(), 0)
        let timeStamp = date1.getTime()
        if (timeStamp > s2) {
          date1 = date2
          timeStamp = s2
        }
        let isDisabled = false
        if (timeStamp < s) {
          isDisabled = true
        }

        let timeStr = this.formatNumber(date1.getHours()) + ':' + this.formatNumber(date1.getMinutes())
        timeInfo['timeStamp'] = timeStamp
        timeInfo['timeStr'] = timeStr
        timeInfo['isDisabled'] = isDisabled
        timeRange.push(timeInfo)
      }
      let obj = {}
      obj['year'] = year
      obj['month'] = month
      obj['day'] = day
      obj['week'] = week
      obj['list'] = timeRange
      obj['timeStamp'] = s
      obj['newtimeStamp'] = news
      return obj
    },
    formatNumber (n) {
      return n < 10 ? '0' + n : n
    },
    // 将date转成yyyy-MM-dd
    // detail = true时，转为 yyyy-MM-dd hh:mm:ss
    dateToString (date, detail) {
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString()
      let day = (date.getDate()).toString()
      if (month.length === 1) {
        month = '0' + month
      }
      if (day.length === 1) {
        day = '0' + day
      }
      let dateTime = year + '-' + month + '-' + day
      if (detail) {
        let hour = date.getHours().toString()
        if (hour.length === 1) {
          hour = '0' + hour
        }
        let minute = date.getMinutes().toString()
        if (minute.length === 1) {
          minute = '0' + minute
        }
        let second = date.getSeconds().toString()
        if (second.length === 1) {
          second = '0' + second
        }
        dateTime = dateTime + ' ' + hour + ':' + minute + ':' + second
      }
      return dateTime
    },
    // 暂时没用到这个函数
    toAnyDay (e) {
      this.isSelect = []
      let newDateStr = e.mp.detail.value
      let newDate = new Date(newDateStr.replace(/-/g, '/'))
      let today = new Date(new Date(new Date().toLocaleDateString()).getTime())
      this.days = parseInt((newDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      this.timeRangeInfo = this.getTimeRange(this.beginTime, this.endTime, this.timeGap, this.days)
    },
    _nextDay () {
      this.isSelect = []
      if (this.days < this.dateGap) {
        this.days = this.days + 1
        this.timeRangeInfo = this.getTimeRange(this.beginTime, this.endTime, this.timeGap, this.days)
        this.querySituation()
      }
    },
    _lastDay () {
      this.isSelect = []
      if (this.timeRangeInfo.newtimeStamp > this.timeRangeInfo.timeStamp) {
        this.days = this.days - 1
        this.timeRangeInfo = this.getTimeRange(this.beginTime, this.endTime, this.timeGap, this.days)
        this.querySituation()
      }
    },
    // item: checked(不一定有的字段) isDisabled, timeStamp:1577160000000(单位是ms), timeStr: "12:00"
    _checkedClick (item, index) {
      if (item.isDisabled || this.isForbiddened[index]) {
        return
      }
      this.isSelect[index] = !this.isSelect[index]
      this.$forceUpdate()
      let timeRangeInfo = this.timeRangeInfo
      let list = timeRangeInfo.list
      // eslint-disable-next-line no-unused-vars
      let timeStr = list[index].timeStr
      for (let i = 0; i < list.length; i++) {
        let info = list[i]
        if (i === index) {
          info.checked = this.isSelect[index]
        } else {
          if (!info.checked) {
            info.checked = false
          }
        }
      }
      this.timeRangeInfo = timeRangeInfo
    },
    // 按下了确认键
    _bottomYesBtnClick () {
      let timeRangeInfo = this.timeRangeInfo
      let list = timeRangeInfo.list
      // console.log(list)
      // eslint-disable-next-line no-unused-vars
      let timeStr = ''
      for (let i = 0; i < list.length; i++) {
        let info = list[i]
        if (info.checked) {
          timeStr = info.timeStr
          break
        }
      }
      let selectTimeStamp = [] // 选择的时间戳，这里的逻辑过于简单需要完善，要求用户选一段连续时间
      for (let i = 0; i < list.length; i++) {
        let info = list[i]
        if (info.checked) {
          selectTimeStamp.push(info.timeStamp)
        }
      }
      let listLength = selectTimeStamp.length

      if (listLength > 0) {
        let reBiginTime = new Date(selectTimeStamp[0]) // 预约起始时间
        let reEndTime = new Date(selectTimeStamp[listLength - 1] + this.timeGap * 60 * 1000)
        let myEventDetail = {
          action: 'confirm',
          reservationStartTime: this.dateToString(reBiginTime, true),
          reservationEndTime: this.dateToString(reEndTime, true),
          beginTime: this.dateToString(reBiginTime, false) + ' ' + this.beginTime + ':00',
          endTime: this.dateToString(reBiginTime, false) + ' ' + this.endTime + ':00',
          timeGap: this.timeGap
        } // detail对象，提供给事件监听函数
        // console.log(myEventDetail)
        this.$emit('calendarChanged', myEventDetail)
        this.show = false
      } else {
        this.$message.error('请选择预约时间')
      }
    },
    delClick () {
      let myEventDetail = { action: 'cancel' }
      this.$emit('calendarChanged', myEventDetail)
      this.show = false
    }
  },
  mounted () {
    this.querySituation()
    this.timeRangeInfo = this.getTimeRange(this.beginTime, this.endTime, this.timeGap)
  }
}
</script>

<style scoped>
.yycalendar_super_view {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.yycalendar_bg_view {
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
/* 关键 */
.yycalendar_content_view {
  position: fixed;
  bottom: 25%;
  left: 35%;
  background: white;
  width: 458px;
  display: flex;
  flex-direction: column;
}
.yycalendar_top1_view {
  width: 100%;
  height: 50px;
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
}
/*  */
.yycalendar_top_title_text {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #25272a;
  text-align: center;
  position: absolute;
  left: 20px;
}
.yycalendar_top_del_img {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 16px;
}
.yycalendar_top2_view {
  width: 100%;
  height: 64px;
  background: white;
  padding: 0px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.yycalendar_changebtn_view {
  background: #e7e7e7;
  border-radius: 50px;
  width: 74px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.6;
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  color: #2c2b28;
  text-align: center;
}
.yycalendar_changebtn_view_s {
  background: #409eff;
  border-radius: 50px;
  width: 74px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  color: white;
  text-align: center;
}
.yycalendar_top2_center_view {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.yycalendar_top2_center_title {
  font-family: Helvetica-Bold;
  font-size: 18px;
  color: #2c2b28;
  text-align: center;
}
.yycalendar_top2_center_subtitle {
  font-family: PingFangSC-Regular;
  font-size: 11px;
  color: #9b9b9b;
  text-align: center;
}
.yycalendar_bottombtn_view {
  display: flex;
  justify-content: flex-end;
  background: #f0f2f5;
  padding: 20px 20px;
}
.yycalendar_time_view {
  width: 100%;
  height: 295px;
  background: #f0f2f5;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.scroll_super_view {
  width: 100%;
  padding: 15px 10px 55px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.time_item_view {
  background: #ffffff;
  border-radius: 2px;
  width: 62px;
  height: 34px;
  margin-right: 11px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica-Bold;
  font-size: 12px;
  color: #2c2b28;
  text-align: center;
}
.time_item_view_checked {
  background: #409eff;
  border-radius: 2px;
  width: 62px;
  height: 32px; /*小一点，有点动态效果 */
  margin-right: 11px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica-Bold;
  font-size: 12px;
  color: white;
  text-align: center;
}
.time_item_view_disabled {
  background: #e7e7e7;
  border-radius: 2px;
  width: 62px;
  height: 34px;
  margin-right: 11px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.4;
  font-family: Helvetica-Bold;
  font-size: 12px;
  color: #2c2b28;
  text-align: center;
}
</style>
