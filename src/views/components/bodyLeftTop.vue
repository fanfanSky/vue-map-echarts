<template>
  <div id="chart-line-item-item-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>分析</span>
    </div>
    <div id="chart-line-item"/>
  </div>
</template>

<script>
import resize from '@/utils/resize'

export default {
  mixins: [resize],
  name: "bodyLeftTop",
  data() {
    return {
      chart: null,
      mapJsonData: {
        amounts: [],
        dsl: [],
        dbl: [],
        ybj: [],
        bysl: [],
        comdate: [],
      }
    }
  },
  props: {
    dayStaCount: {
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
    dayStaCount: {
      handler(val) {
        this.mapJsonData =  {
          amounts: [],
            dsl: [],
            dbl: [],
            ybj: [],
            bysl: [],
            comdate: [],
        }
        for (var i = 0; i < val.length; i++) {
          this.mapJsonData.amounts.push(val[i].amounts)
          this.mapJsonData.dsl.push(val[i].dsl)
          this.mapJsonData.dbl.push(val[i].dbl)
          this.mapJsonData.ybj.push(val[i].ybj)
          this.mapJsonData.bysl.push(val[i].bysl)
          this.mapJsonData.comdate.push(val[i].comdate)
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
      this.chart = this.$echarts.init(document.getElementById('chart-line-item'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        color: ['#24CBF1', '#868EF9', '#E6A23C', '#09F9CD', '#EF557D'],
        legend: {
          // icon: 'circle',
          itemWidth: 15,
          itemHeight: 8,
          itemGap: 8,
          align: "left", // icon 位于文字位置
          data: ['分析1', '分析2', '分析3', '分析4', '分析5'],
          textStyle: {
            color: '#fff',
            fontSize: 10
          },
          left: 0,
          top: 0
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          },
          top: 15,
          itemSize: 10,//工具栏 icon 的大小
          iconStyle: {
            borderColor: '#fff',
          }
        },
        xAxis: [{
          type: 'category',
          data: this.mapJsonData.comdate,
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
              color: '#fff'
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
          top: 60,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          padding: [5, 10],
          formatter: function (params) {
            let htmlStr = '';
            htmlStr += params[0].name + '<br/> ';
            for (let i = 0; i < params.length; i++) {
              htmlStr += '<div style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + params[i].color + '"></div>' +
                params[i].seriesName + ':' + params[i].value + '次<br/>';
            }
            return htmlStr
          }
        },
        series: [
          {
            name: '分析1',
            type: 'line',
            stack: '分析1',
            smooth: true,  //这个是把线变成曲线
            areaStyle: {}, //填充区域样式
            data: this.mapJsonData.amounts
          },
          {
            name: '分析2',
            type: 'line',
            stack: '分析2',
            smooth: true,  //这个是把线变成曲线
            areaStyle: {}, //填充区域样式
            data: this.mapJsonData.dsl
          },
          {
            name: '分析3',
            type: 'line',
            stack: '分析3',
            smooth: true,  //这个是把线变成曲线
            areaStyle: {}, //填充区域样式
            data: this.mapJsonData.dbl
          },
          {
            name: '分析4',
            type: 'line',
            stack: '分析4',
            smooth: true,  //这个是把线变成曲线
            areaStyle: {}, //填充区域样式
            data: this.mapJsonData.ybj
          },
          {
            name: '分析5',
            type: 'line',
            stack: '分析5',
            smooth: true,  //这个是把线变成曲线
            areaStyle: {}, //填充区域样式
            data: this.mapJsonData.bysl
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-line-item-item-box {
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

  #chart-line-item {
    height: calc(100% - 30px);
  }
}

</style>
