<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="decrease" @click="decrease($event)" v-show="food.count>0">
        <span class="icon-remove_circle_outline inner" v-show="food.count>0"></span>
      </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="increase icon-add_circle" @click="increase($event)"></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      decrease(e) {
        if (!e._constructed) {
          return
        }
        this.food.count--
      },
      increase(e) {
        if (!e._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 提交'cart-add'事情给父组件，e.target传递的参数，获取点击事件
        this.$emit('cart-add', e.target)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cartcontrol
    font-size 0
    .increase, .decrease
      display inline-block
      font-size 24px
      line-height 24px
      color rgb(0, 160, 220)
    .count
      display: inline-block
      vertical-align top
      font-size 10px
      line-height: 24px
      padding 0 6px
      color rgb(147, 153, 159)
    .decrease
      display inline-block
      // 弹出动画, 隐藏动画
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transition: all 0.4s linear
          rotate(0)
      &.move-enter-to
        .inner
          transition: all 0.4s linear
          rotate(180deg)
      // 弹出时间
      &.move-enter-active
        transition all 1s
      // 隐藏时间
      &.move-leave-active
        transition all 1.3s ease


</style>
