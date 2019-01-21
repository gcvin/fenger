<template>
  <div class="missing_her">
    <div
      ref="barrage"
      class="barrage"
    >
      <a
        class="fixed"
        href="https://github.com/gcvin/fenger/issues/3"
      >
        我想对凤儿说
      </a>
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
    <div class="avatar" />
    <div
      ref="words"
      class="words animated"
    >
      <p>凤儿不在的</p>
      <p>第</p>
      <div
        ref="days"
        class="days"
      >
        <div
          v-for="n in length"
          :key="n"
          class="number"
        >
          <div
            v-for="m in 10"
            :key="m"
          >
            {{ m - 1 }}
          </div>
        </div>
      </div>
      <p>天</p>
      <p>想她！！！想她！！！想她！！！</p>
      <p>
        <img
          class="emoji"
          src="https://twemoji.maxcdn.com/2/72x72/1f62d.png"
        >
        <img
          class="emoji"
          src="https://twemoji.maxcdn.com/2/72x72/1f62d.png"
        >
        <img
          class="emoji"
          src="https://twemoji.maxcdn.com/2/72x72/1f62d.png"
        >
      </p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
const colors = [
  '#f00', '#f60', '#0c0',
  '#699', '#06c', '#909'
]
let barrageDom = null
export default {
  data () {
    return {
      list: [],
      tops: [],
      barrages: []
    }
  },
  computed: {
    days () {
      const start = moment('20180710', 'YYYYMMDD')
      return moment().diff(start, 'day')
    },
    length () {
      return (this.days + '').length
    }
  },
  mounted () {
    const daysDom = this.$refs.days
    const numsDom = daysDom.childNodes
    const length = numsDom.length

    let count = 0
    // 数字滚动
    const timer = setInterval(() => {
      count++

      if (count > this.days) {
        clearInterval(timer)
      }

      // 满十进一
      for (let n = 0; n < length; n++) {
        if (count / Math.pow(10, n) % 1 === 0) {
          numsDom[length - n - 1].style.bottom = count / Math.pow(10, n) % 10 * 100 + 'px'
        }
      }
    }, 100)

    // 评论弹幕
    barrageDom = this.$refs.barrage
    const rows = ~~(barrageDom.clientHeight / 28)
    
    this.tops.push(...new Array(rows).fill().map((_, index) => index * 28))
    this.getComments()

    const words = this.$refs.words
    this.animate(words, 'rotateIn')
  },
  methods: {
    // 递归请求github评论
    getComments (page = 1) {
      const url = 'https://api.github.com/repos/gcvin/fenger/issues/3/comments?per_page=100&page='
      this.$http.get(url + page).then(rs => {
        const len = rs.data.length

        if (!len || len !== 100) {
          this.list.push(...rs.data)
          this.appendBarrage()
          return false
        }

        this.list.push(...rs.data)
        this.getComments(page + 1)
      })
    },
    appendBarrage () {
      if (!this.list.length) {
        return false
      }

      const option = this.list.pop()
      const duration = ~~(Math.random() * 5000) + 15000
      const delay = ~~(Math.random() * 3000)
      const top = this.tops.splice(~~(Math.random() * this.tops.length), 1).pop()
      const color = colors[~~(Math.random() * 6)]

      option.style = {
        top: top + 'px',
        backgroundColor: color,
        animationDelay: delay / 1000 + 's',
        animationDuration: duration / 1000 + 's'
      }

      this.barrages.push(option)

      // 动画结束移除DOM
      setTimeout(() => {
        const index = this.barrages.indexOf(option)
        this.barrages.splice(index, 1)
        this.tops.push(top)
        this.appendBarrage()
      }, duration + delay)

      this.tops.length && this.appendBarrage()
    },
    animate(node, name) {
      return new Promise((resolve) => {
        node.classList.add('animated', name)

        const onEnd = () => {
          node.classList.remove('animated', name)
          node.removeEventListener('animationend', onEnd)
          resolve()
        }

        node.addEventListener('animationend', onEnd)
      })
    }
  }
}
</script>
<style lang="less">
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css');
@font-face {
  font-family: digital;
  src: url('./font/digital.ttf') format("truetype");
}

.missing_her {
  position: relative;
  width: 100%;
  text-align: center;
  margin: 200px auto;
  font-size: 18px;
  line-height: 24px;
  padding-bottom: 24px;
  background: #f4f4f4;

  .barrage {
    position: absolute;
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
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f00;
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
    border-radius: 50%;
    background: url('./img/fenger.jpg') no-repeat center;
    background-size: cover;
  }

  .words {
    width: 300px;
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
        transition: bottom .1s;
      }
    }

    .emoji {
      height: 18px;
    }
  }
}

@keyframes toleft
{
	0%   {
    left: 100%;
    transform: translateX(0);
  }
  100% {
    left: 0;
    transform: translateX(-100%);
  }
}
</style>


