<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu" >
      <ul>
        <li class="menu-item" v-for="(item,index) in goods" :class="{'current':currentIndex===index}"
            @click="selectMenu(index,$event)">
              <span class="text border-1px">
                <span v-show="item.type>0" class="icon" :class="classList[item.type]"></span>{{item.name}}
              </span>
        </li>
      </ul>
    </div>
    <div class="goods-wrapper" ref="goods" >
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
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
                  <!--父组件goods用 @cart-add="cartAdd" 监听cartcontrol 传来的 cart-add 事件, 监听到 调用 cartAdd 函数处理-->
                  <cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice"></shopcart>
    <food @food-add="cartAdd" @first-cart-add="cartAdd" :food="selectedFood" ref="food"></food>
  </div>
</template>
<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import shopcart from 'components/shopcart/shopcart'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import food from 'components/food/food'
  import split from 'components/split/split'
  export default {
    props: {
      seller: {
        type: Object,
      },
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        totalCount: 1,
        blur: false,
        selectedFood: {}
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food,
      split
    },
    computed: {
      // 计算当前商品所处纵坐标对应菜单的索引值index
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          // 高度区间   [0-40],[40-112]
          let h1 = this.listHeight[i]
          let h2 = this.listHeight[i + 1]
          // 如果i+1超出范围 h2===undefine !h2 = true
          if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
            // console.log(i)
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      // 点击任意位置 隐藏购物车
      hideCart() {
        if (this.totalCount > 0) {
          this.$refs.shopcart.fold = true
        }
        this.$refs.shopcart.cancelUnfold()
      },
      selectFood(food, e){
        if(!e._constructed){
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      },
      selectMenu(index, e) {
        // 如果不存在这个属性,则为原生点击事件，不执行下面的函数
        if (!e._constructed) {
          return;
        }
        let foodList = this.$refs.goods.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.goodsScroll.scrollToElement(el, 300)
      },
      _initScroll() {
        // 初始化菜单滚动条 以及 商品详情滚动条
        this.menuScroll = new BScroll(this.$refs.menu, {
          click: true
        })
        this.goodsScroll = new BScroll(this.$refs.goods, {
          // probeType: 1：滚动的时候会派发scroll事件，会截流。
          //            2：滚动的时候实时派发scroll事件，不会截流。
          //            3：除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件（快速滚动）
          probeType: 3,
          click: true
        })
        // 滚动时 记录纵坐标的值
        this.goodsScroll.on('scroll', (pos) => {
          // 取整 取绝对值
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      // 计算每一项 商品li 的高度 并存入listHeight
      _calculateHeight() {
        let foodList = this.$refs.goods.getElementsByClassName('food-list-hook')
        // 初始值为0
        let height = 0
        this.listHeight.push(height)    //   [0, 1054, 1185, 1294, 1596, 1800, 2026, 2331, 2829, 3535]
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
        // console.log(this.listHeight)
      },
      cartAdd(target) {
        // console.log(target)
        // console.log('drop')
        this.$nextTick(() => {
          // 调用shopcart组件的drop()函数
          this.$refs.shopcart.drop(target)
        })
        this.$emit('to-index',this.selectedFood)
      }

    },
    created() {
      this.classList = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      axios.get('/api/goods')
        .then(res => {
          this.goods = res.data.data
          // 需要在页面数据变化完成后才执行的函数需要写在$nextTick中
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    mounted() {
      blur = this.$refs.shopcart.fold
    }
  }
</script>
<style lang="stylus">
  @import '../../common/stylus/mixin.styl'
  .goods
    position absolute
    display flex
    top 174px
    bottom 58px
    &.hasCart
      color rgba(7, 17, 27, 0.6)
      filter: blur(10px)
    .menu-wrapper
      overflow hidden
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        &.current
          position: relative
          margin-top: -1px
          background #fff
          z-index 10
          .text
            font-weight 700
            border-none()
        .text
          display table-cell
          vertical-align middle
          font-size 12px
          line-height 14px
          font-weight 200
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display inline-block
            vertical-align top
            margin-right 2px
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .goods-wrapper
      flex 1
      /*width 100%*/
      overflow hidden
      .title
        height 26px
        width 100%
        font-size 12px
        padding-left 14px
        color rgb(147, 153, 159)
        line-height 26px
        background #f3f5f7
        border-left 2px solid #d9dde1
      .food-item
        display flex
        position: relative;
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          padding-bottom 0
        .icon
          flex 0 0 57px
          margin-right: 10px
        .content
          flex 0 0 122px
          .name
            padding-top 2px
            margin-bottom 8px
            font-size 14px
            color rgb(7, 17, 27)
            line-height 14px
          .desc, .extra
            font-size 10px
            line-height 10px
            color rgb(147, 153, 159)
          .desc
            line-height 14px
            margin-bottom 8px
          .extra
            line-height 14px
            margin-bottom 4px
            .count
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
            right 0
            bottom 18px
        .button-wrapper
          width 72px
          position: absolute
          bottom 18px
          right 0
          font-size 0
          .increase, .decrease-wrapper
            vertical-align top
            display inline-block
            height 24px
            width 24px
            /*line-height 24px*/
            font-size 24px
            text-align: center
            color #fff
            background-color #00a0dc
            border-radius 50%
            .decrease
              position relative
              top 3px
              height 18px
              width 18px
              background-color #fff
              border-radius 50%
              margin 0 auto
              line-height 18px
              color #00a0dc
              .icon
                position relative
                top -1px
                margin 0 auto
                line-height 15px
          .count
            font-size 10px
            color rgb(147, 153, 159)
            line-height 24px

  /*margin 0 5px*/

</style>
