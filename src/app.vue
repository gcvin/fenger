<template>
  <div class="missing_her">
    <div ref="barrage" class="barrage">
      <a class="fixed" href="https://github.com/gcvin/fenger/issues/3">我想对凤儿说</a>
      <a
        v-for="barrage in barrages"
        :key="barrage.id"
        :href="barrage.html_url"
        :style="barrage.style"
        class="text"
      >
        <img :src="barrage.user.avatar_url">
        {{ barrage.body }}
      </a>
    </div>
    <div class="avatar"/>
    <div class="animated slow lyrics" ref="lyrics">{{ lyrics }}</div>
    <div class="words">
      <table class="weather">
        <tbody>
          <tr v-for="weather in weathers" :key="weather.date">
            <td width="30%">{{ weather.date }}</td>
            <td width="20%">{{ showWeek(weather.week) }}</td>
            <td width="30%">{{ showTemp(weather.nighttemp, weather.daytemp) }}</td>
            <td width="20%">{{ showWeather(weather.nightweather, weather.dayweather) }}</td>
          </tr>
          <tr>
            <td colspan="4">风云莫测，宜未雨而绸缪</td>
          </tr>
        </tbody>
      </table>
      <p>凤儿不在的</p>
      <p>第</p>
      <div ref="days" class="days">
        <div v-for="n in length" :key="n" class="number">
          <div v-for="m in 10" :key="m">{{ m - 1 }}</div>
        </div>
      </div>
      <p>天</p>
      <p>想她！！！想她！！！想她！！！</p>
      <p>
        <img class="emoji" src="https://twemoji.maxcdn.com/2/72x72/1f62d.png">
        <img class="emoji" src="https://twemoji.maxcdn.com/2/72x72/1f62d.png">
        <img class="emoji" src="https://twemoji.maxcdn.com/2/72x72/1f62d.png">
      </p>
    </div>
    <p class="comment">——峰哥、放爷、茜爷、肖大爷、张大爷泣血相赠</p>
    <a class="hover" href="javascript:;">
      <div class="box" v-for="n in 1024" :key="n"></div>
    </a>
  </div>
