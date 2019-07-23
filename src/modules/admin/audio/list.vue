<template>
  <div class="el-main">
    <div>
      <el-form :inline="true">
        <el-form-item label="搜索条件">
          <el-select v-model="selectedSystemid" clearable filterable placeholder="请选择系统" @change="getList">
            <el-option :value='item.systemid' :label="item.name" v-for="item in syslist" :key="item.systemid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="selectedType" clearable placeholder="请选择类目" @change="getList">
            <el-option :value='item.key' :label="item.name" v-for="item in categorys" :key="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-popover
            ref="delpop"
            placement="bottom"
            width="160"
            v-model="showDelPop">
            <p>确定批量删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="showDelPop = false">取消</el-button>
              <el-button type="primary" size="mini" @click="showDelPop = false, del()">确定</el-button>
            </div>
            <el-button type="danger" v-if="showDel" @click="showDelPop = !showDelPop" slot="reference">批量删除</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-popover
            ref="publishpop"
            placement="bottom"
            width="160"
            v-model="showPublishPop">
            <p>确定批量发布吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="showPublishPop = false">取消</el-button>
              <el-button type="primary" size="mini" @click="showPublishPop = false, publish()">确定</el-button>
            </div>
            <el-button type="info" v-if="showPublish" @click="showPublishPop = !showPublishPop" slot="reference">批量发布</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <br>
    <div v-if="list.list">
      <el-table
        :data="list.list"
        border
        :height="list.list && list.list.length > 0 ? 600 : ''"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <template v-for="item in tableColumns">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : ''" :sortable="item.sortable ? item.sortable : false"></el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope" v-if="syslist">
            <el-button @click="handleClick(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <empty-content msg="暂无数据"></empty-content>
    </div>
    <div class="block" v-if="list.list">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[50, 100, 200, 300, 400]"
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
  import { APIS } from '@config/APIS'
  import { mapGetters } from 'vuex'

  export default {
    name: 'audio-list',
    data () {
      return {
        list: [],
        phoneStatus: '',
        selectedSystemid: '',
        selectedType: '',
        dialogVisible: false,
        selected: '',
        showDel: false,
        showDelPop: false,
        showPublish: false,
        showPublishPop: false,
        mobile: '',
        currentPage: 1,
        currentSize: 100,
        total: 0,
        categorys: [{ key: '2', name: '科目二自带语音' }, { key: '31', name: '科目三自带灯光' }, { key: '32', name: '科目三自带语音' }, { key: '34', name: '科目三自带灯光指令' }],
        tableColumns: [
        // 序号、海报标题、状态、模板、二维码、实际生成次数、创建时间、操作【下架、上架、编辑、删除】
          { prop: 'id', label: '序号', width: '100', sortable: true },
          { prop: 'defaulttitle', label: '是否发布', sortable: true },
          { prop: 'title', label: '模板标题' },
          { prop: 'content', label: '内容' },
          { prop: 'sys_name', label: '系统名称', sortable: true }
        ]
      }
    },
    computed: {
      ...mapGetters({
        syslist: 'systemList'
      })
    },
    mounted () {
      this.getList()
      this.getSysList()
    },
    methods: {
      getSysList () {
        this.$store.dispatch('getSysList')
      },
      add () {
        this.$router.push({ name: 'admin.audio.add' })
      },
      publish () {
        if (this.selected) {
          let ids = this.selected.map(value => {
            return value.id
          })
          let data = {
            data: { ids: ids },
            success: rs => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getList()
            }
          }
          this.$http.post(APIS.POST_BATCH_PUBLISH_TPL, data.data).then(data.success)
        }
      },
      del () {
        if (this.selected) {
          let ids = this.selected.map(value => {
            return value.id
          })
          let data = {
            data: { ids: ids },
            success: rs => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getList()
            }
          }
          this.$http.post(APIS.POST_BATCH_DEL_TPL, data.data).then(data.success)
        }
      },
      handleSelectionChange (val) {
        if (val && val.length > 0) {
          this.showDel = true
          this.showPublish = true
          this.selected = val
        } else {
          this.showDel = false
          this.showPublish = false
          this.selected = ''
        }
      },
      handleClick (index, row) {
        this.$router.push({ name: 'admin.audio.edit', params: { id: row.id } })
      },
      handleSizeChange (value) {
        this.currentSize = value
        this.getList()
      },
      handleCurrentChange (value) {
        this.currentPage = value
        this.getList()
      },
      getList () {
        let sysid = this.selectedSystemid
        let type = this.selectedType
        let data = { ys_id: sysid, page: this.currentPage, size: this.currentSize, type: type }
        this.$http.post(APIS.POST_AUDIO_LIST, data).then((rs) => {
          this.total = rs.result.total
          this.list = rs.result
        })
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
