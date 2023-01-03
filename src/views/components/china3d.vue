<template>
  <div id="map-container">
    <el-button type="text" size="large" class="back" @click="back" v-if="deepTree.length > 1">返回</el-button>
    <div class="echarts">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>

import {getChinaJson, getProvinceJson, getCityJson, getDistrictJson} from "@/api/map";
import {mapOption} from '@/config/mapOption'
import resize from '@/utils/resize'
import {getAreaJson, getJsonJson} from "../../../api/map/map";


export default {
  mixins: [resize],
  name: "china",
  components: {},
  props: {
    areaCode: {
      type: String,
      default: '000000000000'
    },
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
  data() {
    return {
      chart: null, // 实例化echarts
      mapDataList: [], // 当前地图上的地区
      option: {...mapOption.basicOption}, // map的相关配置
      deepTree: [],// 点击地图时push，点返回时pop
      emphasisAreaName: ''
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  mounted() {
    this.$nextTick(() => {
      this.initEcharts();
      this.chart.getZr().on('click', this.echartsMapClick);
    });
  },
  methods: {
    // 初次加载绘制地图
    initEcharts() {
      //地图容器
      this.chart = this.$echarts.init(document.getElementById('map'));
      if (this.areaCode === '000000000000') {
        this.requestGetChinaJson();
      } else {
        this.requestGetProvinceJSON({name: this.areaName, level: 'province', adcode: this.areaCode.substr(0, 6)})
      }
    },
    // 地图点击
    echartsMapClick(params) {

      this.requestGetAreaJson()

      console.log(77777777, params, this.emphasisAreaName)

      // this.$emit('update:areaCode', params.data.adcode + '000000')
      // this.$emit('update:areaName', params.data.name)
      // params.data.areaName = params.data.name;
      // if (params.data.level === 'province') {
      //   this.requestGetProvinceJSON(params.data);
      // } else if (params.data.level === 'city') {
      //   this.requestGetCityJSON(params.data)
      // } else if (params.data.level === 'district' && this.mapDataList.length > 1) {
      //   this.requestGetDistrictJSON(params.data)
      // } else {
      //   return false
      // }
    },
    //绘制全国地图
    requestGetChinaJson() {
      getChinaJson().then(res => {
        console.log('china--->', res)
        this.setJsonData(res)
      });
    },
    //绘制area Json
    requestGetAreaJson() {
      getAreaJson().then(res => {
        console.log('area--->', res)
        for(var i = 0; i < res.length; i++) {
          if(this.emphasisAreaName === res[i].areaname) {
            this.$emit('update:areaCode', res[i].areacode + '000000')
            this.$emit('update:areaName', res[i].areaname)
            this.requestGetJsonJson(res[i].areacode)
            break
          }
        }
      });
    },
    // 获取地图
    requestGetJsonJson(areacode) {
      getProvinceJson(areacode).then(res => {
        console.log('json--->', res)
        this.setJsonData(res)
      });
    },
    // 加载省级地图
    requestGetProvinceJSON(params) {
      getProvinceJson(params.adcode).then(res => {
        console.log('province--->', res)
        this.setJsonData(res, params)
      });
    },
    // 加载市级地图
    requestGetCityJSON(params) {
      getCityJson(params.adcode).then(res => {
        console.log('city--->', res)
        this.setJsonData(res, params)
      })
    },
    // 加载县级地图
    requestGetDistrictJSON(params) {
      getDistrictJson(params.adcode).then(res => {
        console.log('district--->', res)
        this.setJsonData(res, params)
      })
    },
    // 设置数据
    setJsonData(res) {
      var mapDataList = [];
      var mapNameList = [];
      for (let i = 0; i < res.features.length; i++) {
        let obj = {
          ...res.features[i].properties,
          value: Math.round(Math.random() * 3000),
        };
        mapDataList.unshift(obj)
        mapNameList.unshift(res.features[i].properties.name)
      }
      this.mapDataList = mapDataList;
      this.$emit('update:mapNameList', mapNameList)
      this.setMapData(res)
    },
    // 设置地图信息
    setMapData(res) {
      if (this.areaName === 'china') {
        this.deepTree.push({
          mapDataList: this.mapDataList,
          params: {name: 'china', level: 'country', adcode: '100000'}
        });
        //注册地图
        this.$echarts.registerMap('china', res);
        //绘制地图
        this.renderMap('china', this.mapDataList);
      } else {
        this.deepTree.push({mapDataList: this.mapDataList, params: {}});
        this.$echarts.registerMap(this.emphasisAreaName, res);
        this.renderMap(this.emphasisAreaName, this.mapDataList);
      }
    },
    // 渲染地图
    renderMap(map, data) {
      console.log(999, map)
      var mapDataList = data.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      mapDataList = mapDataList.sort(function (a, b) {
        return b.value - a.value
      });
      var pointData = data.map(item => {
        return {
          name: item.name,
          value: [item.center[0], item.center[1], item.value],
        }
      })
      // 设置左下角数量范围值
      this.option.visualMap.min = mapDataList.length > 1 ? mapDataList[mapDataList.length - 2].value : 0
      this.option.visualMap.max = mapDataList[0].value
      // 设置左上角当前位置
      this.option.title[0].text = map === 'china' ? '全国' : map
      // this.option.title[1].text = '测试 ' + this.amounts + ' 件'
      // this.option.amap = {}
      this.option.geo = {
        show: false,
        map: map,
        zoom: 1, //当前视角的缩放比例
        roam: false, //是否开启平游或缩放
        center: undefined,
      }
      this.option.geo3D = {
        show: true,
        map: map,
        zoom: 1, //当前视角的缩放比例
        roam: true, //是否开启平游或缩放
        center: undefined,
        // map: 'china',
        // roam: true,
        itemStyle: {
          color: '#1d5e98',
          opacity: 1,
          borderWidth: 0.4,
          borderColor: '#000'
        },
        label: {
          show: true,
          textStyle: {
            color: '#f00', //地图初始化区域字体颜色
            fontSize: 8,
            opacity: 1,
            backgroundColor: 'rgba(0,23,11,0)'
          },
        },
        emphasis: { //当鼠标放上去  地区区域是否显示名称
          label: {
            formatter: (params) => {
              console.log(1111, params)
              this.emphasisAreaName = params.name;
              return params.name;
            },
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 3,
              backgroundColor: 'rgba(0,23,11,0)'
            }
          }
        },
        //shading: 'lambert',
        light: { //光照阴影
          main: {
            color: '#fff', //光照颜色
            intensity: 1.2, //光照强度
            //shadowQuality: 'high', //阴影亮度
            shadow: false, //是否显示阴影
            alpha:55,
            beta:10

          },
          ambient: {
            intensity: 0.3
          }
        }
      }
      this.option.series = [
        // {
        //   map: map,
        //   name: map,
        //   mapType: map,
        //   zoom: 1, //当前视角的缩放比例
        //   roam: false, //是否开启平游或缩放
        //   center: undefined,
        //   scaleLimit: { //滚轮缩放的极限控制
        //     min: .5,
        //     max: 10
        //   },
        //   ...mapOption.seriesOption,
        //   data: data
        // },
        // {
        //   name: '散点',//series名称
        //   type: 'scatter',//散点类型
        //   coordinateSystem: 'geo',// series坐标系类型
        //   rippleEffect: {
        //     brushType: 'fill'
        //   },
        //   normal: {
        //     show: true,
        //     // 提示内容
        //     formatter: params => {
        //       return params.name;
        //     },
        //     position: 'top', // 提示方向
        //     color: '#fff'
        //   },
        //   emphasis: {
        //     show: true // 点
        //   },
        //   itemStyle: {
        //     normal: {
        //       color: '#F4E925',
        //       shadowBlur: 10,
        //       shadowColor: '#333'
        //     }
        //   },
        //   symbol:'pin', // 散点样式
        //   data: pointData,
        //   symbolSize: function(val) {
        //     if (val[2] === mapDataList[0].value) {
        //       return 27
        //     }
        //     return 10
        //   },
        //   showEffectOn: 'render', //加载完毕显示特效
        // },
      ];
      //渲染地图
      this.chart.setOption(this.option);
    },
    // 返回
    back() {
      if (this.deepTree.length > 1) {
        this.deepTree.pop();
        this.mapDataList = this.deepTree[this.deepTree.length - 1].mapDataList;
        var areaName = this.deepTree[this.deepTree.length - 1].params.name;
        var areaCode = this.deepTree[this.deepTree.length - 1].params.adcode;
        var mapNameList = this.mapDataList.map(item => {
          return item.name
        })
        this.$emit('update:areaCode', (areaCode === '100000' ? '000000' : areaCode) + '000000')
        this.$emit('update:areaName', areaName)
        this.$emit('update:mapNameList', mapNameList)
        this.renderMap(areaName, this.mapDataList);
      }
    }
  }
}

</script>

<style lang="scss" scoped>
#map-container {
  height: 70%;
  position: relative;

  .echarts {
    height: 100%;

    #map {
      width: 100%;
      height: 100%;
    }
  }

  .back {
    position: absolute;
    top: 55px;
    left: 5px;
    z-index: 9;
    //color: #24CFF4;
    font-weight: bold;
  }
}

</style>

