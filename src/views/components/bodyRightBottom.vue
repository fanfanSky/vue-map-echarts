<template>
  <div id="chart-table-box">
    <div class="chart-title">
      <img class="charts-icon" :src="require('@/assets/images/largescreen/charts-icon.png')" alt="">
      <dv-decoration-1/>
      <span>实时</span>
    </div>
    <dv-scroll-board id="chart-table" :config="config"/>
  </div>
</template>

<script>
import resize from '@/utils/resize'
export default {
  mixins: [resize],
  name: "bodyCenterBottom",
  props: {
    timedComplain: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      chart: null,
      timedComplainDataList: [],
      config: {}
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.setConfig()
    })
  },
  watch: {
    timedComplain: {
      handler(val) {
        var arr = []
        for (var i = 0; i < val.length; i++) {
          arr.push([
            '<span>' + val[i].comUser + '</span>',
            val[i].comContact,
            this._parseTime(val[i].comDate, '{y}-{m}-{d} {h}:{i}:{s}'),
          ])
        }
        this.timedComplainDataList = arr
        this.setConfig()
      },
      deep: true
    }
  },
  methods: {
    setConfig() {
      this.config = {
        header: ['姓名', '联系方式', '时间'],
        data: this.timedComplainDataList,
        columnWidth: [70, 90],
        headerBGC: 'rgba(36, 203, 241, .1)',
        oddRowBGC: 'rgba(125, 155, 243, .2)',
        evenRowBGC: 'rgba(125, 155, 243, .2)',
        rowNum: 5,
        align: ['center', 'center']
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#chart-table-box {
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

  #chart-table {
    padding: 10px;
    height: calc(100% - 50px);
  }
}

</style>
<style>
.dv-scroll-board .header .header-item{
  padding: 0 3px!important;
  font-size: 10px;
}
.dv-scroll-board .rows .ceil{
  padding: 0 3px!important;
  font-size: 10px;
}
</style>
