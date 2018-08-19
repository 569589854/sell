<template>
  <div class="wrapper">
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="listFold">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart icon" :class="{'highlight': totalCount>0}"></i>
            </div>
            <div v-show="totalCount>0" class="count">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" :class="payClass" @click="pay">{{deliveryDesc}}</div>
      </div>
      <div class="ball-container">
        <transition-group tag="div" name="drop"
                          @before-enter="beforeEnter"
                          @enter="dropEnter"
                          @after-enter="afterEnter">
          <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold"
                  @before-enter="beforeUnfold"
                  @enter="enterUnfold"
                  @after-enter="afterUnfold"
                  @enter-cancelled="cancelUnfold"
      >
        <div ref="foldCart" class="cartlist-wrapper" v-show="showList">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="scrollList">
            <ul>
              <li ref="li" v-for="food in selectFoods" class="food">
                <span class="name">{{food.name}}</span>
                <div class="price"><span class="price-icon">￥</span>{{food.price}}</div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @cart-decrease="cartDeacrease" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="showList"></div>
    </transition>
  </div>
</template>

<script>
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {
        // 购物车最多显示行数
        maxShowFood: 5,
        balls: [
          {
            show: false,
            el: null
          },
          {
            show: false,
            el: null
          },
          {
            show: false,
            el: null
          },
          {
            show: false,
            el: null
          },
          {
            show: false,
            el: null
          }
        ],
        dropballs: [],
        fold: true
      }
    },
    name: "shopcart",
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 10,
              count: 1
            }
          ]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      totalPrice() {
        let price = 0
        this.selectFoods.forEach((food) => {
          price += food.count * food.price
        })
        return price
      },
      deliveryDesc() {
        let diff = this.minPrice - this.totalPrice
        if (this.totalPrice > 0 && this.totalPrice < 20) {
          return `还差￥${diff}元起送`
        } else if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else {
          return `去结算`
        }
      },
      payClass() {
        if (this.totalPrice >= this.minPrice) {
          return `enough`
        } else {
          return `not-enough`
        }
      },
      showList() {
        // 购物车没物品
        if (!this.totalCount) {
          // 折叠
          this.fold = true
          // 不显示
          return false
        }
        // 购物车不为空
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.scrollList, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      // 购物车物品减少动画
      cartDeacrease(count) {
        let liLength = this.$refs.li.length
        // 一秒钟动画
        this.$refs.foldCart.style.transition = 'all .4s ease'

        // 购物车模块的top值
        let top = parseInt(this.$refs.foldCart.style.top.split('px')[0])
        // 如果某样商品减为0
        if (count === 0) {
          // 当购物车数量少于5时 向下移动一个li的高度 即48px
          // 272,232 184 136 max-height = 232px 最多显示5件商品
          if (liLength <= this.maxShowFood) {
            let topNum = top + 48 + 'px'
            this.$refs.foldCart.style.top = topNum
          }
        }
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          // 球未显示 另其显示
          if (!ball.show) {
            ball.show = true
            // 小球div元素
            ball.el = el
            this.dropballs.push(ball)
            return
          }
        }
      },
      // 这里的el指的是小球的Dom,与drop(el)参数区分开
      beforeEnter(el, done) {
        // 小球的个数
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();// 获取小球的相对于视口的位移(小球高度) ClientRect {top: 294, right: 357, bottom: 318, left: 333, width: 24…}
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22); // 计算出与小球初始位置垂直方向上的距离，y轴向上为负
            // el.style.display = '';
            el.style.transform = `translate3d(0,${y}px,0`; // y轴移动距离
            el.style.webkitTransform = `translate3d(0,${y}px,0`;
            // 处理内层动画
            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`; // x轴移动距离
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropEnter(el, done) {
        /* eslint-disable no-unused-vars */
        /* 触发浏览器重绘; */
        let rf = el.offsetHeight;
        // 让动画效果异步执行 提高性能
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          // 处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，否则无法进入到afterEnter中
        });
      },
      afterEnter(el) {
        el.style.display = 'none'; //隐藏小球
        let ball = this.dropballs.shift(); //完成一次动画就删除一个dropballs的小球，否则触发N次事件，dropBalls则有N个元素
        ball.show = false;
        ball.el = null;
      },
      listFold() {
        if (this.totalCount > 0) {
          this.fold = !this.fold
        }
      },
      // 上升动画 （点击按钮时）
      beforeUnfold() {
        // 每次动画开始时购物车的位置
        this.$refs.foldCart.style.top = 0
      },
      // 执行动画时
      enterUnfold() {
        // let height = this.$refs.foldCart.offsetHeight
        // this.$refs.foldCart.style.top = -height + 'px'
      },
      // 动画完成后 （上升动画完成后）
      afterUnfold() {
        // 购物车停在指定位置
        let height = this.$refs.foldCart.offsetHeight
        this.$refs.foldCart.style.top = -height + 'px'
        // console.log(height)
      },
      // 动画未完成时取消（上升过程突然点击按钮）
      cancelUnfold() {
        // 购物车复位
        // console.log('复位了')
        this.$refs.foldCart.style.top = 0
      },
      empty() {
        this.selectFoods.forEach((food => {
          food.count = 0
        }))
        this.fold = true
        this.cancelUnfold()
      },
      hideList() {
        this.fold = true
      },
      pay() {
        if (this.totalPrice >= this.minPrice) {
          console.log(`成功支付${this.totalPrice}元`)
          this.empty()
        }
      }
    },
    created() {
      this.$emit('hide-cart')
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  .shopcart
    display flex
    position fixed
    left 0
    bottom 0
    height 48px
    width 100%
    z-index 50
    background-color #141d27
    .content
      display flex
      width 100%
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        position relative
        flex 1
        font-size 0
        color #919396
        .logo-wrapper
          position relative
          top -10px
          display inline-block
          width 58px
          height 58px
          text-align: center
          z-index 50
          margin 0 12px 2px 12px
          border-radius 50%
          background-color #131d26
          border 1px solid #131d26
          .count
            display inline-block
            position absolute
            top 0
            left 36px
            width 24px
            height 16px
            background-color rgb(240, 40, 40)
            border-radius 50%
            color #fff
            font-size 9px
            font-weight 700
            line-height 16px
          .logo
            vertical-align top
            text-align: center
            width 44px
            height: 44px
            margin 7px
            background-color #2b343c
            border-radius 50%
            &.highlight
              background-color rgb(0, 160, 220)
            .icon
              position relative
              font-size 24px
              top 10px
              &.highlight
                color #fff
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          height 24px
          line-height 24px
          padding-right 12px
          border-right 1px solid #2c343d
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          height 48px
          line-height 48px
          margin-left: 12px
          font-size 12px
          font-weight normal
          color #787b7f
      .content-right
        flex 0 0 105px
        width 105px
        font-weight 700
        font-size 12px
        height 48px
        line-height 48px
        text-align: center
        &.enough
          color #fff
          background-color green
        &.not-enough
          color #979a9c
          background-color #2b333b

    .ball-container
      .ball
        /*background: rgb(0, 160, 220)*/
        // 不设背景色 隐藏此动画效果
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        border-radius 50%
        &.drop-enter-active
          transition: all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all .5s linear
    .cartlist-wrapper
      position: absolute
      left 0
      top 0
      z-index -1
      width 100%
      &.fold-enter-active, &.fold-leave-active
        transition .4s ease

      // 进入动画前 可有可无
      &.fold-enter
        transform translate3d(0, 0, 0)

      // 想要实现的动画效果  向上平移100%
      &.fold-enter-to
        transform translate3d(0, -100%, 0)

      // 离开动画前 可有可无
      &.fold-leave
        transform translate3d(0, 0, 0)

      // 离开时的效果 向下平移100%
      &.fold-leave-to
        transform translate3d(0, 100%, 0)

      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background-color #f3f5f7
        border-1px(rgba(7, 17, 27, 0.1))
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
          line-height 40px
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        max-height 232px
        padding 0 18px
        background-color #fff
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
        .name
          font-size 14px
          line-height 24px
          font-weight 700
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 12px
          font-size 24px
          font-weight 700
          line-height 24px
          color rgb(240, 20, 20)
          .price-icon
            font-size 10px
            font-weight normal
            color rgb(240, 20, 20)
            vertical-align middle
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px

  .list-mask
    position: fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    background-color rgba(7, 17, 27, 0.6)
    //backdrop-filter: blur(10px)
    blur(10px)
    &.fade-enter-active, &.fade-leave-active
      transition all .3s
    &.fade-enter
      opacity 0
    &.fade-enter-to
      opacity 1
    &.fade-leave
      opacity 1
    &.fade-leave-to
      opacity 0

</style>
