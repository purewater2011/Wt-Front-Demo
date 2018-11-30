<template>
  <div class="page-user-show">
    <admin-navbar v-if="shouldShowAdminNavbar" />
    <div class="row">
      <div class="col-md-2">
        <leftmenus />
      </div>
      <div class="col-md-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Leftmenus from '@modules/admin/common/leftmenus'
  import AdminNavbar from '@modules/admin/common/adminnavbar'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'show',
    components: { Leftmenus, AdminNavbar },
    computed: {
      ...mapGetters(['currentUser']),
      shouldShowAdminNavbar () {
        return (
          typeof this.$route.meta['adminnavbar'] === 'undefined' ||
          !!this.$route.meta['adminnavbar']
        )
      }
    },
    methods: {
      ...mapActions(['checkMenuStatus'])
    }
  }
</script>
