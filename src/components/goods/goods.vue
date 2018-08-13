<template>
    <div class="goods">
        <div class="menu-wrapper">
          <ul>
            <li class="menu-item" v-for="item in goods">
              <span class="text border-1px">
                <span v-show="item.type>0" class="icon" :class="classList[item.type]"></span>{{item.name}}
              </span>
            </li>
          </ul>
        </div>
        <div class="content-wrapper"></div>
    </div>
</template>
<script>
  import axios from 'axios'
  export default{
    props:{
     seller:{
      type:Object,
     } 
    },
    data(){
      return{
        goods: [],
        classList: []
      }
    },
    created() {
      this.classList = ['decrease','discount','special','invoice','guarantee'];
      axios.get('/api/goods')
      .then(res => {
        this.goods = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
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
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background-color #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      .text
        font-size 12px
        line-height 14px
        display table-cell
        vertical-align middle
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
          
  .content-wrapper
    flex 1
</style>