export function formatDate(date, fmt) {
  // 年份2016 特殊处理
  if (/(y+)/.test(fmt)) {
    // RegExp.$1 -> yyyy 第一个匹配到的子表达式 RegExp 会不断更新
    fmt = fmt.replace(RegExp.$1, date.getFullYear() + '')
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    // 定义一个新的正则匹配  M+,d+...
    let reg = new RegExp(`(${k})`)
    // 转为字符串
    let str = o[k] + ''
    if (reg.test(fmt)) {
      // yyyy-m-dd -> str, yyyy-mm-dd -> addZero
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : addZero(str))
    }
  }
  return fmt
}

function addZero(str){
  // RegExp.$1.length === 1 要求显示 2016-7-23
  // 09 -> 0009.substr(2) -> 09,  9 -> 009.substr(1) -> 09
  return ('00' + str).substr(str.length)
}

// export function formateDate(date, fmt) {
//   if (/(y+)/.test(fmt)) {
//     // RegExp.$1 -> yyyy 第一个匹配到的子表达式 RegExp 会不断更新
//     fmt = fmt.replace(RegExp.$1, (date.getFullYear()))
//   }
//   let o = {
//     'M+': date.getMonth() + 1,
//     'd+': date.getDate(),
//     'h+': date.getHours(),
//     'm+': date.getMinutes(),
//     's+': date.getSeconds()
//   }
//   for (let k in o) {
//     if (new RegExp(`(${k})`).test(fmt)) {
//       let str = o[k] + '';
//       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : addZero(str));
//       // console.log(RegExp.$1)
//     }
//   }
// //   let str = '<a class="his"sadsdsa href="http://www.365mini.com/" title="首页" target="_blank">CodePlayer</a>';
// // // 提取URL
// //   let reg = /<a\s[^>]*href="([^">]+)"[^>]*>/;
// //   let flag = reg.exec(str);
// //   console.log(flag)
// //   console.log(RegExp.$1)
//   return fmt
// }
//
// function addZero(str) {
//   // RegExp.$1.length === 1 要求显示 2016-7-23
//   // 09 -> 0009.substr(2) -> 09,  9 -> 009.substr(1) -> 09
//   return ('00' + str).substr(str.length);
// }
//
