<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classList[seller.supports[0].type]"></span><span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail-show">
        <div class="detail-content clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :score="4.8" :type="48"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="support">
              <li class="support-item" v-for="supportItem in seller.supports">
                <span class="icon" :class="classList[supportItem.type]"></span>
                <span class="text">{{supportItem.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}{{seller.bulletin}}{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import axios from 'axios'
  import star from 'components/star/star'
  export default{
    props:{
      seller:{
        type:Object,
      }
    },
    data(){
      return{
        detailShow:false,

      }
    },
    methods:{
      showDetail(){
        this.detailShow = true;
      },
      hideDetail(){
        this.detailShow = false;
      }
    },
    components:{
      'star':star,
    },
    created(){
      this.classList = ['decrease','discount','special','invoice','guarantee'];
    }
  }
</script>
<style lang="stylus">
@import '../../common/stylus/mixin.styl'
.header
  color #fff
  position relative
  overflow hidden
  background-color: rgba(7,17,27,0.5)
  .content-wrapper
    position relative
    font-size: 0
    padding: 24px 12px 18px 24px
    .avatar
      display: inline-block
      vertical-align top
      img
        border-radius 2px
    .content
      display inline-block
      margin-left 16px
      .title
        margin 2px 0 8px 0
        .brand
          vertical-align top
          display inline-block
          width 30px
          height 18px
          bg-image('brand')
          background-size 30px 18px
          background-repeat no-repeat
        .name
          margin-left 6px
          font-size 16px
          line-height 18px
          font-weight bold
      .description
        margin-bottom 10px
        font-size 12px
        line-height 12px
      .support
        .icon
          display inline-block
          vertical-align top
          margin-right 4px
          width 12px
          height 12px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.guarantee
            bg-image('guarantee_1')
          &.invoice
            bg-image('invoice_1')
          &.special
            bg-image('special_1')
        .text
          font-size 10px
          line-height 12px
    .support-count
      position absolute
      right 12px
      bottom 14px
      padding 7px 8px
      border-radius 10px
      background-color rgba(0,0,0,0.2)
      text-align center
      .count
        vertical-align top
        font-size 10px
        line-height 12px
        margin-right 2px
      .icon-keyboard_arrow_right
        font-size 10px
        // line-height 12px

  .bulletin-wrapper
    position relative
    height 28px
    padding 0 22px 0 12px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    vertical-align top
    background-color rgba(7,17,27,0.2)
    .bulletin-title
      display inline-block
      vertical-align top
      width 22px
      height 12px
      margin-left 12px
      margin-top 8px
      bg-image('bulletin')
      background-size 22px 12px
      background-repeat no-repeat
    .bulletin-text
      vertical-align top
      margin 0 4px
      font-size 10px
      line-height 28px
    .icon-keyboard_arrow_right
      position absolute
      font-size 10px
      right 12px;
      top 8px
  .background
    width 100%
    height 100%
    position absolute
    top 0px
    left 0px
    z-index -1
    filter: blur(10px)
  .detail-show
    position fixed
    top 0px
    left 0px
    width 100%
    height 100%
    z-index 100
    overflow auto
    background: rgba(7, 17, 27, 0.8)
    &.fade-enter
      opacity: 0
    &.fade-enter-to
      opacity: 1
    &.fade-enter-active
      transition all 0.8s
    &.fade-enter-cancelled
      transition all 10s


    .detail-content
      min-height 100%
      width 100%
      .detail-main
        margin-top 64px
        //向下撑开高度
        padding-bottom 100px
        .name
          font-size 16px
          font-weight 700
          line-height 16px
          text-align center
        .star-wrapper
          margin-top 16px
          text-align center
        .title
          display flex
          width 80%
          margin 28px auto 24px auto
          .line
            //相对原来位置向上偏移6px
            position relative
            flex 1
            top: -6px
            border-bottom 1px solid rgba(255,255,255,0.2)
          .text
            font-weight 700
            font-size 16px
            padding 0 12px
        .support
          width 80%
          margin 0 auto
          .support-item
            font-size 0
            padding 0 12px
            margin-bottom 12px
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              vertical-align top
              width 16px
              height 16px
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              &.decrease
                bg-image("decrease_2")
              &.discount
                bg-image("discount_2")
              &.special
                bg-image("special_2")
              &.invoice
                bg-image("invoice_2")
              &.guarantee
                bg-image("guarantee_2")
            .text
              font-size 12px
              line-height 16px
              font-weight 200
        .bulletin
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            font-size 12px
            font-weight 200
            line-height 24px
    .detail-close
      width 32px
      height 32px
      font-size 32px
      clear both
      margin -64px auto 0 auto






</style>
