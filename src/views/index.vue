<template>
  <div id="largescreen" :style="_isMobile() ? {} : largescreenPcStyle">
    <el-row :gutter="10">
      <el-col :lg="24" :md="24" :sm="24" :xs="24">
        <top-header/>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="padding: 10px;height: calc(100% - 60px);">
      <el-col :lg="6" :md="6" :sm="24" :xs="24">
        <body-left-top :day-sta-count="dayStaCount"/>
        <body-left-center :today-pv-number="todayPvNumber"/>
        <body-left-bottom :area-name="areaName" :da-tj-information="daTjInformation"/>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24">
        <div class="date-range">
          <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              size="mini"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="onDateRangeChange"
          >
          </el-date-picker>
        </div>
        <div class="map-item-amounts">
          测试 {{ amounts }} 件
        </div>
        <china
            :area-code.sync="areaCode"
            :area-level.sync="areaLevel"
            :area-name.sync="areaName"
            :map-name-list.sync="mapNameList"
            :map-code-list.sync="mapCodeList"
            :area-statistic="areaStatistic"
        />
        <body-center-bottom
            :area-name="areaName"
            :complaint-overview="complaintOverview"
            :pageview="pageview"
            :total-publish="totalPublish"
            :total-items="totalItems"
            :third-platform="thirdPlatform"
        />
      </el-col>
      <el-col :lg="6" :md="6" :sm="24" :xs="24">
        <el-carousel trigger="click" :interval="6666">
          <el-carousel-item>
            <body-right-top :area-name="areaName" :map-name-list="mapNameList"/>
          </el-carousel-item>
          <el-carousel-item>
            <body-right-top1 :area-name="areaName" :map-name-list="mapNameList"/>
          </el-carousel-item>
        </el-carousel>
        <body-right-center :satisfied="satisfied"/>
        <body-right-bottom :timed-complain="timedComplain"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import China from "./components/china";
import TopHeader from "./components/topHeader";
import BodyLeftTop from "./components/bodyLeftTop";
import BodyLeftCenter from "./components/bodyLeftCenter";
import BodyLeftBottom from "./components/bodyLeftBottom";
import BodyRightTop from "./components/bodyRightTop";
import BodyRightTop1 from "./components/bodyRightTop1";
import BodyRightCenter from "./components/bodyRightCenter";
import BodyRightBottom from "./components/bodyRightBottom";
import BodyCenterBottom from "./components/bodyCenterBottom";


