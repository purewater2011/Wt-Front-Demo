<template>
  <div class="container">
    <span class="content" v-html="msg"></span>
  </div>
</template>
<script>
  export default {
    name: 'EmptyContent',
    props: {
      msg: String
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    text-align: center;
  }
  .content {
    font-size: 15px;
    color: #99A9BF;
    margin-top: 30px;
  }
</style>
