<template>
    <div class="">
      <search-com :forms="searchForms" @onSearchSubmit="onSearchSubmit"></search-com>
      <table-com :data="userList.list" :max-height="maxHeight" :props="props" :handle-config="handleConfig" :handles="handles" style="width: 100%"></table-com>
      <page-com :total="userList.total" :page-size="pageConfig.size" :current-page="pageConfig.current" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />

      <dialog-com @submit="dialogSubmit" :forms="forms" :dialog-config="dialogConfig">
        <template slot="other" v-if="dialogConfig.showOther">
          <div>
            <el-tree
              v-if="rolelist"
              ref="tree"
              highlight-current
              :data="rolelist"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="checkedRoles"
              :props="defaultProps">
            </el-tree>
          </div>
        </template>
      </dialog-com>
    </div>
</template>

<script>
  import { replace } from 'lodash'
  import { mapGetters } from 'vuex'
  import TableCom from '@components/TableCom'
  import PageCom from '@components/PageCom'
  import SearchCom from '../../../components/SearchCom'
  import DialogCom from '../../../components/DialogCom'
  import { APIS } from '../../../config/APIS'

  export default {
    name: 'users',
    components: { SearchCom, PageCom, TableCom, DialogCom },
    computed: {
      ...mapGetters(['userList']),
      maxHeight () {
        return parseInt(replace(this.$store.getters.mainHeight, 'px', '')) - 200
      }
    },
    data () {
      return {
        rolelist: [],
        checkedRoles: [],
        defaultProps: {
          children: 'child',
          label: 'role_name'
        },
        forms: [],
        formTpl: [
          { id: 10, label: '', type: '', name: 'id', value: '' },
          { id: 1, label: '角色名', type: 'input', name: 'role_name', value: '' },
          { id: 2, label: '角色描述', type: 'input', name: 'role_desc', value: '' },
          { id: 3, label: '状态', type: 'radio', name: 'role_status', value: 1, radios: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] }
        ],
        props: [{ prop: 'id', label: 'ID', width: 80 },{ prop: 'display_name', label: '姓名' }, { prop: 'user_phone', label: '手机号' }, { prop: 'latest_login_time', label: '上次登录时间', sortable: true }, { prop: 'user_status', label: '用户状态' }, { prop: 'create_time', label: '创建时间' }, { prop: 'update_time', label: '更新时间' }],
        handleConfig: { fixed: false, label: '操作', width: 120 },
        handles: [
          { title: '分配角色', function: this.handleEdit, type: 'text', size: 'mini' }
        ],
        searchForms: [
          { placeholder: '姓名|手机号', name: 'namephone', type: 'input' }
        ],
        pageConfig: { size: 50, total: 50, current: 1 },
        dialogConfig: { visble: false, title: '编辑', showOther: false, hideForm: false }
      }
    },
    mounted () {
      this.getUserList()
    },
    methods: {
      getUserList (search = '') {
        let param = { page: this.pageConfig.current, size: this.pageConfig.size }
        if (search) {
          param.search = search
        }
        this.$store.dispatch('getUserList', param)
      },
      handleSizeChange (data) {
        this.pageConfig.size = data
      },
      handleCurrentChange (data) {
        this.pageConfig.current = data
      },
      async handleEdit (index, row) {
        let userinfo = await this.$store.dispatch('getUserDetail', { id: row.id })
        let data = await this.$store.dispatch('getRoleList')
        this.checkedRoles = userinfo.data.roleids
        this.rolelist = data.list
        this.dialogConfig = { visble: true, title: '分配角色', showOther: true, hideForm: true }
        this.forms = this.formatForms(row)
      },
      onSearchSubmit (search, button) {
        this.getUserList(search['namephone'])
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
      async dialogSubmit (form) {
        console.log(form)
        let data = {}
        form.forEach(v => {
          data[v.name] = v.value
        })
        let rs = {}
        let roleIds = this.$refs.tree.getCheckedKeys()
        if (_.isEmpty(roleIds)) {
          this.$message.error('请选择角色')
          return
        }
        rs = await this.$http.post(APIS.POST_DISTRI_ROLES, { user_id: data.id, role_ids:  roleIds })
        if (rs.code === 0) {
          this.$message.success('操作成功')
          this.dialogConfig.visble = false
          this.getUserList()
        } else {
          this.$message.error(rs.msg)
        }
      }
    }
  }
</script>

<style scoped>

</style>
