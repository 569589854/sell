<template>
    <div class="star" :class="starType">
        <span v-for="starItem in itemClass" :class="starItem" class="star-item"></span>
    </div>
</template>
<script>
    const CLS_ON = 'on';
    const CLS_OFF = 'off';
    const CLS_HALF = 'half';
    const LENGTH = 5;
    export default{
        props:{
            score:{
                type:Number,
            },
            type:{
                type:Number,
            }
        },
        data(){
            return{

            }
        },
        components:{
            // 'component1':component1,
            // 'component2':component2,
            // 'component3':component3,
        },
        methods:{
            method1:function(){

            },
            method2:function(){

            },
        },
        computed:{
            starType(){
                return 'star-' + this.type;
            },
            itemClass(){
                let result = [];
                let score = Math.floor(this.score*2)/2
                let hasHalf = score%1 !== 0
                let on_length = parseInt(score)
                for(let i=0;i<on_length;i++){
                    result.push(CLS_ON);
                }
                if(hasHalf){
                    result.push(CLS_HALF);
                }
                while (result.length<LENGTH) {
                    result.push(CLS_OFF);
                }
                return result
            }
        }
    }
</script>
<style lang="stylus">
  @import '../../common/stylus/mixin.styl'
  .star
    // font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat  
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on')
        &.off
          bg-image('star48_off')
        &.half
          bg-image('star48_half')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('star36_on')
        &.off
          bg-image('star36_off')
        &.half
          bg-image('star36_half')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('star24_on')
        &.off
          bg-image('star24_off')
        &.half
          bg-image('star24_half')
</style>