<template>
  <div id="chart-bar-area-publish-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>{{areaName === 'china' ? '全国' : areaName}}</span>
    </div>
    <div id="chart-bar-area-publish"/>
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
      infoOpenPubSubType: {
        '1': '测试1',
        '2': '测试2',
        '3': '测试3',
        '4': '测试4',
        '5': '测试5',
      },
      mapJsonData: {
        pubSubName: [],
        pubSubType: [],
        publishView: [],
        publishViewZero: [],
      }
    }
  },
  props: {
    areaName: {
      type: String,
      default() {
        return ''
      }
    },
    daTjInformation: {
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
    daTjInformation: {
      handler(val) {
        var arr = []
        for (var i = 0; i < val.length; i++) {
          var obj = {}
          for(var key in this.infoOpenPubSubType) {
            if(val[i].pub_sub_type == key) {
              obj = {
                pub_sub_name: this.infoOpenPubSubType[key],
                ...val[i],
              }
              arr.push(obj)
            }
          }
        }
        arr.sort(this._sortBy('publishView'))
        this.mapJsonData = {
          pubSubName: [],
          pubSubType: [],
          publishView: [],
          publishViewZero: [],
        }
        for(var j = 0; j < arr.length; j++) {
          this.mapJsonData.pubSubName.push(arr[j].pub_sub_name)
          this.mapJsonData.pubSubType.push(arr[j].pub_sub_type)
          this.mapJsonData.publishView.push(arr[j].publishView)
          this.mapJsonData.publishViewZero.push(0)
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
      this.chart = this.$echarts.init(document.getElementById('chart-bar-area-publish'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        color: ['#1395D2'],
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
        xAxis: [
          {
            type: 'category',
            data: this.mapJsonData.pubSubName,
            axisTick: {
              alignWithLabel: true,
            },
            nameTextStyle: {
              color: '#82b0ec',
            },
            axisLine: {
              lineStyle: {
                color: '#82b0ec',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 10
              },
            },
          },
        ],
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
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: 10
            },
          },
          axisLine: {
            show: false,
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle:{
              color: 'rgba(125, 155, 243, .2)',
              width: .5,
              type: 'solid'
            }
          },
        }],
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 25,
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
            // for (let i = 0; i < params.length; i++) {
              htmlStr += '<div style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + params[0].color + '"></div>' +
                params[0].seriesName + ':' + params[0].value + '<br/>';
            // }
            return htmlStr
          }
        },
        series: [
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [20, 10],
            symbolOffset: [0, -5],
            symbolPosition: 'end',
            z: 12,
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#fff',
                fontSize: 10
              },
            },
            data: this.mapJsonData.publishView,
          },
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [20, 10],
            symbolOffset: [0, 5],
            z: 12,
            data: this.mapJsonData.publishView,
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                opacity: 0.7,
              },
            },
            barWidth: '20',
            data: this.mapJsonData.publishView,
          },
          {
            type: 'effectScatter',
            silent: true,
            tooltip: {
              show: false,
            },
            zlevel: 3,
            symbolSize: 10,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              color: '#3cefff',
              scale: 3,
            },
            itemStyle: {
              color: '#3cefff',
            },
            hoverAnimation: true,
            data: this.mapJsonData.publishViewZero,
          },
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-bar-area-publish-box {
  background: rgba(125, 155, 243, .2);
  height: 33.4%;
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

  #chart-bar-area-publish {
    height: calc(100% - 30px);
  }
}

</style>
