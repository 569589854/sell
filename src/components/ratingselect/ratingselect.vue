<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}
        <span class="count" :class="{'active':selectType===2}">{{ratings.length}}</span>
      </span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}
        <span class="count" :class="{'active':selectType===0}">{{positives.length}}</span>
      </span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}
        <span class="count" :class="{'active':selectType===1}">{{negatives.length}}</span>
      </span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>

  const ALL = 2
  const POSITIVE = 0
  const NEGATIVE = 1
  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: true
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === 0
        })
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === 1
        })
      }
    },
    methods: {
      select(type, e) {
        if (!e._constructed) {
          return
        }
        this.selectType = type
        this.$emit('type-change', type)
      },
      toggleContent(e) {
        if (!e._constructed) {
          return
        }
        this.onlyContent = !this.onlyContent
        this.$emit('content-change', this.onlyContent)
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    .rating-type
      margin 18px 0 0 18px
      font-size 0
      padding-bottom 18px
      border-1px(rgba(7, 17, 27, 0.1))
      .block
        display inline-block
        vertical-align top
        padding 8px 12px
        font-size 12px
        line-height 16px
        margin-right 8px
        border-radius 1px
        &.positive
          color rgb(77, 85, 93)
          background-color rgba(0, 160, 220, 0.2)
          &.active
            color #fff
            background-color rgb(0, 160, 220)
        &.negative
          color rgb(77, 85, 93)
          background-color rgba(77, 85, 93, 0.2)
          &.active
            color #fff
            background-color rgb(77, 85, 93)
        .count
          display inline-block
          vertical-align top
          font-size 8px
          margin-left 2px
          color rgb(77, 85, 93)
          line-height 16px
          &.active
            color #fff

    .switch
      padding 12px 0 12px 18px
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        font-size 24px
        line-height 24px
        color rgb(147, 153, 159)
        margin-right 4px
      .text
        display inline-block
        vertical-align top
        font-size 12px
        color rgb(147, 153, 159)
        line-height 24px
</style>
