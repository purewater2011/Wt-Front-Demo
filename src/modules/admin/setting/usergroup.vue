<template>
  <div>
    <div class="">
      <search-com :forms="searchForms" :buttons="searchButtons" @onSearchSubmit="onSearchSubmit"></search-com>
      <table-com :data="roleList.list" :max-height="maxHeight" :props="props" :handle-config="handleConfig" :handles="handles" style="width: 100%"></table-com>
      <page-com :total="roleList.total" :page-size="pageConfig.size" :current-page="pageConfig.current" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
    </div>
    <dialog-com @submit="dialogSubmit" :forms="forms" :dialog-config="dialogConfig">
      <template slot="other" v-if="dialogConfig.showOther">
        <div>
          <el-tree
            v-if="data2"
            ref="tree"
            highlight-current
            :data="data2"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="checkedMenus"
            :props="defaultProps">
          </el-tree>
        </div>
      </template>
    </dialog-com>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { replace } from 'lodash'
  import TableCom from '@components/TableCom'
  import PageCom from '@components/PageCom'
  import SearchCom from '@components/SearchCom'
  import DialogCom from '@components/DialogCom'
  import { APIS } from '../../../config/APIS'

  export default {
    name: 'usergroup',
    components: { TableCom, PageCom, SearchCom, DialogCom },
    computed: {
      ...mapGetters(['roleList']),
      maxHeight () {
        return parseInt(replace(this.$store.getters.mainHeight, 'px', '')) - 200
      }
    },
    data () {
      return {
        props: [{ prop: 'id', label: 'ID', width: 80 }, { prop: 'role_name', label: '角色名' }, { prop: 'role_desc', label: '角色描述' }, { prop: 'role_status', label: '状态', width: 80 }, { prop: 'create_time', label: '创建时间' }, { prop: 'update_time', label: '更新时间' }],
        handleConfig: { fixed: false, label: '操作', width: 120 },
        handles: [
          { title: '编辑', function: this.handleEdit, type: 'text', size: 'mini' },
          { title: '分配菜单', function: this.destriMenus, type: 'text', size: 'mini' },
        ],
        searchForms: [
          { placeholder: '角色名', name: 'rolename', type: 'input' }
        ],
        searchButtons: [
          { id: 1, title: '搜索', type: 'primary' },
          { id: 2, title: '添加角色', type: 'danger' }
        ],
        pageConfig: { size: 50, total: 50, current: 1 },
        dialogConfig: { visble: false, title: '编辑', showOther: false, hideForm: false },
        formTpl: [
          { id: 10, label: '', type: '', name: 'id', value: '' },
          { id: 1, label: '角色名', type: 'input', name: 'role_name', value: '' },
          { id: 2, label: '角色描述', type: 'input', name: 'role_desc', value: '' },
          { id: 3, label: '状态', type: 'radio', name: 'role_status', value: 1, radios: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] }
        ],
        forms: [],
        data2: [],
        checkedMenus: [],
        defaultProps: {
          children: 'child',
          label: 'menu_name'
        }
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      getList (search = '') {
        let param = { page: this.pageConfig.current, size: this.pageConfig.size }
        if (search) {
          param.search = search
        }
        this.$store.dispatch('getRoleList', param)
      },
      handleSizeChange (data) {
        this.pageConfig.size = data
        this.getList()
      },
      handleCurrentChange (data) {
        this.pageConfig.current = data
        this.getList()
      },
      handleEdit (index, row) {
        this.dialogConfig = { visble: true, title: '编辑角色' }
        this.forms = this.formatForms(row)
      },
      async destriMenus (index, row) {
        let rolemenus = await this.$store.dispatch('getRoleMenuList', { id: row.id })
        if (_.isEmpty(rolemenus['menus'])) {
          this.checkedMenus = []
        } else {
          this.checkedMenus = rolemenus['menus'].map(v => v['id'])
        }
        // 分配菜单
        this.dialogConfig = { visble: true, title: '分配菜单', showOther: true, hideForm: true }
        this.forms = this.formatForms(row)
        this.data2 = await this.formatMenus()
      },
      onSearchSubmit (search, button) {
        if (button.id === 2) {
          // 添加角色
          this.dialogConfig = { visble: true, title: '添加角色', showOther: false, hideForm: false }
          this.forms = this.formatForms([])
          return
        }
        this.getList(search['rolename'])
      },
      async dialogSubmit (form) {
        let data = {}
        form.forEach(v => {
          data[v.name] = v.value
        })
        let rs = {}
        if (!_.isEmpty(this.$refs.tree)) {
          // 分配菜单
          console.log('分配菜单', data, this.$refs.tree.getCheckedNodes(), this.$refs.tree.getCheckedKeys())
          let menuIds = this.$refs.tree.getCheckedKeys()
          if (_.isEmpty(menuIds)) {
            this.$message.error('请选择菜单')
            return
          }
          rs = await this.$http.post(APIS.POST_DISTRI_MENU, { role_id: data.id, menu_ids:  menuIds })
        } else if (!_.isEmpty(data['id'])) {
          // 编辑角色
          rs = await this.$http.post(APIS.POST_EDIT_ROLE, data)
          console.log('编辑角色', data)
        } else if (!_.isEmpty(data)) {
          // 添加角色
          rs = await this.$http.post(APIS.POST_ADD_ROLE, data)
        }
        if (rs.code === 0) {
          this.$message.success('操作成功')
          this.dialogConfig.visble = false
          this.getList()
        } else {
          this.$message.error(rs.msg)
        }
      },
      formatForms (row) {
        let ret = []
        this.formTpl.map(value => {
          let name = value.name
          let tmp = value
          if (name === 'role_status') {
            tmp.value = (row[name] === '禁用' ? 0 : 1)
          } else {
            tmp.value = row[name]
          }
          ret.push(tmp)
        })
        return ret
      },
      async formatMenus () {
        let data = await this.$store.dispatch('getMenuList', { page: 1, size: 999 })
        let menus = data.list
        let base = _.groupBy(menus, { parent_id: '0' })
        let baseTrue = base[true]
        let baseFalse = base[false]
        _.forEach(baseTrue, (value, key) => {
          let base2 = _.groupBy(baseFalse, { parent_id: value.id })
          baseTrue[key]['child'] = base2[true]
          if (base2[false]) {
            _.forEach(base2[true], (vv, kk) => {
              let base3 = _.groupBy(base2[false], { parent_id: vv.id })
              if (base3[true]) {
                baseTrue[key]['child'][kk]['child'] = base3[true]
              }
            })
          }
        })
        console.log('formatmenus', baseTrue)
        return baseTrue
      }
    }
  }
</script>

<style scoped>

</style>
