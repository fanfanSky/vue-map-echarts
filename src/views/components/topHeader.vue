<template>
  <div id="top-header">
    <dv-decoration-8 class="header-right-decoration"/>
    <dv-decoration-10 class="header-left-decoration"/>
    <dv-decoration-6 class="header-center-decoration" :color="['#50e3c2', '#67a1e5']" style="height:.1rem;"/>
    <dv-decoration-10 class="header-left-decoration" style="transform: rotateY(180deg);"/>
    <dv-decoration-8 class="header-right-decoration" :reverse="true"/>
    <el-button type="text" size="large" class="left-title">
      {{ dateTime.dateYear }} {{ dateTime.dateWeek }} {{ dateTime.dateDay }}
      {{ dataWeather.city }}
      {{ dataWeather.weathertemp }}
      <img :src="dataWeather.icontemp" alt="">
      {{ dataWeather.peraturetemp }}
    </el-button>

    <div class="center-title">大屏数据展示</div>
    <router-link to="/">
      <el-button type="text" size="large" class="go-system">
        进入系统
        <i class="el-icon-thumb"></i>
      </el-button>
    </router-link>
  </div>
</template>

<script>


import {weatherOption} from "../../config/weatherOption";

export default {
  name: "topHeader",
  data() {
    return {
      dateTime: {
        dateDay: null,
        dateYear: null,
        dateWeek: null,
        weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      },
      dataWeather: {
        city: '北京市',
        dayweather: '晴',
        nightweather: '多云',
        weathertemp: '晴', // 根据时间判断选白天还是晚上的天气
        nighttemp: '3℃',
        daytemp: '15℃',
        peraturetemp: '3℃~15℃', // 根据时间判断选白天还是晚上的温度
        icontemp: 'https://cdn.heweather.com/cond_icon/100.png',
      },
    }
  },
  mounted() {
    this.getDateTime()
    this.requestGetWeather()
  },
  methods: {
    // 获取时间
    getDateTime() {
      setInterval(() => {
        this.dateTime.dateYear = this._parseTime(new Date(), '{y}-{m}-{d}');
        this.dateTime.dateWeek = this.dateTime.weekday[new Date().getDay()];
        this.dateTime.dateDay = this._parseTime(new Date(), '{h}:{i}:{s}');
      }, 1000)
    },
    // 获取天气
    requestGetWeather() {
      $.get({
        //这里的url不能写到data对象的外面
        url: 'https://api.asilu.com/weather_v2/',
        dataType: 'jsonp',  // 请求方式为jsonp
        success: (data) => {
          console.log('data==',data);
          if (data.status === '1') {
            let currTime = new Date().getHours();
            let dailyForecast = data.forecasts[0].casts[0];
            let city = data.forecasts[0].city;
            let daytemp = dailyForecast.daytemp + '℃';
            let nighttemp = dailyForecast.nighttemp + '℃';
            let weathertemp = '';
            let peraturetemp = '';
            if ((currTime >= 6) && (currTime < 18)) {
              weathertemp = dailyForecast.dayweather;
              peraturetemp = dailyForecast.nighttemp + "℃~" + dailyForecast.daytemp + "℃";
            } else {
              weathertemp = dailyForecast.nightweather;
              peraturetemp = dailyForecast.daytemp + "℃~" + dailyForecast.nighttemp + "℃";
            }
            let icontemp = 'https://cdn.heweather.com/cond_icon/' + weatherOption.weatherCode[weathertemp] + '.png';
            this.dataWeather = {city, daytemp, nighttemp, weathertemp, peraturetemp, icontemp}
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#top-header {
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;

  .header-center-decoration {
    width: 40%;
    margin-top: 40px;
  }

  .header-left-decoration, .header-right-decoration {
    width: 25%;
  }

  .left-title {
    position: absolute;
    font-weight: bold;
    left: 60px;

    img {
      width: 15px;
      height: 15px;
      filter: brightness(3);
      vertical-align: bottom;
    }
  }

  .center-title {
    position: absolute;
    font-size: 24px;
    font-weight: bold;
    left: 50%;
    top: 15px;
    transform: translateX(-50%);
    color: #fff;
  }

  .go-system {
    position: absolute;
    font-weight: bold;
    right: 60px;
    color: #409eff;
    -webkit-background-clip: text;
    animation: blink 2s linear infinite;
    -webkit-animation: blink 2s linear infinite;
    -moz-animation: blink 2s linear infinite;
    -ms-animation: blink 2s linear infinite;
    -o-animation: blink 2s linear infinite;

    i {
      transform: rotate(90deg);
    }
  }

}
</style>
<style>
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}

@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}

@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}

@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}
</style>
