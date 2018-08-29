<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <!-- <img src="./assets/logo.png"> -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link id="default_red" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--vue2.0 keep-alive 保存状态在内存中-->
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
    <!--<v-footer :seller="seller"></v-footer>-->
    <!--<shopcart @to-index="getParams" ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"-->
    <!--:min-price="seller.minPrice"></shopcart>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from 'components/header/header'
  import shopcart from 'components/shopcart/shopcart'
  import {urlParse} from "./common/js/utils"

  export default {
    components: {
      'v-header': header,
      // 'v-footer': footer,
      shopcart
    },
    name: 'App',
    data() {
      return {
        flag: true,
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        },
        selectFoods: []
      }
    },
    method: {
      getParams(param) {
        console.log(param)
        this.selectFoods = param
      }
    },
    created() {
      axios.get('/api/seller?id=' + this.seller.id)
        .then(response => {
          this.seller = Object.assign({}, this.seller, response.data.data)
          console.log(this.seller.id)
        })
        .catch(error => {
          console.log("网络错误！")
        })
    },
    // mounted(){
    //   let href = location.href;
    //   if(href.indexOf('goods')==-1 && href.indexOf("ratings")==-1 && href.indexOf("seller")==-1 && this.flag==true){
    //     console.log("true")
    //     document.getElementById("default_red").classList.add("active");
    //   }
    // },
    // beforeDestroy(){
    //   let href = location.href;
    //   if(href.indexOf("goods")==-1){
    //     console.log('update')
    //     document.getElementById("default_red").classList.remove("active");
    //   }
    // },
    // updated(){
    //   let href = location.href;
    //   if(href.indexOf("goods")==-1){
    //     console.log('update')
    //     document.getElementById("default_red").classList.remove("active");
    //   }
    // }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    // border-bottom: 1px solid rgba(7,17,27,0.1)
    .tab-item
      flex: auto
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)

</style>
