<template>
  <div id="chart-board-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>{{areaName === 'china' ? '全国' : areaName}}</span>
    </div>
    <el-row :gutter="10" id="chart-board">
      <el-col :lg="9" :md="9" :sm="24" :xs="24">
        <div style="height: 100%;">
          <div class="amounts-box">
            <div class="amounts-box-card">
              <div>
                <span>测试</span>
                <span class="amounts-num">{{_formatNumber(complaintOverviewData.amounts)}}</span>
                <span class="amounts-unit">个</span>
              </div>
              <div class="amounts-day-box">
                <span class="amounts-day">日环比</span>
                <span class="amounts-day-icon">

                </span>
                <span class="amounts-day-num">{{Math.abs(complaintRihuanbi)}}%</span>
                <span class="amounts-week"> 周同比</span>
                <span class="amounts-week-icon">

                </span>
                <span class="amounts-week-icon">{{Math.abs(complaintZhoutongbi)}}%</span>
              </div>
            </div>
          </div>
          <div class="amounts-box">
            <div class="amounts-box-card">
              <div>
                <span class="amounts-title">测试</span>
                <span class="amounts-num">{{_formatNumber(pageviewData.total)}}</span>
                <span class="amounts-unit">次</span>
              </div>
              <div class="amounts-day-box">
                <span class="amounts-day">日环比</span>
                <span class="amounts-day-icon">

                </span>
                <span class="amounts-day-num">{{Math.abs(pageviewRihuanbi)}}%</span>
                <span class="amounts-week"> 周同比</span>
                <span class="amounts-week-icon">

                </span>
                <span class="amounts-week-icon">{{Math.abs(pageviewZhoutongbi)}}%</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="9" :md="9" :sm="24" :xs="24">
        <div class="amounts-total-box">
          <div class="amounts-total-bgline"></div>
          <div class="amounts-total-card">
            <div class="amounts-total">
              <div>
                <img class="amounts-total-icon" :src="require('@/assets/images/largescreen/amounts1.png')" alt="">
                <span class="amounts-total-title">测试</span>
              </div>
              <div>
                <span class="amounts-total-num">{{_formatNumber(complaintOverviewData.ybjamounts)}}</span>
              </div>
            </div>
            <div class="amounts-total">
              <div>
                <img class="amounts-total-icon" :src="require('@/assets/images/largescreen/amounts2.png')" alt="">
                <span class="amounts-total-title">测试</span>
              </div>
              <div>
                <span class="amounts-total-num">{{_formatNumber(totalPublish)}}</span>
              </div>
            </div>
            <div class="amounts-total">
              <div>
                <img class="amounts-total-icon" :src="require('@/assets/images/largescreen/amounts3.png')" alt="">
                <span class="amounts-total-title">测试</span>
              </div>
              <div>
                <span class="amounts-total-num">{{_formatNumber(totalItems)}}</span>
              </div>
            </div>
            <div class="amounts-total">
              <div>
                <img class="amounts-total-icon" :src="require('@/assets/images/largescreen/amounts4.png')" alt="">
                <span class="amounts-total-title">测试</span>
              </div>
              <div>
                <span class="amounts-total-num">{{_formatNumber(thirdPlatform)}}</span>
              </div>
            </div>
          </div>
          <div class="amounts-total-bgline"></div>
        </div>


      </el-col>
      <el-col :lg="6" :md="6" :sm="24" :xs="24">
        <div style="height: 50%;">
          <div id="banjielv-pie" style="height: 100%"></div>
        </div>
        <div style="height: 50%;">
          <div id="manyilv-pie" style="height: 100%"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import resize from '@/utils/resize'
import echarts from "echarts";