export default {
  name: "index",
  components: {
    BodyCenterBottom,
    TopHeader,
    China,
    BodyLeftTop,
    BodyRightCenter,
    BodyLeftCenter,
    BodyLeftBottom,
    BodyRightTop,
    BodyRightTop1,
    BodyRightBottom,
  },
  data() {
    return {
      areaCode: '000000000000', // 当前用的areaCode
      areaLevel: 0, // 当前用的areaCode
      areaName: 'china', // 当前用的areaName
      mapNameList: [], // 当前地图上的地区名字
      mapCodeList: [], // 当前地图上的地区Code
      largescreenPcStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
      },
      queryParams: {},
      areaStatistic: [], // 测试
      amounts: 0, // 测试
      dayStaCount: [], // 测试
      satisfied: {}, // 测试
      timedComplain: [], // 测试
      todayPvNumber: [], // 测试
      daTjInformation: [], // 测试
      daTjItemsInfo: [], // 测试
      complaintOverview: {}, // 测试
      pageview: {}, // 测试
      totalPublish: 0, // 测试
      totalItems: 0, // 测试
      thirdPlatform: 0, // 测试
      dateRange: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.setAreaName()
    this.setDateRange()
  },
  mounted() {
    this.getData()
  },
  watch: {
    areaCode: {
      handler(val) {
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    // 设置areaName
    setAreaName() {
      if (this.areaName === '中央本级') {
        this.areaName = 'china'
      }
    },
    // 设置默认时间段， 一周
    setDateRange() {
      this.dateRange[0] = this._parseTime(new Date().getTime() - 60 * 60 * 24 * 7 * 1000, '{y}-{m}-{d}')
      this.dateRange[1] = this._parseTime(new Date().getTime() - 60 * 60 * 24 * 1000, '{y}-{m}-{d}')
    },
    // 时间change
    onDateRangeChange(val) {
      this.getData()
    },
    getData() {
      this.requestGetSumComplaint() // 测试
      this.requestGetSumPvNumber() // 测试
      this.requestGetComplainStatistic() // 测试
      this.requestGetSatisfied() // 测试
      this.requestGetTimedComplain() // 测试
      this.requestGetDaTjInformation() // 测试
      this.requestGetComplaintOverview() // 测试
      this.requestGetPageview() // 测试
      this.requestGetTotalPublish() // 测试
      this.requestGetTotalItems() // 测试
      this.requestGetThirdPlatform() // 测试
    },
    // 设置请求参数
    setParam() {
      var obj = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel,
      }
      if (this.dateRange.length > 0) {
        obj.beginDate = this.dateRange[0]
        obj.endDate = this.dateRange[1]
      }
      return obj
    },
    // 设置请求参数无时间
    setParamDate() {
      var obj = {}
      if (this.dateRange.length > 0) {
        obj.beginDate = this.dateRange[0]
        obj.endDate = this.dateRange[1]
      }
      return obj
    },
    // 设置请求参数无时间
    setParamNoDate() {
      var obj = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel,
      }
      return obj
    },
    // 测试
    requestGetSumComplaint() {
      var param = this.setParam()
      this.amounts = this._mathRandom1000()
    },
    // 测试
    requestGetSumPvNumber() {
      var param = this.setParamDate()
      this.todayPvNumber = []
      for (let i = 0; i < 7; i++) {
        this.todayPvNumber.push({
          "visitDate": "2022-03-03",
          "pv": this._mathRandom1000()
        })
      }
      this.todayPvNumber = this.todayPvNumber.sort(this.compareTime('visitDate'))
    },
    // 时间比较
    compareTime(prop, align) {
      return function (a, b) {
        var val1 = a[prop]
        var val2 = b[prop]
        if (align) {
          return new Date(val2) - new Date(val1)
        }
        return new Date(val1) - new Date(val2)
      }
    },
    // 测试
    requestGetComplainStatistic() {
      var param = this.setParam()
      this.dayStaCount = []
      for (let i = 0; i < 7; i++) {
        this.dayStaCount.push({
          "ybj": this._mathRandom1000(),
          "amounts": this._mathRandom1000(),
          "zbl": this._mathRandom1000(),
          "dsl": this._mathRandom1000(),
          "comdate": "2022-03-04",
          "bysl": this._mathRandom1000()
        })
      }
      this.dayStaCount = this.dayStaCount.sort(this.compareTime('comdate'))
    },
    // 测试
    requestGetSatisfied() {
      var param = this.setParam()
      this.satisfied = {
        "verysatisfied": this._mathRandom1000(),
        "generalSatisfaction": this._mathRandom1000(),
        "amounts": this._mathRandom1000(),
        "veryDissatisfied": this._mathRandom1000(),
        "notVerySatisfied": this._mathRandom1000(),
        "satisfaction": this._mathRandom1000()
      }
    },
    // 测试
    requestGetTimedComplain() {
      this.timedComplain = []
      for (let i = 0; i < 10; i++) {
        this.timedComplain.push({
          "comUser": "匿名用户" + i,
          "comContact": (Math.random() * 100000000000).toFixed(0) * 1,
          "comDate": new Date(),
        })
      }
    },
    // 测试
    requestGetDaTjInformation() {
      var param = this.setParam()
      this.daTjInformation = []
      for (let i = 1; i < 6; i++) {
        this.daTjInformation.push({
          "pub_sub_type": i,
          "publishView": this._mathRandom1000()
        })
      }
    },
    // 测试
    requestGetComplaintOverview() {
      var param = this.setParamNoDate()
      this.complaintOverview = {
        "ypjamount": this._mathRandom1000(),
        "ypjmy": this._mathRandom1000(),
        "amounts": this._mathRandom1000(),
        "ybjlastweek": this._mathRandom1000(),
        "ybjtoday": this._mathRandom1000(),
        "ybjamounts": this._mathRandom1000(),
        "ybjyesterday": this._mathRandom1000()
      }
    },
    // 测试
    requestGetPageview() {
      var param = this.setParamNoDate()
      this.pageview = {
        "total": this._mathRandom1000(),
        "lastweekpv": this._mathRandom1000(),
        "beforeyesterdaypv": this._mathRandom1000(),
        "yesterdaypv": this._mathRandom1000()
      }
    },
    // 测试
    requestGetTotalPublish() {
      var param = this.setParamNoDate()
      this.totalPublish = this._mathRandom1000()
    },
    // 测试
    requestGetTotalItems() {
      var param = this.setParamNoDate()
      this.totalItems = this._mathRandom1000()
    },
    // 测试
    requestGetThirdPlatform() {
      this.thirdPlatform = this._mathRandom1000()
    },
  }
}
</script>

<style scoped lang="scss">
::v-deep#largescreen {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  padding: 0;
  background-image: url("../assets/images/largescreen/home-bg.png");

  .el-col {
    height: 100%;
    position: relative;

    .date-range {
      position: absolute;
      right: 5px;
      z-index: 9;

      .el-date-editor {
        background: transparent;
        border-color: rgb(0, 186, 255);
        width: 250px;

        .el-icon-date {
          color: #fff;
        }

        .el-range-separator {
          color: #fff;
        }

        .el-range__close-icon {
          color: #fff;
        }

        .el-range-input {
          background: transparent;
          color: #fff;
        }
      }
    }

    .map-item-amounts {
      position: absolute;
      z-index: 9;
      left: 10px;
      top: 30px;
      color: #fff;
      font-size: 16px;
      color: #24CFF4;
    }
  }

  .el-carousel {
    height: calc(33.3%);
    //margin-bottom: 10px;
    .el-carousel__container {
      height: 100%;
    }

    .el-carousel__indicator--horizontal {
      padding: 3px;
    }
  }
}
</style>
