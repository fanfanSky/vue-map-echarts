<template>
  <div id="chart-pie-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>满意度分析</span>
    </div>
    <div id="chart-pie"/>
  </div>
</template>

<script>
import resize from '@/utils/resize'
export default {
  mixins: [resize],
  name: "bodyRightCenter",
  data() {
    return {
      chart: null,
      satisfiedMap: [],
      satisfiedMapData: [],
      satisfiedMapData1: [],
      color: ['#2A8BFD', '#BAFF7F', '#00FAC1', '#00CAFF', '#f54ac8', '#FDE056', '#4ED33C', '#FF8A26', '#FF5252', '#9689FF', '#CB00FF']
    }
  },
  props: {
    satisfied: {
      type: Object,
      default() {
        return {}
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
    satisfied: {
      handler(val) {
        this.setSatisfiedData(val)
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
    // 设置数据格式
    setSatisfiedData(val) {
      this.satisfiedMap = [{
        name: '非常满意',
        value: val.verysatisfied
      }, {
        name: '满意',
        value: val.satisfaction
      }, {
        name: '一般满意',
        value: val.generalSatisfaction
      }, {
        name: '不太满意',
        value: val.notVerySatisfied
      }, {
        name: '不满意',
        value: val.veryDissatisfied
      }]
      this.satisfiedMapData = []
      this.satisfiedMapData1 = []
      for (var i = 0; i < this.satisfiedMap.length; i++) {
        this.satisfiedMapData.push({
          value: this.satisfiedMap[i].value,
          name: this.satisfiedMap[i].name,
          itemStyle: {
            normal: {
              borderWidth: 8,
              shadowBlur: 20,
              borderRadius: 20,
              borderColor: this.color[i],
              shadowColor: this.color[i]
            }
          }
        }, {
          value: 5,
          name: '',
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 0

            }
          }
        });
        this.satisfiedMapData1.push({
            value: this.satisfiedMap[i].value,
            name: this.satisfiedMap[i].name,
          },
          {
            value: 5,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0,
                opacity: 0.2

              }
            }
          }
        )
      }
    },
    initChart() {
      this.chart = this.$echarts.init(document.getElementById('chart-pie'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        color: this.color,
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          formatter: (param) => {
            var percent = 0
            if(this.satisfied.amounts != 0) {
              percent = ((param.value / this.satisfied.amounts) * 100).toFixed(2)
            }
            return param.name + '：' + param.value + '（' +  percent + '%）'
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true, readOnly: false},
            saveAsImage: {show: true}
          },
          top: 0,
          itemSize: 10,//工具栏 icon 的大小
          iconStyle: {
            borderColor: '#fff',
          }
        },
        legend: {
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 8,
          right: 'right',
          bottom: 'bottom',
          textStyle: {
            color: '#fff',
            fontSize: 10
          },
          data: [
            '非常满意',
            '满意',
            '一般满意',
            '不太满意',
            '不满意',
          ]
        },
        series: [
          {
            name: '',
            type: 'pie',
            clockWise: false,
            radius: ['98%', '95%'],
            hoverAnimation: false,
            center: ['44.44%', '50%'],
            top: "center",
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            },
            data: this.satisfiedMapData,
          },
          {
            type: 'pie',
            top: "center",
            startAngle: 90,
            clockwise: false,
            center: ['44.44%', '50%'],
            legendHoverLink: false,
            hoverAnimation: false,
            radius: ['94%', '55%'],
            itemStyle: {
              opacity: 0.15
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: this.satisfiedMapData1,
          },
          {
            name: '',
            type: 'pie',
            clockWise: false,
            center: ['44.44%', '50%'],
            radius: ['39%', '38%'],
            hoverAnimation: false,
            top: "center",
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            },
            data: this.satisfiedMapData,
          },
        ],
        // series: [
        //   {
        //     name: '满意度分析',
        //     type: 'pie',
        //     radius: [10, 80],
        //     center: ['40%', '50%'],
        //     roseType: 'radius', // area
        //     itemStyle: {
        //       borderRadius: 5,
        //       normal: {
        //         // color: 各异,
        //         borderWidth: 1,
        //         label: {
        //           show: true,//数据标签显示
        //           position: 'outer',
        //           textStyle://数据标签的字体配置，与其他组件相同
        //             {
        //               fontSize: 10,//字号
        //               fontWeight: 'normal',//粗细【normal\bold\bolder\lighter】
        //               fontFamily: 'Microsoft YaHei',//字体【 'serif'\'monospace'\'Arial'\'Courier New'\'Microsoft YaHei'】
        //               color: ''//颜色各异
        //             },
        //           // formatter: '{b}：{d}%'//a:系列名，就是你上面写的name半径模型，b：数据名，就是rose1，c：数据值，d百分比
        //         },
        //         labelLine: {
        //           show: true,//数据标签引导线
        //           length: 1, //第一段长度
        //           length2: 10, //第二段长度 设置0不显示第二段
        //           lineStyle: {
        //             width: 1,
        //             type: 'solid'
        //           }
        //         }
        //       },
        //     },
        //     label: {
        //       show: true
        //     },
        //     emphasis: {
        //       label: {
        //         show: true
        //       }
        //     },
        //     data: [
        //       {value: this.satisfied.verysatisfied, name: '非常满意', itemStyle: {color: '#09F9CD'}},
        //       {value: this.satisfied.satisfaction, name: '满意', itemStyle: {color: '#24CBF1'}},
        //       {value: this.satisfied.generalSatisfaction, name: '一般满意', itemStyle: {color: '#868EF9'}},
        //       {value: this.satisfied.notVerySatisfied, name: '不太满意', itemStyle: {color: '#E6A23C'}},
        //       {value: this.satisfied.veryDissatisfied, name: '不满意', itemStyle: {color: '#EF557D'}},
        //     ]
        //   }
        // ],
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-pie-box {
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

  #chart-pie {
    height: calc(100% - 30px);
  }
}

</style>
