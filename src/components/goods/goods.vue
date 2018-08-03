<template>
    <div class="goods">
        <div class="menu-wrapper"></div>
        <div class="content-wrapper"></div>
    </div>
</template>
<script>
  export default{
    props:{
     seller:{
      type:Object,
     } 
    },
    data(){
      return{

      }
    }
  }
</script>
<style lang="stylus">
  .goods
    position absolute
    display flex
    top 134px
    bottom 58px
</style>