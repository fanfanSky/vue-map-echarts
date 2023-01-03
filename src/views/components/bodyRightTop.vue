<template>
  <div id="chart-bar-area-item-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>{{ areaName === 'china' ? '全国' : areaName }}排名统计</span>
    </div>
    <div id="chart-bar-area-item"/>
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
      amountsCodeList: [],
      amountsDataList: [],
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
        this.amountsCodeList = []
        this.amountsDataList = []
        for (var i = 0; i < val.length; i++) {
            this.amountsNameList.push(val[i])
            this.amountsDataList.push(this._mathRandom1000())
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
      this.chart = this.$echarts.init(document.getElementById('chart-bar-area-item'))
      this.setOptions()
    },
    setScrollHeight() {
      if (0 <= this.amountsDataList.length && this.amountsDataList.length <= 10) {
        return 100
      } else if (10 < this.amountsDataList.length && this.amountsDataList.length <= 14) {
        return 70
      } else if (14 < this.amountsDataList.length && this.amountsDataList.length <= 18) {
        return 55
      } else if (18 < this.amountsDataList.length && this.amountsDataList.length <= 22) {
        return 50
      } else if (22 < this.amountsDataList.length && this.amountsDataList.length <= 26) {
        return 45
      } else if (26 < this.amountsDataList.length && this.amountsDataList.length <= 30) {
        return 35
      } else {
        return 30
      }
    },
    setOptions() {
      this.chart.setOption({
        color: ['#24CFF4'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b} <br/>数量 : {c}'
        },
        grid: {
          left: 10,
          right: 30,
          bottom: 0,
          top: 0,
          containLabel: true
        },
        xAxis: {
          show: false,
          // type: 'value',
          // position: 'top',
          // minInterval: 1,
          // axisLine:{
          //   lineStyle :{
          //     color: '#fff'
          //   }
          // },
          // axisLabel:{
          //   rotate: 330,
          //   textStyle:{
          //     fontSize:10
          //   }
          // },
          // splitLine: {
          //   show: false
          // }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.amountsNameList,
          // axisLine:{
          //   lineStyle :{
          //     color: '#fff'
          //   }
          // },
          // 不显示y轴的线
          axisLine: {
            show: false
          },
          // 不显示刻度
          axisTick: {
            show: false
          },
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
          },
        },
        dataZoom: [
          // {
          //   type: 'slider',
          //   show: true,
          //   start: 0,
          //   end: 100,
          //   xAxisIndex: [0],
          //   startValue: 0,
          //   endValue: 60000,
          // },
          // {
          //   type: 'inside',
          //   show: true,
          //   start: 0,
          //   end: 100,
          //   xAxisIndex: [0],
          //   startValue: 0,
          //   endValue: 60000,
          // },
          {
            type: 'inside',//slider 纵向使用滚动条 inside 内置于坐标系中
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
            name: '全国概况',
            type: 'bar',
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
              normal: {
                show: true, //开启显示
                position: 'insideLeft',//在里面显示
                fontSize: 10,
                color: '#fff',
                formatter: "{b} {c}"
              },
            },
            data: this.amountsDataList
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-bar-area-item-box {
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

  #chart-bar-area-item {
    height: calc(100% - 30px);
  }
}

</style>