</template>
<script>
import moment from "moment";
const list = [];
const tops = [];
const colors = ["#f00", "#f60", "#0c0", "#699", "#06c", "#909"];
export default {
  data() {
    return {
      barrages: [],
      weathers: [],
      lyrics: ""
    };
  },
  computed: {
    days() {
      const start = moment("20180710", "YYYYMMDD");
      return moment().diff(start, "day");
    },
    length() {
      return (this.days + "").length;
    }
  },
  created() {
    this.getWeather();
  },
  mounted() {
    this.numberScroll();

    const barrageDom = this.$refs.barrage;
    const rows = ~~(barrageDom.clientHeight / 28);

    tops.push(...new Array(rows).fill().map((_, index) => index * 28));
    this.getComments();

    this.typingLyrics();
  },
  methods: {
    // 数字滚动
    numberScroll() {
      const daysDom = this.$refs.days;
      const numsDom = daysDom.childNodes;
      const length = numsDom.length;

      let count = 0;

      const timer = setInterval(() => {
        count++;

        if (count > this.days) {
          clearInterval(timer);
        }

        // 满十进一
        for (let n = 0; n < length; n++) {
          if ((count / Math.pow(10, n)) % 1 === 0) {
            numsDom[length - n - 1].style.bottom =
              ((count / Math.pow(10, n)) % 10) * 100 + "px";
          }
        }
      }, 100);
    },
    // 请求评论
    getComments(page = 1) {
      const url =
        "https://api.github.com/repos/gcvin/fenger/issues/3/comments?per_page=100&page=";
      this.$http.get(url + page).then(rs => {
        const len = rs.data.length;

        if (!len || len !== 100) {
          list.push(...rs.data);
          this.appendBarrage();
          return false;
        }

        list.push(...rs.data);
        this.getComments(page + 1);
      });
    },
    // 添加弹幕
    appendBarrage() {
      if (!list.length) {
        return false;
      }

      const option = list.pop();
      const duration = ~~(Math.random() * 5000) + 15000;
      const delay = ~~(Math.random() * 3000);
      const top = tops.splice(~~(Math.random() * tops.length), 1).pop();
      const color = colors[~~(Math.random() * 6)];

      option.style = {
        top: top + "px",
        backgroundColor: color,
        animationDelay: delay / 1000 + "s",
        animationDuration: duration / 1000 + "s"
      };

      this.barrages.push(option);

      // 动画结束移除DOM
      setTimeout(() => {
        const index = this.barrages.indexOf(option);
        this.barrages.splice(index, 1);
        tops.push(top);
        this.appendBarrage();
      }, duration + delay);

      tops.length && this.appendBarrage();
    },
    // 添加歌词
    typingLyrics() {
      const lyrics = this.$refs.lyrics;
      const lyricsArr = [
        "有些人走着走着就散了",
        "有些事看着看着就淡了",
        "有多少无人能懂的不快乐",
        "就有多少无能为力的不舍",
        "有些人想着想着就忘了",
        "有些梦做着做着就醒了",
        "才发现从前是我太天真",
        "现实又那么残忍"
      ];

      const next = (idx = 0) => {
        let index = 0;
        const content = lyricsArr[idx];

        const timer = setInterval(() => {
          index++;
          const sub = content.substr(0, index);

          if (content.length !== index) {
            this.lyrics = sub + "_";
            return false;
          }

          idx++;
          this.lyrics = sub;
          clearInterval(timer);

          this.animate(lyrics, "fadeOut").then(() => {
            this.lyrics = "";

            if (idx === lyricsArr.length) {
              this.lyrics = "一壶浊酒尽余欢，今宵别梦寒";
              return false;
            }

            next(idx);
          });
        }, 200);
      };

      next();
    },
    getWeather() {
      const key = "d8bd8efbc4364b2c8ba68ad7526f9842";
      const code = 500112;
      const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${code}&extensions=all`;
      this.$http.get(url).then(rs => {
        this.weathers = rs.data.forecasts[0].casts;
      });
    },
    showWeek(week) {
      const weeks = ["日", "一", "二", "三", "四", "五", "六", "日"];
      return `星期${weeks[week]}`;
    },
    showTemp(night, day) {
      return `${night}℃ ~ ${day}℃`;
    },
    showWeather(night, day) {
      return night === day ? night : `${night}转${day}`;
    },
    animate(node, name) {
      return new Promise(resolve => {
        node.classList.add("animated", name);

        const onEnd = () => {
          node.classList.remove("animated", name);
          node.removeEventListener("animationend", onEnd);
          resolve();
        };

        node.addEventListener("animationend", onEnd);
      });
    }
  }
};
</script>
<style lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css");
@font-face {
  font-family: digital;
  src: url("./font/digital.ttf") format("truetype");
}

html,
body {
  margin: 0;
  // height: 100%;
}

.missing_her {
  min-height: 100vh;
  text-align: center;
  font-size: 18px;
  line-height: 24px;
  background: #f4f4f4;
  padding: 20px 0;

  .barrage {
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 12px;

    img {
      float: left;
      margin-top: 2px;
      margin-right: 10px;
      height: 20px;
      width: 20px;
      border-radius: 50%;
    }

    a {
      position: absolute;
      opacity: 0.5;
      color: #fff;
      padding: 0 20px;
      white-space: nowrap;
      border-radius: 12px;
      text-decoration: none;
    }

    .fixed {
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      background-color: #06c;
    }

    .text {
      left: 100%;
      animation-fill-mode: forwards;
      animation-name: toleft;
      animation-timing-function: linear;
    }
  }

  .avatar {
    margin: 0 auto;
    height: 160px;
    width: 160px;
    border-radius: 10px;
    background: url("./img/fenger.jpg") no-repeat center;
    background-size: cover;
  }

  .lyrics {
    color: #ff9900;
    height: 48px;
    line-height: 48px;
  }

  .words {
    width: 400px;
    margin: 0 auto;
    color: transparent;
    background: linear-gradient(
      to bottom right,
      #f00,
      #f60,
      #0c0,
      #699,
      #06c,
      #909
    );
    -webkit-background-clip: text;

    .weather {
      font-size: 14px;
      width: 100%;
    }

    .days {
      font-family: digital;
      overflow: hidden;
      height: 100px;
      font-size: 100px;
      line-height: 100px;
      color: #f00;

      .number {
        display: inline-block;
        position: relative;
        bottom: 0;
        transition: bottom 0.1s;
      }
    }

    .emoji {
      height: 18px;
    }
  }

  .comment {
    color: #5cadff;
    font-size: 14px;
    text-align: right;
    padding-right: 20px;
  }

  @media only screen and (max-width: 416px) {
    .words {
      width: 100%;
    }
  }

  $count: 1024;

  @function randomNum($max) {
    @return random($max);
  }

  .hover {
    position: absolute;
    top: 20px;
    left: 50%;
    height: 160px;
    width: 160px;
    transform: translateX(-50%);

    .box {
      position: relative;
      float: left;
      width: 5px;
      height: 5px;
      // margin: 4px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        transform: scale3d(0.1, 0.1, 1);
        background-color: transparent;
        transition: 0.5s transform ease-in, 0.5s background ease-in;
      }
    }

    .box:hover {
      &::before {
        transform: scale3d(1.8, 1.8, 1.8);
        transition: 0s transform;
      }
    }
  }

  @for $i from 1 through $count {
    .box:nth-child(#{$i}):hover {
      &::before {
        background-color: rgba(
          randomNum(255),
          randomNum(255),
          randomNum(255),
          0.8
        );
      }
    }
  }
}

@keyframes toleft {
  0% {
    left: 100%;
    transform: translateX(0);
  }
  100% {
    left: 0;
    transform: translateX(-100%);
  }
}
</style>


