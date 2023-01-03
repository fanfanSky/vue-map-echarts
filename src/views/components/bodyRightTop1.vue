<template>
  <div id="chart-bar-area-manyilv-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>{{ areaName === 'china' ? '全国' : areaName }}满意率排名统计</span>
    </div>
    <div id="chart-bar-area-manyilv"/>
  </div>
</template>

<script>
import resize from '@/utils/resize'

export default {
  mixins: [resize],
  name: "bodyRightTop",
  data() {
    return {
      chart: null,
      amountsNameList: [],
      manyilvDataList: [],
      manyilvDataList100: [],
    }
  },
  props: {
    areaName: {
      type: String,
      default: 'china'
    },
    // 当前地图上的地区名字
    mapNameList: {
      type: Array,
      default() {
        return []
      }
    },
    // 地区统计数据
    areaStatisticSatisfied: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    mapNameList: {
      handler(val) {
        this.amountsNameList = []
        this.manyilvDataList = []
        this.manyilvDataList100 = []
        for (var i = 0; i < val.length; i++) {
          this.amountsNameList.push(val[i])
          this.manyilvDataList.push((Math.random() * 100).toFixed(0) * 1)
          this.manyilvDataList100.push(100)
        }
        this.initChart()
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.$nextTick(() => {
        this.chart = this.$echarts.init(document.getElementById('chart-bar-area-manyilv'))
        this.setOptions()
      })
    },
    setScrollHeight() {
      if (0 <= this.manyilvDataList.length && this.manyilvDataList.length <= 10) {
        return 100
      } else if (10 < this.manyilvDataList.length && this.manyilvDataList.length <= 14) {
        return 70
      } else if (14 < this.manyilvDataList.length && this.manyilvDataList.length <= 18) {
        return 55
      } else if (18 < this.manyilvDataList.length && this.manyilvDataList.length <= 22) {
        return 50
      } else if (22 < this.manyilvDataList.length && this.manyilvDataList.length <= 26) {
        return 45
      } else if (26 < this.manyilvDataList.length && this.manyilvDataList.length <= 30) {
        return 35
      } else {
        return 30
      }
    },
    setOptions() {
      this.chart.setOption({
        grid: {
          left: 10,
          right: 30,
          bottom: 0,
          top: 0,
          containLabel: true
        },
        // 不显示x轴的相关信息
        xAxis: {
          show: false,
        },
        yAxis: [{
          show: true,
          type: "category",
          inverse: true,
          data: this.amountsNameList,
          // 不显示y轴的线
          axisLine: {
            show: false
          },
          // 不显示刻度
          axisTick: {
            show: false
          },
          // 把刻度标签里面的文字颜色设置为白色
          axisLabel: {
            color: "#fff",
            rotate: 0,
            textStyle: {
              fontSize: 10
            },
            formatter: (value) => {
              var title = ''
              for (let i = 0; i < 10; i++) {
                if (value === this.amountsNameList[i]) {
                  title = 'Top' + (i + 1)
                }
              }
              return title
            }
          }
        },
          {
            data: this.manyilvDataList,
            inverse: true,
            // 不显示y轴的线
            axisLine: {
              show: false
            },
            // 不显示刻度
            axisTick: {
              show: false
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              show: false,
              color: "#fff"
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',//inside 纵向使用滚轮 inside 内置于坐标系中
            show: this.mapNameList.length > 9 ? true : false,
            start: 0,
            end: this.setScrollHeight(),
            yAxisIndex: [0],
          },
          {
            type: 'slider',//slider 纵向使用滚动条 inside 内置于坐标系中
            show: this.mapNameList.length > 9 ? true : false,
            start: 0,
            end: 100,
            yAxisIndex: [0],
            filterMode: 'empty',
            width: 20,
            handleSize: 10,
            showDataShadow: true,
            textStyle: {
              color: '#fff'
            }
          },
        ],
        series: [
          {
            name: "条",
            type: "bar",
            data: this.manyilvDataList,
            yAxisIndex: 0,
            // 修改第一组柱子的圆角
            itemStyle: {
              barBorderRadius: 20,
              // 此时的color 可以修改柱子的颜色
              color: function (params) {
                // params 传进来的是柱子对象
                // console.log(params);
                // dataIndex 是当前柱子的索引号
                return "#1089E7";
              }
            },
            // 柱子之间的距离
            barCategoryGap: 50,
            //柱子的宽度
            barWidth: 10,
            // 显示柱子内的文字
            label: {
              show: true,
              position: "insideLeft",
              fontSize: 10,
              color: '#fff',
              formatter: "{b} {c}%",
              // formatter: (params) => {
              //   var name = params.name
              //   var amounts = val[params.dataIndex].amounts * 1
              //   var verysatisfied = val[params.dataIndex].verysatisfied * 1
              //   var generalSatisfaction = val[params.dataIndex].generalSatisfaction * 1
              //   if(amounts === 0) {
              //     return name + ' 0 %'
              //   }
              //   return name + ' ' + ((((verysatisfied + generalSatisfaction) / amounts).toFixed(2)) * 100).toFixed(0) + ' %'
              // }
            }
          },
          {
            name: "框",
            type: "bar",
            // barCategoryGap: 0,
            // barWidth: 1,
            // yAxisIndex: 1,
            data: this.manyilvDataList100,
            itemStyle: {
              color: "none",
              borderColor: "transparent",
              borderWidth: 0,
              barBorderRadius: 0
            }
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-bar-area-manyilv-box {
  background: rgba(125, 155, 243, .2);
  //height: calc(33.3% - 10px);
  //margin-bottom: 10px;
  height: 100%;

  .chart-title {
    display: flex;
    color: #fff;
    font-weight: bolder;
    padding: 5px 10px;
    background: rgba(125, 155, 243, .2);
    position: relative;

    .charts-icon {
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

  #chart-bar-area-manyilv {
    height: calc(100% - 30px);
  }
}

</style>
