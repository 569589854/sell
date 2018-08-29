export function urlParse(){
  /**
   * @return ?id=12345&type=2
   * @type {string | ((regexp: (string | RegExp)) => number) | ((searcher: {[Symbol.search](string: string): number}) => number)}
   */
  let obj = {}
  let param = window.location.search
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = param.match(reg)   // ["?id=12345", "&type=2"]
  if(arr) {
    arr.forEach((a)=>{
      // 解码 %......
      let k = decodeURIComponent(a.substring(1).split('=')[0])
      let v = decodeURIComponent(a.substring(1).split('=')[1])
      obj[k] = v
    })
  }
  // console.log(obj.id)
  return obj
}
