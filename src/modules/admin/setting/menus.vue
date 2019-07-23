<template>
    <div>
      <div class="">
        <search-com :forms="searchForms" :buttons="searchButtons" :search="search" @onSearchSubmit="onSearchSubmit"></search-com>
        <table-com :data="menusList.list" :max-height="maxHeight" :props="props" :handle-config="handleConfig" :handles="handles" style="width: 100%"></table-com>
        <page-com :total="menusList.total" :page-size="pageConfig.size" :current-page="pageConfig.current" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
      </div>
      <dialog-com @submit="dialogSubmit" :forms="forms" :dialog-config="dialogConfig"/>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { replace } from 'lodash'
  import TableCom from '@components/TableCom'
  import PageCom from '@components/PageCom'
  import SearchCom from '@components/SearchCom'
  import DialogCom from '../../../components/DialogCom'
  import { APIS } from '../../../config/APIS'

  export default {
    name: 'menus',
    components: {DialogCom, TableCom, PageCom, SearchCom },
    computed: {
      ...mapGetters(['menusList']),
      maxHeight () {
        return parseInt(replace(this.$store.getters.mainHeight, 'px', '')) - 200
      }
    },
    data () {
      return {
        props: [{ prop: 'id', label: 'ID', width: 80 }, { prop: 'parent_id', label: '父ID', width: 80, sortable: true }, { prop: 'menu_name', label: '菜单名' }, { prop: 'menu_url', label: '菜单路径' }, { prop: 'menu_status', label: '菜单状态', width: 80 }, { prop: 'create_time', label: '创建时间' }, { prop: 'update_time', label: '更新时间' }],
        handleConfig: { fixed: false, label: '操作', width: 320 },
        handles: [
          { title: '编辑', function: this.handleEdit, type: 'text', size: 'mini' },
          { title: '添加子菜单', function: this.addSubMenu, type: 'text', size: 'mini' },
        ],
        search: [],
        searchForms: [
          { placeholder: '父ID|菜单名', name: 'idmenu', type: 'input' }
        ],
        searchButtons: [
          { id: 1, title: '搜索', type: 'primary' },
          { id: 2, title: '添加主菜单', type: 'danger' }
        ],
        pageConfig: { size: 50, total: 50, current: 1 },
        dialogConfig: { visble: false, title: '编辑菜单' },
        formTpl: [
          { id: 10, label: '', type: '', name: 'id', value: '' },
          { id: 1, label: '菜单名', type: 'input', name: 'menu_name', value: '' },
          { id: 2, label: '菜单路径', type: 'input', name: 'menu_url', value: '' },
          { id: 2, label: '菜单图标', type: 'input', name: 'menu_icon', value: '' },
          { id: 3, label: '菜单状态', type: 'radio', name: 'menu_status', value: 1, radios: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] }
        ],
        forms: []
      }
    },
    mounted () {
      this.getMenuList()
    },
    methods: {
      getMenuList (search = '') {
        let param = { page: this.pageConfig.current, size: this.pageConfig.size }
        if (search) {
          param.search = search
        } else if (this.search) {
          param.search = this.search['idmenu']
        }
        this.$store.dispatch('getMenuList', param)
      },
      handleSizeChange (data) {
        this.pageConfig.size = data
        this.getMenuList()
      },
      handleCurrentChange (data) {
        this.pageConfig.current = data
        this.getMenuList()
      },
      handleEdit (index, row) {
        this.dialogConfig = { visble: true, title: '编辑菜单' }
        this.forms = this.formatForms(row)
      },
      formatForms (row) {
        let ret = []
        this.formTpl.map(value => {
          let name = value.name
          let tmp = value
          if (name === 'menu_status') {
            tmp.value = (row[name] === '禁用' ? 0 : 1)
          } else {
            tmp.value = row[name]
          }
          ret.push(tmp)
        })
        return ret
      },
      addSubMenu (index, row) {
        this.dialogConfig = { visble: true, title: '添加子菜单' }
        let tmp = [
          { id: 4, label: '父菜单', type: 'input', name: 'parent_name', value: row.menu_name },
          { id: 5, label: '', type: '', name: 'parent_id', value: row.id }
        ]
        this.forms = _.concat(this.formatForms([]), tmp)
      },
      onSearchSubmit (search, button) {
        if (button.id === 2) {
          // 添加菜单
          this.dialogConfig = { visble: true, title: '添加根菜单' }
          this.forms = this.formatForms([])
          return
        }
        this.getMenuList(search['idmenu'])
      },
      async dialogSubmit (form) {
        let data = {}
        form.forEach(v => {
          data[v.name] = v.value
        })
        let rs = {}
        if (!_.isEmpty(data['parent_id'])) {
          // 添加子菜单
          rs = await this.$http.post(APIS.POST_ADD_MENU, data)
        } else if (!_.isEmpty(data['id'])) {
          // 编辑菜单
          rs = await this.$http.post(APIS.POST_EDIT_MENU, data)
        } else {
          // 添加主菜单
          rs = await this.$http.post(APIS.POST_ADD_MENU, data)
        }
        if (rs.code === 0) {
          this.$message.success('操作成功')
          this.dialogConfig.visble = false
          this.getMenuList()
        } else {
          this.$message.error(rs.msg)
        }
      }
    }
  }
</script>

<style scoped>

</style>
