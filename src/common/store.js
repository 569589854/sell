export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__
  // 第一次调用本地存储
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 不是第一次调用本地存储 将seller解析 为 对象
    seller = JSON.parse(seller)
    // 没有该id 的数据
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  // 将value 存入
  seller[id][key] = value
  // 转为字符串并存入localStorage
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__
  console.log(seller)
  // 本地无存储
  if (!seller) {
    return def
  }
  // 解析对象
  seller = JSON.parse(seller)[id]
  // 不存在此id
  if (!seller) {
    return def
  }
  // 存在此id 但不存在key 属性
  let ret = seller[key]
  return ret || def
}