export default {
  mixins: [resize],
  name: "bodyCenterBottom",
  props: {
    areaName: {
      type: String,
      default() {
        return ''
      }
    },
    // 测试
    complaintOverview: {
      type: Object,
      default() {
        return {}
      }
    },
    // 测试
    pageview: {
      type: Object,
      default() {
        return {}
      }
    },
    // 测试
    totalPublish: {
      type: Number,
      default() {
        return 0
      }
    },
    // 测试
    totalItems: {
      type: Number,
      default() {
        return 0
      }
    },
    // 测试
    thirdPlatform: {
      type: Number,
      default() {
        return 0
      }
    },
  },
  data() {
    return {
      banjielvChart: null,
      manyilvChart: null,
      banjielvAngle: 0,
      manyilvAngle: 0,
      timerId: null,
      complaintOverviewData: {
        amounts: 0, // 总数
        ybjamounts: 0, // 已办结数
        ybjlastweek: 0, // 上周已办结数
        ybjtoday: 0, // 今天已办结
        ybjyesterday: 0, // 昨天已办结
        ypjamount: 0, // 已评价数
        ypjmy: 0, // 已评价满意数
      },
      banjielv: 0, // 办结率
      manyilv: 0, // 满意率
      complaintRihuanbi: 0, // 日环比
      complaintZhoutongbi: 0, // 周同比
      pageviewData: {
        lastweekpv: 0, // 上周访问数
        total: 0, // 总访问数
        yesterdaypv: 0, // 昨天访问数
        beforeyesterdaypv: 0, // 前天访问数
      },
      pageviewRihuanbi: 0, // 日环比
      pageviewZhoutongbi: 0, // 周同比
      totalPublishData: 0, // 信息公开发布量
      totalItemsData: 0, // 事项清单量
    }
  },
  created() {
  },
  beforeDestroy() {
    if (!this.banjielvChart) {
      return
    }
    this.banjielvChart.dispose()
    this.banjielvChart = null

    if (!this.manyilvChart) {
      return
    }
    this.manyilvChart.dispose()
    this.manyilvChart = null
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.initTimerId()
    })
  },

  watch: {
    /**
      与历史同时期比较，例如2005年7月份与2004年7月份相比，叫同比。
      与上一统计段比较，例如2005年7月份与2005年6月份相比较，叫环比。
      同比增长率＝（本期数－同期数）/同期数*100％ 指和去年同期相比较的增长率。
      环比增长率＝（本期数－上期数）/上期数*100％ 反映本期比上期增长了多少
      同比发展速度，一般指是指本期发展水平与上年同期发展水平对比，而达到的相对发展速度。
      环比发展速度，一般指是指报告期水平与前一时期水平之比，表明现象逐期的发展速度。
      同比增长是指与上一个期间的比较，比如今年的1月和去年的1月增长多少，本月1日与上月1日增长多少，等等
      环比则是本期与上期比较，如：2月比1月增长多少，2日比1日增长多少等等
     */
    complaintOverview: {
      handler(val) {
        // console.log('complaintOverview----->', val)
        this.complaintOverviewData = val
        // 办结率
        if(val.amounts && val.amounts !== 0) {
          this.banjielv = ((val.ybjamounts / val.amounts) * 100).toFixed(0) * 1
        }
        // 满意率
        if(val.ypjamount && val.ypjamount !== 0) {
          this.manyilv = ((val.ypjmy / val.ypjamount) * 100).toFixed(0) * 1
        }
        // 日环比
        if(val.ybjyesterday && val.ybjyesterday !== 0) {
          this.complaintRihuanbi = (((val.ybjtoday - val.ybjyesterday) / val.ybjyesterday) * 100).toFixed(0) * 1
        }
        // 周同比
        if(val.ybjlastweek && val.ybjlastweek !== 0) {
          this.complaintZhoutongbi = (((val.ybjtoday - val.ybjlastweek) / val.ybjlastweek) * 100).toFixed(0) * 1
        }
      },
      deep: true
    },
    pageview: {
      handler(val) {
        // console.log('pageview----->', val)
        this.pageviewData = val
        // 日环比
        if(val.beforeyesterdaypv && val.beforeyesterdaypv !== 0) {
          this.pageviewRihuanbi = (((val.yesterdaypv - val.beforeyesterdaypv) / val.beforeyesterdaypv) * 100).toFixed(0) * 1
        }
        // 周同比
        if(val.lastweekpv && val.lastweekpv !== 0) {
          this.pageviewZhoutongbi = (((val.yesterdaypv - val.lastweekpv) / val.lastweekpv) * 100).toFixed(0) * 1
        }
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      this.banjielvAngle = this.banjielvAngle + 3;
      this.banjielvChart = this.$echarts.init(document.getElementById('banjielv-pie'))
      this.setBanlielvOptions()
      this.manyilvAngle = this.manyilvAngle + 3;
      this.manyilvChart = this.$echarts.init(document.getElementById('manyilv-pie'))
      this.setManyilvOptions()

    },
    initTimerId() {
      setTimeout(() => {
        if (this.timerId) {
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
          //用setInterval做动画感觉有问题
          try {
            this.initChart()
          } catch (e) {
            clearInterval(this.timerId)
          }
        }, 100);
      }, 500);
    },
    setBanlielvOptions() {
      //做环形图的本质是 radius: ['内半径', '外半径'] 内半径!=0
      //画渐变色的原理是：data里面可以设置itemStyle
      let angle = this.banjielvAngle; //角度，用来做简单的动画效果的
      const value = this.banjielv; // 办结率
      const colors = ['#A098FC', '#4386FA', '#4FADFD', '#0CD3DB', '#646CF9'];
      this.banjielvChart.setOption({
        // backgroundColor,
        color: colors,
        title: {
          text: '',
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
          padding: 0,
          top: 0,
          left: 0,
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },

        series: [
          {
            name: '办结率',
            type: 'pie',
            center: ['50%', '50%'], //圆心的位置
            radius: ['44%', '47%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
            avoidLabelOverlap: false, //做同心圆用到
            clockwise: false, //顺时针排列
            startAngle: 90, //起始角度 影响不大
            label: {
              show: true, //false不显示饼图上的标签
              position: 'center', //inside（在饼图上显示）,outside(默认就会出现引导线) center
              // formatter: '{d}%',
              formatter: (params) => {
                if(value !== params.percent) {
                  return ''
                }
                return params.seriesName + '\n' + params.percent + '%'
              },
              color: '#fff',
              fontSize: 12,
              fontWeight: 'bold',
            },

            data: [
              {
                value: value, name: '完成', itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [0, .3, .6, .8, 1].map((offset, index) => ({offset, color: colors[index]})),
                    global: false, // 缺省为 false
                  }, opacity: 1
                }
              },
              {value: 100 - value, name: '未完成', itemStyle: {color: 'transparent'}},
            ].sort((a, b) => b.value - a.value), //数组从大到小排序

            emphasis: {
              scale: false,
            },
          },
          {
            name: '',
            type: 'pie',
            center: ['50%', '50%'], //圆心的位置
            radius: ['55%', '65%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
            avoidLabelOverlap: false, //做同心圆用到
            clockwise: false, //顺时针排列
            startAngle: 90, //起始角度 影响不大
            label: {
              show: false, //false不显示饼图上的标签
            },
            data: [{
              value: value,
              name: '完成',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [0, .3, .6, .8, 1].map((offset, index) => ({offset, color: colors[index]})),
                  global: false, // 缺省为 false
                },
                opacity: 1
              }
            }, {
              value: 100 - value,
              name: '未完成',
              itemStyle: {color: 'transparent'}
            }].sort((a, b) => b.value - a.value), //数组从大到小排序

            emphasis: {
              scale: false,
            },
          },
          //colors[0]line
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
                  startAngle: ((0 + angle) * Math.PI) / 180,
                  endAngle: ((90 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[0],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5', //        //colors[0]dot
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75;
              let point = this.getCirlPoint(x0, y0, r, 90 + angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[0],
                  fill: colors[0],
                },
                silent: true,
              };
            },
            data: [0],
          },
          // 蓝色
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
                  startAngle: ((180 + angle) * Math.PI) / 180,
                  endAngle: ((270 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[1],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5', // 蓝色
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75;
              let point = this.getCirlPoint(x0, y0, r, 180 + angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[1], //绿
                  fill: colors[1],
                },
                silent: true,
              };
            },
            data: [0],
          },

          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85,
                  startAngle: ((270 + -angle) * Math.PI) / 180,
                  endAngle: ((40 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[2],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          // 橘色

          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85,
                  startAngle: ((90 + -angle) * Math.PI) / 180,
                  endAngle: ((220 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[2],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85;
              let point = this.getCirlPoint(x0, y0, r, 90 + -angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[3], //粉
                  fill: colors[3],
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5', //绿点
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85;
              let point = this.getCirlPoint(x0, y0, r, 270 + -angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[3], //绿
                  fill: colors[3],
                },
                silent: true,
              };
            },
            data: [0],
          },
        ],
      }, true)
    },
    setManyilvOptions() {
      //做环形图的本质是 radius: ['内半径', '外半径'] 内半径!=0
      //画渐变色的原理是：data里面可以设置itemStyle
      let angle = this.banjielvAngle; //角度，用来做简单的动画效果的
      const value = this.manyilv; // 满意率
      const colors = ['#A098FC', '#4386FA', '#4FADFD', '#0CD3DB', '#646CF9'];
      this.manyilvChart.setOption({
        // backgroundColor,
        color: colors,
        title: {
          text: '',
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
          padding: 0,
          top: 0,
          left: 0,
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },

        series: [
          {
            name: '满意率',
            type: 'pie',
            center: ['50%', '50%'], //圆心的位置
            radius: ['44%', '47%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
            avoidLabelOverlap: false, //做同心圆用到
            clockwise: false, //顺时针排列
            startAngle: 90, //起始角度 影响不大
            label: {
              show: true, //false不显示饼图上的标签
              position: 'center', //inside（在饼图上显示）,outside(默认就会出现引导线) center
              // formatter: '{d}%',
              formatter: (params) => {
                if(value !== params.percent) {
                  return ''
                }
                return params.seriesName + '\n' + params.percent + '%'
              },
              color: '#fff',
              fontSize: 12,
              fontWeight: 'bold',
              // normal: {
              //   textStyle: {
              //     color: '#fff'
              //   }
              // }
            },
            data: [
              {
                value: value, name: '完成', itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [0, .3, .6, .8, 1].map((offset, index) => ({offset, color: colors[index]})),
                    global: false, // 缺省为 false
                  },
                  opacity: 1
                }
              },
              {value: 100 - value, name: '未完成', itemStyle: {color: 'transparent'}},
            ].sort((a, b) => b.value - a.value), //数组从大到小排序
            emphasis: {
              scale: false,
            },
          },
          {
            name: '',
            type: 'pie',
            center: ['50%', '50%'], //圆心的位置
            radius: ['55%', '65%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
            avoidLabelOverlap: false, //做同心圆用到
            clockwise: false, //顺时针排列
            startAngle: 90, //起始角度 影响不大
            label: {
              show: false, //false不显示饼图上的标签
            },
            data: [
              {
                value: value, name: '完成', itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [0, .3, .6, .8, 1].map((offset, index) => ({offset, color: colors[index]})),
                    global: false, // 缺省为 false
                  }, opacity: 1
                }
              },
              {value: 100 - value, name: '未完成', itemStyle: {color: 'transparent'}},
            ].sort((a, b) => b.value - a.value), //数组从大到小排序

            emphasis: {
              scale: false,
            },
          },
          //colors[0]line
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
                  startAngle: ((0 + angle) * Math.PI) / 180,
                  endAngle: ((90 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[0],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5', //        //colors[0]dot
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75;
              let point = this.getCirlPoint(x0, y0, r, 90 + angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[0],
                  fill: colors[0],
                },
                silent: true,
              };
            },
            data: [0],
          },
          // 蓝色
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75,
                  startAngle: ((180 + angle) * Math.PI) / 180,
                  endAngle: ((270 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[1],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5', // 蓝色
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.75;
              let point = this.getCirlPoint(x0, y0, r, 180 + angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[1], //绿
                  fill: colors[1],
                },
                silent: true,
              };
            },
            data: [0],
          },

          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85,
                  startAngle: ((270 + -angle) * Math.PI) / 180,
                  endAngle: ((40 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[2],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          // 橘色

          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85,
                  startAngle: ((90 + -angle) * Math.PI) / 180,
                  endAngle: ((220 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: colors[2],
                  fill: 'transparent',
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85;
              let point = this.getCirlPoint(x0, y0, r, 90 + -angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[3], //粉
                  fill: colors[3],
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: 'ring5', //绿点
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: (params, api) => {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.85;
              let point = this.getCirlPoint(x0, y0, r, 270 + -angle);
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 2
                },
                style: {
                  stroke: colors[3], //绿
                  fill: colors[3],
                },
                silent: true,
              };
            },
            data: [0],
          },
        ],
      }, true)
    },
    //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
    getCirlPoint(x0, y0, r, angle) {
      let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
      let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
      return {
        x: x1,
        y: y1,
      };
    }
  }
}
</script>

