<template>
  <div class="">
    <div v-if="poster_list">
      <el-table
        stripe
        :data="poster_list"
        border
        :height="poster_list && poster_list.length > 0 ? '600px' : '100px'"
        style="width: 100%">
        <template v-for="item in tableColumns">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : ''" :sortable="item.sortable ? item.sortable : false"></el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope" v-if="poster_list">
            <el-button @click="update(scope.$index, scope.row, 0)" type="text" size="small" v-if="parseInt(scope.row.poster_status) === 1">下架</el-button>
            <el-button @click="update(scope.$index, scope.row, 1)" type="text" size="small" v-if="parseInt(scope.row.poster_status) === 0">上架</el-button>
            <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="prescan(scope.$index, scope.row)" type="text" size="small">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <empty-content msg="暂无数据"></empty-content>
    </div>
    <div class="block" v-if="poster_list && poster_list.length > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="currentSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="回执状态"
      :visible.sync="dialogVisible"
      size="tiny"
    >
      <span>{{phoneStatus}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { APIS, H5DOMAIN } from '@config/APIS'

  export default {
    name: 'list',
    data () {
      return {
        poster_list: [],
        phoneStatus: '',
        dialogVisible: false,
        mobile: '',
        currentPage: 1,
        currentSize: 100,
        total: 0,
        tableColumns: [
          // 序号、海报标题、状态、模板、二维码、实际生成次数、创建时间、操作【下架、上架、编辑、删除】
          { prop: 'id', label: '序号', width: '100', sortable: true },
          { prop: 'title', label: '海报标题' },
          // {prop: 'poster_status', label: '是否上架', sortable: true},
          { prop: 'template', label: '模板' },
          { prop: 'qrcode_link', label: '二维码' },
          { prop: 'times', label: '实际生成次数', sortable: true },
          { prop: 'create_time', label: '创建时间', sortable: true },
          { prop: 'update_time', label: '更新时间', sortable: true }
        ]
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      prescan (index, row) {
        let url = H5DOMAIN + '/2017/postertemplate/' + row.template + '.html?token=58ad62a261104699b74d06d403d41666&id=' + row.id
        window.open(url)
      },
      getList () {
        this.$http.post(APIS.POST_POSTER_LIST).then(rs => {
          console.log(rs)
          this.poster_list = rs.result
        }, (err) => console.log(err))
      },
      edit (index, row) {
        this.$router.push({ name: 'admin.poster.edit', params: { id: row.id } })
      },
      update (index, row, status) {
        let data = { id: row.id, poster_status: status }
        if (status === 1) {
          data.start_time = parseInt(new Date().getTime() / 1000)
        }
        let success = rs => {
          this.$message({ message: '操作成功', type: 'success' })
          this.getList()
        }
        this.$store.dispatch('post_edit_poster', { data: data, success: success })
      },
      add () {
        this.$router.push({ name: 'EditPoster' })
      },
      handleClick () {
        console.log('handleClick')
      },
      handleSizeChange () {
        console.log('handleSizeChange')
      },
      handleCurrentChange () {
        console.log('handleCurrentChange')
      }
    }
  }
</script>

<style scoped>

</style>
