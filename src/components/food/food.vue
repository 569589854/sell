<template>
  <!--<transition name="move">-->
  <div class="food" v-show="showFlag" ref="foodScroll">
    <div class="food-content">
      <div class="img-header">
        <img :src="food.image">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="name">{{food.name}}</h1>
        <div class="detail">
          <span class="sellCount">月售{{food.sellCount}}</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
            <span class="new-price">
              <span class="price-icon">￥</span><span class="red-price">{{food.price}}</span>
            </span>
          <span class="old-price" v-show="food.oldPrice">
              <span class="price-icon">￥</span><span class="grey-price">{{food.oldPrice}}</span>
            </span>
        </div>
        <div class="cart-wrapper">
          <cartcontrol @cart-add="cartAdd" :food="food"></cartcontrol>
        </div>
        <transition name="fade">
          <div @click="firstAdd($event)" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
        </transition>
      </div>
      <div class="split"></div>
      <div class="introduce">
        <h1 class="name">商品介绍</h1>
        <div class="info">{{food.info}}</div>
      </div>
      <div class="split"></div>
      <div class="ratings">
        <div class="name">商品评价</div>
      </div>
    </div>
  </div>
  <!--</transition>-->
</template>

<script>
  import Vue from 'vue'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      // 接收子组件cartcontrol的e.target 此时e === cartcontrol -> e.target
      cartAdd(e) {
        this.$emit('food-add', e)
      },
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodScroll, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      firstAdd(e) {
        if (!e._constructed) {
          return
        }
        Vue.set(this.food, 'count', 1)
        this.$emit('first-cart-add', e.target)
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" scoped>
  .food
    position fixed
    top 0
    left 0
    bottom 48px
    width 100%
    z-index 30
    background-color #fff
    /*overflow hidden*/
    &.move-enter-active, &.move-leave-active
      transition all .8s ease
    &.move-enter
      transform translate3d(-100%, 0, 0)
    &.move-enter-to
      transform translate3d(0, 0, 0)
    &.move-leave
      transform translate3d(0, 0, 0)
    &.move-leave-to
      transform translate3d(-100%, 0, 0)
    .food-content
      overflow hidden
      .img-header
        position relative
        width 100%
        height 0
        padding-top 100%
        img
          position: absolute
          top 0
          left 0
          width 100%
          height 100%
        .back
          position absolute
          display block
          top 10px
          left 0
          padding 10px
          color #aaa
      .content
        position: relative
        padding 18px
        .name
          font-size 14px
          font-weight 700
          color rgb(7, 17, 27)
          line-height: 14px
          margin-bottom 8px
        .detail
          margin-bottom 18px
          font-size 10px
          line-height 10px
          color rgb(147, 153, 159)
          .sellCount
            margin-right 12px
        .price
          .new-price
            margin-right: 8px
            .price-icon
              font-size 10px
              font-weight normal
              color rgb(240, 20, 20)
              vertical-align middle
            .red-price
              line-height 24px
              font-size 20px
              font-weight 700
              color rgb(240, 20, 20)
          .old-price
            text-decoration: line-through
            color rgb(147, 153, 159)
            .price-icon
              font-size 10px
              font-weight normal
              vertical-align middle
              color rgb(147, 153, 159)
            .grey-price
              line-height 24px
              font-size 10px
              font-weight 700
              color rgb(147, 153, 159)
        .cart-wrapper
          position: absolute
          bottom 18px
          right 18px
        .buy
          position: absolute
          bottom 18px
          right 18px
          z-index 10
          padding 0 12px
          height 24px
          line-height 24px
          font-size 10px
          color #fff
          background-color rgb(0, 160, 220)
          box-sizing border-box
          border-radius 12px
          &.fade-enter-active, &.fade-leave-active
            transition all .8s
          &.fade-enter, &.fade-leave-to
            opacity 0
          &.fade-enter-to, &.fade-leave
            opacity 1
      .introduce, .ratings
        padding 18px
      .introduce
        .name
          font-size 14px
          font-weight 400
          color rgb(7, 17, 27)
          line-height: 14px
          margin-bottom 6px
        .info
          padding 0 8px
          font-size 12px
          font-size 200
          color rgb(77, 85, 93)
          line-height 24px

</style>
