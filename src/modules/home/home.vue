<template>
  <div class="home">
    <div class="body">
      <div class="banner">
        <carousel height="550px">
          <carousel-item v-for="item in 4" :key="item">
            <h3>{{ item }}</h3>
          </carousel-item>
        </carousel>
      </div>
      <div class="home-banner">
        <div class="container">
        <el-row class="row" justify="center">
          <el-col :offset="11">标题</el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
        </el-row>
        <el-row justify="center">
          <el-col :span="8" :offset="4">
            说明
          </el-col>
          <el-col :span="8" :offset="4">
            图片
          </el-col>
        </el-row>
        </div>
      </div>
      <div class="home-company">
        <div class="container">
        <el-row class="row" justify="center">
          <el-col :offset="11">他们也在用</el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
          <el-col :span="4">功能点1</el-col>
        </el-row>
        </div>
      </div>
      <div class="home-footer">
        <el-row class="container">
          <el-col :span="8" :offset="4">
            联系我们
            <el-row>
              <el-col>手机</el-col>
              <el-col>邮箱</el-col>
              <el-col>微信</el-col>
              <el-col>QQ</el-col>
              <el-col>微博</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            微信公众号
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, CarouselItem, Card } from 'element-ui'
export default {
  data () {
    return {
      threads: {
        default: {},
        featured: {},
        zeroComment: {},
        recent: {}
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  components: {
    Card, Carousel, CarouselItem
  },
  watch: {
    currentThreadsTab () {
      this.loadThreads(1)
    }
  },
  methods: {
    loadThreads (page = 1) {
      this.$http
        .get(`threads?tab=${this.currentThreadsTab}&page=${page}`)
        .then(threads => (this.threads[this.currentThreadsTab] = threads))
    },
    handlePageChanged (page) {
      this.loadThreads(page)
    }
  },
  mounted () {
    this.loadThreads()
  }
}
</script>

