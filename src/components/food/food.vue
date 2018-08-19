<template>
  <transition name="move">
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
        <split v-show="food.info"></split>
        <div class="introduce" v-show="food.info">
          <h1 class="name">商品介绍</h1>
          <div class="info">{{food.info}}</div>
        </div>
        <split></split>
        <div class="ratings">
          <div class="name">商品评价</div>
          <ratingselect @content-change="changeContent" @type-change="changeType" :select-type="selectType"
                        :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="showItem(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar">
                </div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div v-show="!food.ratings || !food.ratings.length" class="no-ratings">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'
  import split from 'components/split/split'
  import ratingselect from 'components/ratingselect/ratingselect'
  import {formatDate} from 'common/js/formatDate'

  const ALL = 2
  const POSITIVE = 0
  const NEGATIVE = 1
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      // 接收子组件cartcontrol的e.target 此时e === cartcontrol -> e.target
      cartAdd(e) {
        this.$emit('food-add', e)
      },
      show() {
        this.selectType = ALL
        this.onlyContent = true
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
      },
      changeType(type) {
        console.log(type)
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      changeContent(flag) {
        console.log(flag)
        this.onlyContent = flag
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      showItem(type, text) {
        // 只看有内容评价 且无内容
        if (this.onlyContent && !text) {
          return false
        }
        // 全部
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    filters: {
      // 将时间戳格式化
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
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
      transition all .5s ease
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
            transition all .5s
          &.fade-enter, &.fade-leave-to
            opacity 0
          &.fade-enter-to, &.fade-leave
            opacity 1
      .introduce
        padding 18px
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
      .ratings
        .name
          margin 18px
        .rating-wrapper
          .rating-item
            position relative
            padding 16px 18px
            border-1px(rgba(147, 153, 159, 0.2))
            .time
              margin-bottom 6px
              font-size 10px
              color rgb(147, 153, 159)
            .user
              position absolute
              right 18px
              top 0
              font-size 0
              .name
                display inline-block
                margin-right 6px
                font-size 10px
                line-height 12px
                color rgb(147, 153, 159)
              .avatar
                border-radius 50%
            .text
              font-size 12px
              line-height 12px
              color rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right 4px
                font-size 12px
                line-height 24px
              .icon-thumb_up
                color rgb(0, 160, 220)
              .icon-thumb_down
                color rgb(147, 153, 159)
          .no-ratings
            margin 16px 18px
            font-size 12px
            color rgb(147, 153, 159)


</style>
