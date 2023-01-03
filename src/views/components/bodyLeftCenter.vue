<template>
  <div id="chart-line-pv-pv-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>访问量分析</span>
    </div>
    <div id="chart-line-pv"/>
  </div>
</template>

<script>
import resize from '@/utils/resize'

export default {
  mixins: [resize],
  name: "bodyLeftCenter",
  data() {
    return {
      chart: null,
      mapJsonData: {
        pv: [],
        visitDate: [],
      }
    }
  },
  props: {
    todayPvNumber: {
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
    todayPvNumber: {
      handler(val) {
        this.mapJsonData = {
          pv: [],
            visitDate: [],
        }
        for (var i = 0; i < val.length; i++) {
          this.mapJsonData.pv.push(val[i].pv)
          this.mapJsonData.visitDate.push(val[i].visitDate)
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
      this.chart = this.$echarts.init(document.getElementById('chart-line-pv'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        color: ['#28CFA7'],
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          },
          top: 0,
          itemSize: 10,//工具栏 icon 的大小
          iconStyle: {
            borderColor: '#fff',
          }
        },
        xAxis: [{
          type: 'category',
          data: this.mapJsonData.visitDate,
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: 30,
            textStyle: {
              fontSize: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            }
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(125, 155, 243, .2)',
              width: .5,
              type: 'solid'
            }
          },
        }],
        dataZoom: [//滑动条
          {
            type: 'inside',
            realTime: true,
            roam: true,
            startValue: 0, // 从头开始。
            endValue: 7  // 一次性展示6个。
          }
        ],
        yAxis: [{
          type: 'value',
          name: '单位/件',
          minInterval: 1,
          nameTextStyle: {
            fontSize: 10,
            color: "#fff"
          },
          axisTick: {
            show: false//隐藏y坐标轴刻度
          },
          axisLabel: {//y轴字体样式
            rotate: 60,
            textStyle: {
              fontSize: 10
            }
          },
          axisLine: {
            show: true, //隐藏y坐标轴
            lineStyle: {
              color: '#fff',
            }
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(125, 155, 243, .2)',
              width: .5,
              type: 'solid'
            }
          },
        }],
        grid: {
          left: 0,
          right: 10,
          bottom: 0,
          top: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          padding: [5, 10],
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            stack: '访问量',
            smooth: false,  //这个是把线变成曲线
            // areaStyle: {}, //填充区域样式
            data: this.mapJsonData.pv
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-line-pv-pv-box {
  background: rgba(125, 155, 243, .2);
  height: calc(33.3%);
  //margin-bottom: 10px;

  .chart-title {
    display: flex;
    color: #fff;
    font-weight: bolder;
    padding: 5px 10px;
    background: rgba(125, 155, 243, .2);
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

  #chart-line-pv {
    height: calc(100% - 30px);
  }
}

</style>
