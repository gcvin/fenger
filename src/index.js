import "./index.css"
import moment from 'moment'
import axios from 'axios'

const root = document.getElementById('missing_her')
const start = moment('20180710', 'YYYYMMDD')
const days = moment().diff(start, 'day')
const daysDom = root.querySelector('.missing_her_days')

// 创建个位、十位、百位...数字元素
const createNumber = () => {
  const number = document.createElement('span')
  number.className = 'number'

  for (let n = 0; n < 10; n++) {
    const num = document.createElement('div')
    num.textContent = n
    number.appendChild(num)
  }
  daysDom.insertBefore(number, daysDom.firstChild)

  return number
}

let count = 0

const eles = []

// 添加个位数字
eles.push(createNumber())

// 数字滚动
const timer = setInterval(() => {
  count++

  if (count > days) {
    clearInterval(timer)
  }

  // 增加位数
  if (count === Math.pow(10, eles.length)) {
    eles.push(createNumber())
  }

  // 满十进一
  for (let n = 0; n < eles.length; n++) {
    if (count / Math.pow(10, n) % 1 === 0) {
      eles[n].style.bottom = count / Math.pow(10, n) % 10 * 100 + 'px'
    }
  }
}, 100)

let tops = []

// 评论弹幕
const barrage = (ele, list) => {
  const rows = ~~(ele.clientHeight / 28)
  const tops = new Array(rows).fill().map((_, index) => index * 28)
  const colors = ['#f00', '#f60', '#0c0', '#699', '#06c', '#909']

  const append = (len, curr) => {
    if (curr >= len) {
      return false
    }

    const option = list[curr]
    const bar = document.createElement('a')
    const img = document.createElement('img')
    const txt = document.createTextNode(option.body)
    
    const duration = ~~(Math.random() * 5000) + 15000
    const delay = ~~(Math.random() * 3000)
    const top = tops.splice(~~(Math.random() * tops.length), 1).pop()
    const color = colors[~~(Math.random() * 6)]

    img.src = option.user.avatar_url
    bar.appendChild(img)
    bar.appendChild(txt)

    bar.className = 'text'
    bar.href = option.html_url
    bar.style.top = top + 'px' 
    bar.style.transitionDuration = duration / 1000 + 's'
    bar.style.transitionDelay =  delay / 1000 + 's'
    bar.style.backgroundColor = color

    ele.appendChild(bar)

    // 修改left出现从右向左的动画
    const rect = bar.getBoundingClientRect()
    bar.style.left = rect.left - rect.right + 'px'
    
    const length = tops.length
    // 动画结束移除DOM
    setTimeout(() => {
      ele.removeChild(bar)
      tops.push(top)
      !length && append(len, curr + 1)
    }, duration + delay)

    length && append(len, curr + 1)
  }

  append(list.length, 0)
}

const ele = root.querySelector('.missing_her_barrage')
const url = 'https://api.github.com/repos/gcvin/fenger/issues/3/comments'

// 请求github评论
axios.get(url).then(rs => {
  barrage(ele, rs.data)
})