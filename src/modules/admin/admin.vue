<template>
  <div class="page-user-show">
    <admin-navbar v-if="shouldShowAdminNavbar" />
    <el-container :style="{height: windowHeight}">
      <el-aside :width="asideWidth">
        <leftmenus />
      </el-aside>
      <el-container>
        <el-header height="35px"><tagviews /></el-header>
        <el-main style="background-color: white;margin: 5px;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Leftmenus from '@modules/admin/common/leftmenus'
  import AdminNavbar from '@modules/admin/common/adminnavbar'
  import { mapGetters, mapActions } from 'vuex'
  import { Aside as ElAside, Main as ElMain, Container as ElContainer, Header as ElHeader } from 'element-ui'
  import Tagviews from './common/tagviews'

  export default {
    name: 'show',
    components: { Tagviews, Leftmenus, AdminNavbar, ElAside, ElMain, ElContainer, ElHeader },
    data () {
      return {
        windowHeight: `${document.body.clientHeight - 64}px`
      }
    },
    computed: {
      ...mapGetters(['currentUser', 'leftMenuCollapse']),
      shouldShowAdminNavbar () {
        return (
          typeof this.$route.meta['adminnavbar'] === 'undefined' ||
          !!this.$route.meta['adminnavbar']
        )
      },
      asideWidth () {
        if (this.leftMenuCollapse) {
          return '80px'
        } else {
          return '200px'
        }
      }
    },
    async mounted () {
      const that = this
      this.$store.dispatch('checkMenu', this.$route)
      this.$store.dispatch('setMainHeight', this.windowHeight)
      window.onresize = () => {
        return (() => {
          that.windowHeight = `${document.body.clientHeight - 64}px`
          this.$store.dispatch('setMainHeight', this.windowHeight)
        })()
      }
    },
    methods: {
      ...mapActions(['checkMenuStatus', 'setMainHeight'])
    }
  }
</script>
<style lang="scss">
  .el-header {
    padding: 0;
  }
</style>
