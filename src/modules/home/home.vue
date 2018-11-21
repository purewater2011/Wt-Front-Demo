<template>
  <div class="page-home">

    <div class="row mt-3">
      <div class="col-md-9">
        <div class="box box-flush">
          <div class="box-body">
            <!--<ul class="nav nav-pills">
              <li class="nav-item">
                <a class="nav-link" :class="{active: currentThreadsTab == 'default'}" href="javascript:;" @click="currentThreadsTab = 'default'">活跃</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{active: currentThreadsTab == 'featured'}" href="javascript:;" @click="currentThreadsTab = 'featured'">精选</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{active: currentThreadsTab == 'zeroComment'}" href="javascript:;" @click="currentThreadsTab = 'zeroComment'">零回复</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{active: currentThreadsTab == 'recent'}" href="javascript:;" @click="currentThreadsTab = 'recent'">最新发布</a>
              </li>
            </ul>-->
              首页内容
          </div>
          <threads-list :threads="threads[currentThreadsTab]" @page-changed="handlePageChanged"></threads-list>
        </div>
      </div>
      <div class="col-md-3">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      threads: {
        default: {},
        featured: {},
        zeroComment: {},
        recent: {}
      },
      currentThreadsTab: 'default'
    }
  },
  components: {},
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
