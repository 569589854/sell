<template>
  <div class="seller" ref="seller">
    <div class="seller-wrapper">
      <div class="header-info">
        <div class="up">
          <span class="name">{{seller.name}}</span>
          <div class="star-wrapper">
            <star class="star" :type="36" :score="seller.score"></star>
            <span class="rank">({{seller.ratingCount}})</span>
            <span class="sellCount">月售{{seller.sellCount}}单</span>
          </div>
          <div class="favorite">
            <span @click="love" class="icon-favorite" :class="{'active':favorite}"></span>
            <span v-if="favorite" class="text">已收藏</span>
            <span v-else class="text" style="visibility: hidden">已收藏</span>
          </div>
        </div>
        <div class="down">
          <div class="left">
            <span class="title">起送价</span>
            <span class="minPrice">{{seller.minPrice}}</span><span class="yuan">元</span>
          </div>
          <div class="center">
            <span class="title">商家配送</span>
            <span class="minPrice">{{seller.deliveryPrice}}</span><span class="yuan">元</span>
          </div>
          <div class="right">
            <span class="title">平均配送时间</span>
            <span class="minPrice">{{seller.deliveryTime}}</span><span class="yuan">元</span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="bulletin-wrapper">
        <span class="title">公告与活动</span>
        <p class="bulletin">{{seller.bulletin}}</p>
        <ul>
          <li class="support-item" v-for="support in seller.supports">
            <span class="icon" :class="classList[support.type]"></span>
            <span class="desc">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="surrounding">
        <span class="title">商家实景</span>
        <div class="pics-wrapper" ref="pics">
          <div class="pics" ref="picImg">
            <img v-for="pic in seller.pics" width="120" height="90" :src="pic">
          </div>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <span class="title">商家信息</span>
        <ul class="infos">
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import star from 'components/star/star'
  import split from 'components/split/split'
  import BScroll from 'better-scroll'
  import {saveToLocal, loadFromLocal} from "../../common/store"

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })(),
        classList: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      }
    },
    components: {
      star,
      split
    },
    watch: {
      // seller: '_initPicsScroll'
    },
    methods: {
      love() {
        this.favorite = !this.favorite
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      },
      _initScroll() {
        if (!this.scroll) {
          // console.log('init')
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          // console.log('refresh')
          this.scroll.refresh()
        }
      },
      _initPicsScroll() {
        if (this.seller.pics) {
          let len = this.seller.pics.length
          let picWidth = 120
          let margin = 6
          // 让内层宽度大于外层宽度 从而启用better-scroll
          let width = (picWidth + margin) * len - margin
          this.$refs.picImg.style.width = width + 'px'
        }
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.pics, {
            // 横向滚动
            scrollX: true,
            // scrollY: true,
            // 忽略垂直方向 的滚动处理
            eventPassthrough: 'vertical'
          })
        } else {
          this.picScroll.refresh()
        }
      }
    },
    updated() {                // 相当于watch
      // console.log('update')
      this._initScroll()
      this._initPicsScroll()
    },
    mounted() {
      // console.log('mounted')
      this._initScroll()
      this._initPicsScroll()
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  .seller
    position absolute
    top 174px
    left 0
    bottom 1px
    width 100%
    overflow hidden
    .seller-wrapper
      .header-info
        margin 18px
        .up
          position relative
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            font-size 14px
            line-height: 14px
            color rgb(7, 17, 27)
            font-weight 700
          .star-wrapper
            margin-top 8px
            padding-bottom 18px
            font-size 0
            .star
              display inline-block
              vertical-align top
              margin 0 8px 0 0
            .rank, .sellCount
              display inline-block
              vertical-align baseline
              font-size 10px
              line-height: 18px;
              color rgb(77, 85, 93)
            .rank
              margin-right 12px
          .favorite
            position absolute
            text-align: center
            right 0
            top 0
            font-size 0
            .icon-favorite
              display block
              font-size 24px
              color #eee
              line-height: 24px;
              margin-bottom 4px
              &.active
                color rgb(240, 20, 20)
            .text
              font-size 10px
              line-height 10px
              color rgb(77, 85, 93)
        .down
          display flex
          justify-content space-around
          margin-top 18px
          .left, .center
            border-right 1px solid rgba(7, 17, 27, 0.1)
          .left, .center, .right
            flex 1
            text-align: center
            .title
              display block
              margin-bottom 4px
              font-size 10px
              color rgb(147, 153, 159)
              line-height 10px
            .minPrice, .yuan
              font-size 24px
              font-weight 200
              color rgb(7, 17, 27)
              line-height 24px
            .yuan
              font-size 10px

      .bulletin-wrapper
        margin 18px
        .title
          font-size 14px
          line-height 14px
          color rgb(7, 17, 27)
          font-weight 700
        .bulletin
          padding 8px 12px 16px 12px
          font-size 12px
          font-weight 200
          color rgb(240, 20, 20)
          line-height 24px
          border-1px(rgba(7, 17, 27, 0.1))
        .support-item
          font-size 0
          padding 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
            padding-bottom 0
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            margin-right 6px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image("decrease_4")
            &.discount
              bg-image("discount_4")
            &.special
              bg-image("special_4")
            &.invoice
              bg-image("invoice_4")
            &.guarantee
              bg-image("guarantee_4")
          .desc
            display inline-block
            vertical-align top
            font-size 12px
            font-weight 200
            color rgb(7, 17, 27)
            line-height 16px

      .surrounding
        margin 18px
        .title
          font-size 14px
          line-height 14px
          color rgb(7, 17, 27)
          font-weight 700
        .pics-wrapper
          overflow hidden
          .pics
            display flex
            margin-top 12px
            width 100%
            img
              margin-right 6px
              &:last-child
                margin-right 0
      .seller-info
        margin 18px
        .title
          margin-bottom 12px
          font-size 14px
          line-height 14px
          color rgb(7, 17, 27)
          font-weight 700
        .infos
          margin-top 12px
          .info-item
            padding 16px 12px
            font-size 12px
            font-weight 200
            color rgb(7, 17, 27)
            line-height 16px
            border-1px(rgba(7, 17, 27, 0.1))
            &:first-child
              border-top 1px solid rgba(7, 17, 27, 0.1)
            &:last-child
              border-none()

</style>
