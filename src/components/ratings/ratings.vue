<template>
  <div class="ratings">
    <div class="ratings-wrapper">
      <div class="overview">
        <div class="overview-left">
          <span class="score">{{seller.score}}</span>
          <h1 class="title">综合评分</h1>
          <span class="rankRate">高于周边商家{{seller.rankRate}}%</span>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star class="star" :score="seller.serviceScore" :type="36"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star class="star" :score="seller.foodScore" :type="36"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import star from 'components/star/star'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {}
    },
    components: {
      star
    }
  }
</script>
<style lang="stylus" scoped>
  .ratings
    position absolute
    top 174px
    left 0
    bottom 58px
    width 100%
    overflow hidden

  .ratings-wrapper
    .overview
      display flex
      .overview-left
        text-align: center
        flex 0 0 137px
        width 137px
        margin 18px 0
        padding-bottom 6px
        border-right 1px solid rgba(7, 17, 27, 0.2)
        .score
          font-size 24px
          color rgb(255, 153, 0)
          line-height 28px
        .title
          font-size 12px
          color rgb(7, 17, 27)
          line-height 12px
          margin-bottom 8px
          margin-top 6px
        .rankRate
          font-size 10px
          color rgba(7, 17, 27, 0.5)
          line-height 10px
      .overview-right
        flex 1
        margin 18px 24px
        padding-top 6px
        .score-wrapper
          margin-bottom 8px
        .score-wrapper
          font-size 0
          .star
            display inline-block
            vertical-align top
            margin-right 12px
          .title
            display inline-block
            vertical-align top
            font-size 12px
            color rgb(7, 17, 27)
            line-height 18px
            margin-right 12px
          .score
            font-size 12px
            color rgb(253, 153, 0)
            line-height 18px
        .delivery-wrapper
          font-size 0
          .title
            font-size 12px
            color rgb(7, 17, 27)
            line-height 18px
            margin-right 12px
          .delivery
            font-size 12px
            line-height 18px
            color rgb(147, 153, 159)
</style>
