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
      eles[n].style.bottom = count / Math.pow(10, n) % 10 * 24 + 'px'
    }
  }
}, 100)

// 评论弹幕
const barrage = (ele, option) => {
  const div = document.createElement('div')
  const img = document.createElement('img')
  const txt = document.createTextNode(option.body)

  const rows = ele.clientHeight / 28
  const duration = ~~(Math.random() * 5000) + 15000
  const delay = ~~(Math.random() * 5000)
  const colors = ['#f00', '#f60', '#0c0', '#699', '#06c', '#909']

  img.src = option.user.avatar_url
  div.appendChild(img)
  div.appendChild(txt)

  div.className = 'text'
  div.style.top = ~~(Math.random() * rows) * 28 + 'px' 
  div.style.transitionDuration = duration / 1000 + 's'
  div.style.transitionDelay =  delay / 1000 + 's'
  div.style.backgroundColor = colors[~~(Math.random() * 6)]

  ele.appendChild(div)

  div.style.left = -div.clientWidth + 'px'

  setTimeout(() => {
    ele.removeChild(div)
  }, duration + delay)
}

const ele = root.querySelector('.missing_her_barrage')
const url = 'https://api.github.com/repos/gcvin/fenger/issues/3/comments'

// 请求github评论
axios.get(url).then(rs => {
  rs.data.forEach(item => {
    barrage(ele, item)
  })
})