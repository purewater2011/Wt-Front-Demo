<template>
  <div id="wrapper" class="h-100" :class="{toggled: isToggled}">
    <div id="page-content-wrapper" class="w-100 position-absolute">
      <navbar v-if="shouldShowNavbar" />
      <div class="main-content" :class="{withContainer}">
        <router-view />
      </div>
    </div>
    <div class="position-absolute w-100 h-100 bg-white opacity-70" v-if="isToggled" @click="toggle"></div>
    <div class="back-to-top" ref="backToTopLayer">
      <a class="btn btn-icon btn-secondary text-20" href="javascript:" @click="scrollToTop" data-toggle="tooltip" data-placement="top" title="返回顶部">
        <arrow-up-icon /></a>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Navbar from '@components/navbar'
  import Sidebar from '@components/sidebar'
  import ArrowUpIcon from '@icons/arrow-up'

  export default {
    name: 'app',
    components: {
      Navbar,
      Sidebar,
      ArrowUpIcon
    },
    computed: {
      ...mapGetters(['currentUser', 'isToggled']),
      checkParams () {
        return this.$route.query['active-success'] === 'yes'
      },
      shouldShowNavbar () {
        return (
          typeof this.$route.meta['navbar'] === 'undefined' ||
          !!this.$route.meta['navbar']
        )
      },
      withContainer () {
        if (typeof this.$route.meta['container'] !== 'undefined') {
          return !!this.$route.meta['container']
        }

        return true
      }
    },
    methods: {
      ...mapActions(['toggle']),
      sendActiveMail () {
        this.$http.post('user/send-active-mail').then(data => {
          this.$message.success(data.message)
        })
      },
      scrollToTop () {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
    },
    mounted () {
      setTimeout(() => {
        window.addEventListener('scroll', () => {
          if (
            document.body.scrollTop > 400 ||
            document.documentElement.scrollTop > 400
          ) {
            this.$refs['backToTopLayer'].style.display = 'block'
          } else {
            this.$refs['backToTopLayer'].style.display = 'none'
          }
        })
      }, 1000)
    }
  }
</script>

<style lang="scss">
  .back-to-top {
    display: none;
    position: fixed;
    bottom: 30px;
    right: 50px;
  }
</style>
