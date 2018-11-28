<template>
  <div class="bg-white bg-white shadow-6 sticky-top">
    <div class="">
      <nav class="navbar px-0 py-1 text-14 navbar-expand-lg navbar-light">
        <router-link :to="{ name: 'home' }" class="navbar-brand text-22 d-flex align-items-center antialiased">
          <img class="mr-2 avatar-40" src="/logo.svg" alt="开发者联盟">开发者<span class="text-14 text-muted ml-1">| 商家好助手</span><sup class="ml-1 text-10 text-danger"> Hot</sup> </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav flex-row align-items-center justify-content-center py-sm-2 py-md-0 mx-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">客户案例</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">服务支持</a>
            </li>
          </ul>

          <ul class="navbar-nav ml-md-auto flex-row d-md-flex align-items-center justify-content-around">
            <template v-if="isLogged">
              <!--<li class="nav-item">
                <router-link :to="{ name: 'threads.create' }" exact class="text-20 btn btn-icon btn-transparent btn-light">
                  <plus-icon></plus-icon>
                </router-link>
              </li>-->
              <li class="nav-item nav-item-icon">
                <router-link :to="{ name: 'notifications.show' }" class="text-20 btn btn-icon btn-transparent btn-light">
                  <bell-icon />
                </router-link>
              </li>
              <li class="nav-item">
                <div class="btn-group">
                  <a href="#" class="dropdown-toggle cursor-pointer" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img :src="currentUser.avatar" class="avatar-40 mr-2" />
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <div class="dropdown-item">
                      <div class="text-16 text-gray-30">{{ currentUser.name }}</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item">
                      <span @click.native="setLeftMenuCollpose">{{ leftMenuCollapse ? '展开' : '收起'}}菜单</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <!--<router-link class="dropdown-item" :to="{ name: 'users.show', params: { username: currentUser.username } }" exact>
                      <account-icon class="mr-1"></account-icon>
                      个人中心
                    </router-link>-->
                    <router-link class="dropdown-item" :to="{ name: 'admin.home' }" exact>
                      <account-icon class="mr-1"></account-icon>
                      管理后台
                    </router-link>
                    <router-link class="dropdown-item" :to="{ name: 'user.profile' }" exact>
                      <account-edit-icon class="mr-1"></account-edit-icon>
                      编辑资料
                    </router-link>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="javascript:void(0);" @click="logout">
                      <logout-variant class="mr-1"></logout-variant>
                      退出登录
                    </a>
                  </div>
                </div>
              </li>
            </template>
            <template v-else>
              <router-link :to="{ name: 'auth.login' }" tag="li" class="nav-item"><el-button size="medium" style="outline: none;">登录</el-button></router-link>
              <router-link :to="{ name: 'auth.register' }" tag="li" class="nav-item"><el-button type="primary" size="medium" style="outline: none;">免费注册</el-button></router-link>
            </template>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
  import MenuIcon from '@icons/menu'
  import BellIcon from '@icons/bell'
  import PlusIcon from '@icons/plus'
  import MagnifyIcon from '@icons/magnify'
  import AccountIcon from '@icons/account'
  import AccountEditIcon from '@icons/account-edit'
  import LogoutVariant from '@icons/logout-variant'
  import { mapGetters, mapActions } from 'vuex'
  import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'

  export default {
    components: {
      MenuIcon,
      BellIcon,
      PlusIcon,
      AccountIcon,
      MagnifyIcon,
      AccountEditIcon,
      LogoutVariant,
      Dropdown,
      DropdownMenu,
      DropdownItem
    },
    computed: {
      ...mapGetters(['leftMenuCollapse', 'isLogged', 'currentUser'])
    },
    methods: {
      ...mapActions(['logout', 'toggle', 'setLeftMenuCollapse'])
    }
  }
</script>

<style lang="scss">
  .navbar-nav .nav-item {
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
