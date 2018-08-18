<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="decrease" @click.stop.prevent="decrease($event)" v-show="food.count>0">
        <transition name="roll">
          <span style="display: block" class="icon-remove_circle_outline inner" v-show="food.count>0"></span>
        </transition>
      </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="increase icon-add_circle" @click.stop.prevent="increase($event)"></div>
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
        this.$emit('cart-decrease', this.food.count)
        // console.log(this.food.count)
      },
      increase(e) {
        // console.log(e.target)
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
      // 旋转动画 必须在块级元素中里面 span(display:block) 标签 不会生效！
      .inner
        &.roll-enter-active, &.roll-leave-active
          transition all .8s
        &.roll-enter
          transform: rotate(0)
        &.roll-enter-to
          transform: rotate(-360deg)
        &.roll-leave
          transform: rotate(0)
        &.roll-leave-to
          transform: rotate(360deg)
      // 弹出动画, 隐藏动画
      &.move-enter-active, &.move-leave-active
        transition all .8s
      &.move-enter
        opacity 0
        transform translate3d(24px, 0, 0)
      &.move-enter-to
        opacity: 1
        transform: translate3d(0, 0, 0)
      &.move-leave
        opacity: 1
        transform: translate3d(0, 0, 0)
      &.move-leave-to
        opacity 0
        transform: translate3d(24px, 0, 0)



</style>
