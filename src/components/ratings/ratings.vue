<template>
  <div class="ratings" ref="ratings">
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
      <split></split>
      <ratingselect @type-change="changeType" @content-change="changeContent" :desc="desc" :ratings="ratings"
                    :select-type="selectType" :only-content="onlyContent"></ratingselect>
      <div class="content-wrapper">
        <ul v-show="ratings && ratings.length">
          <li v-show="showItem(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
            <div class="left">
              <img width="28" height="28" :src="rating.avatar" alt="">
            </div>
            <div class="right">
              <span class="name">{{rating.username}}</span>
              <div class="star-wrapper">
                <star class="star" :type="24" :score="rating.score"></star>
                <span v-show="rating.deliveryTime" class="deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                <ul class="recommend-ul">
                  <li v-for="recommend in rating.recommend" class="recommend-item">{{recommend}}</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <div v-show="!ratings || !ratings.length" class="no-ratings">暂无评价</div>
      </div>
    </div>

  </div>
</template>
<script>
  import star from 'components/star/star'
  import split from 'components/split/split'
  import ratingselect from 'components/ratingselect/ratingselect'
  import BScroll from 'better-scroll'
  import axios from 'axios'
  import {formatDate} from "../../common/js/formatDate";

  const ALL = 2
  const POSITIVE = 0
  const NEGATIVE = 1

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        onlyContent: true,
        selectType: ALL,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    components: {
      star,
      split,
      ratingselect
    },
    methods: {
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
      showItem(type,text){
        if(this.onlyContent && !text){
          return false
        }
        if(this.selectType === ALL){
          return true
        }else{
          return type === this.selectType
        }
      }
    },
    filters: {
      // 将时间戳格式化
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    created() {
      axios.get('/api/ratings')
        .then(res => {
          this.ratings = res.data.data
          // 需要在页面数据变化完成后才执行的函数需要写在$nextTick中
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  .ratings
    position absolute
    top 174px
    left 0
    bottom 1px
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
        padding 6px 0
        border-right 1px solid rgba(7, 17, 27, 0.2)
        // iphone 5
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
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
        @media only screen and (max-width: 320px)
          margin-left 6px
          margin-right 0
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
    .content-wrapper
      .rating-item
        display flex
        position relative
        margin 18px
        border-1px(rgba(147, 153, 159, 0.2))
        &:last-child
          border-none()
        .left
          margin-right 12px
          img
            border-radius 50%
        .right
          .name
            font-size 10px
            color rgb(7, 17, 27)
            line-height 12px
          .star-wrapper
            margin 4px 0 6px 0
            .star
              display inline-block
              vertical-align top
            .deliveryTime
              display inline-block
              vertical-align baseline
              font-size 10px
              font-weight 200
              color rgb(147, 153, 159)
              line-height 12px
          .time
            position absolute
            right 0
            top 0
            font-size 10px
            font-weight 200
            color rgb(147, 153, 159)
            line-height 12px
          .text
            font-size 12px
            color rgb(7, 17, 27)
            line-height 18px
            margin-bottom 8px

          .recommend
            display flex
            font-size 0
            margin-bottom 18px
            .icon-thumb_up, .icon-thumb_down
              display inline-block
              vertical-align top
              font-size 12px
              line-height 16px
              margin-right 8px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(183, 187, 191)
            .recommend-ul
              display inline-block
            .recommend-item
              display inline-block
              vertical-align top
              text-align: center
              width 60px
              margin-right 8px
              margin-bottom 4px
              padding 0 6px
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
              font-size 9px
              color rgb(147, 153, 159)
              line-height 16px
              border 1px solid rgba(7, 17, 27, 0.1)
              border-radius 2px
              border-width 1px


</style>