<style lang="scss" scoped>
#chart-board-box {
  background: rgba(10, 57, 130, .6);
  height: 33.4%;
  color: #fff;

  .chart-title {
    display: flex;
    color: #fff;
    font-weight: bolder;
    padding: 5px 10px;
    background: rgba(10, 57, 130, .6);
    position: relative;

    .charts-icon{
      width: 20px;
      height: 25px;
      position: absolute;
      left: 15px;
      top: 0;
    }

    .dv-decoration-1 {
      width: 50px;
      height: 18px;
    }
  }

  #chart-board {
    padding: 0 10px 10px 10px;
    height: calc(100% - 30px);

    .amounts-box{
      height: calc(50%);
      padding: 10px 0 10px 10px;

      .amounts-box-card{
        height: 100%;
        padding: 10px 0 10px 10px;
        background-image: url("../../assets/images/largescreen/amounts-box.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .amounts-num{
          font-size: 18px;
          color: #05E7CF;
          font-weight: bolder;
          padding-left: 5px;
        }

        .amounts-unit{
          font-size: 14px;
          color: #05E7CF;
        }

        .amounts-day-box{
          span{
            padding-right: 3px;
          }
        }
      }
    }

    .amounts-total-box{
      display: flex;
      height: 100%;
      .amounts-total-bgline{
        width: 15px;
        height: 100%;
        background-image: url("../../assets/images/largescreen/amounts-bgline.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .amounts-total-card{
        height: 100%;
        padding: 10px;
        flex-grow: 1;
        padding-left: 10%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .amounts-total{

          &>div{
            display: flex;
            align-items: center;
          }

          .amounts-total-icon{
            width: 15px;
            height: 15px;
          }
          .amounts-total-title{
            padding-left: 5px;
          }
          .amounts-total-num{
            padding-left: 20px;
            font-size: 18px;
            font-weight: bolder;
            color: #05E7CF;
          }
        }
      }
    }

    .triangleUp{
      color: red;
    }
    .triangleDown{
      color: green;
    }
  }
}

</style>
