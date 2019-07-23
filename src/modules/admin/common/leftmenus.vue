<template>
  <el-menu
    :unique-opened="true"
    :collapse="leftMenuCollapse"
    :default-active="defaultMenu.id ? defaultMenu.id : '1'"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor">
    <template v-for="menu in leftMenus">
      <el-submenu v-if="menu.child" :index="menu.id">
        <template slot="title">
          <i :class="menu.icon ? menu.icon : 'el-icon-location'"></i>
          <span>{{menu.title}}</span>
        </template>
        <template v-for="mm in menu.child">
          <el-submenu v-if="mm.child" :index="mm.id">
            <template slot="title">{{mm.title}}</template>
            <template v-for="mmm in mm.child">
              <el-menu-item :index="mmm.id" @click="handleClick(mmm)">{{mmm.title}}</el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item-group v-else>
            <el-menu-item :index="mm.id" @click="handleClick(mm)">{{mm.title}}</el-menu-item>
          </el-menu-item-group>
        </template>
      </el-submenu>
      <el-menu-item v-else :index="menu.id" @click="handleClick(menu)">
        <i :class="menu.icon ? menu.icon : 'el-icon-location'"></i>
        <span>{{menu.title}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
  import { Menu as ElMenu, MenuItem as ElMenuItem, MenuItemGroup as ElMenuItemGroup, Submenu as ElSubmenu } from 'element-ui'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        isCollapse: false,
        defaultActive: '1',
        backgroundColor: '#fff',
        textColor: 'black',
        activeTextColor: '#409EFF',
        menus: []
      }
    },
    components: {
      ElMenu, ElMenuItem, ElMenuItemGroup, ElSubmenu
    },
    computed: {
      ...mapGetters(['leftMenuCollapse', 'leftMenus', 'defaultMenu'])
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClick (menu) {
        this.$router.push({ name: menu.route })
      }
    }
  }
</script>
