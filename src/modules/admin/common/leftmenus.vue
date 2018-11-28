<template>
  <el-menu
    :collapse="isCollapse"
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor">
    <template v-for="menu in menus">
      <el-submenu v-if="menu.child" :index="menu.id">
        <template slot="title">
          <i :class="menu.icon ? menu.icon : 'el-icon-location'"></i>
          <span>{{menu.title}}</span>
        </template>
        <template v-for="mm in menu.child">
          <el-submenu v-if="mm.child" :index="mm.id">
            <template slot="title">{{mm.title}}</template>
            <template v-for="mmm in mm.child">
              <el-menu-item :index="mmm.id">{{mmm.title}}</el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item-group v-else>
            <el-menu-item :index="mm.id">{{mm.title}}</el-menu-item>
          </el-menu-item-group>
        </template>
      </el-submenu>
      <el-menu-item v-else :index="menu.id">
        <i :class="menu.icon ? menu.icon : 'el-icon-location'"></i>
        <span>{{menu.title}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
  import { Menu as ElMenu, MenuItem as ElMenuItem, MenuItemGroup as ElMenuItemGroup, Submenu as ElSubmenu } from 'element-ui'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        isCollapse: false,
        defaultActive: '5',
        backgroundColor: '#fff',
        textColor: 'black',
        activeTextColor: 'blue',
        menus: [
          {id: '1', icon: 'el-icon-menu', title: 'menu1', route: '', child: [{id: '2', title: 'submenu1-1'}, {id: '3', title: 'submenu1-2'}, {id: '4', title: 'submenu1-3', child: [{id: '5', title: 'submenu1-3-1'}]}]},
          {id: '6', icon: 'el-icon-location', title: 'menu2', route: ''},
          {id: '7', icon: 'el-icon-document', title: 'menu3', route: ''},
          {id: '8', icon: 'el-icon-setting', title: 'menu4', route: ''}
        ]
      }
    },
    components: {
      ElMenu, ElMenuItem, ElMenuItemGroup, ElSubmenu
    },
    computed: {
      ...mapGetters(['leftMenuCollapse'])
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
