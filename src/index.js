import "./index.css"
import moment from 'moment'

const root = document.getElementById('missing_her')
const start = moment('20180710', 'YYYYMMDD')
const days = moment().diff(start, 'day')
const daysDom = missing_her.querySelector('.missing_her_days')

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

// 文字颜色渐变
setInterval(() => {
  const positionX = parseInt(root.style.backgroundPositionX) || 0
  root.style.backgroundPositionX = positionX + 10 + 'px'
}, 100)
