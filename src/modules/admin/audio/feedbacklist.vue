<template>
  <div class="el-main">
    <el-form :inline="true">
      <el-form-item label="搜索条件">
        <el-input placeholder="请输入考场名称" v-model="name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="selectedStatus" clearable placeholder="请选择状态" @change="getList">
          <el-option :value='item.key' :label="item.name" v-for="item in status" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="selectedSource" clearable placeholder="请选择来源" @change="getList">
          <el-option :value='item.key' :label="item.name" v-for="item in sources" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-cascader
          v-model="newselectedCity"
          placeholder="请选择省份/城市"
          :options="provinces"
          filterable
          clearable
          :debounce="500"
          change-on-select
          @change="handleItemChange"
          :props="props"
        ></el-cascader>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <div v-if="list.list">
      <el-table
        :data="list.list"
        border
        :height="list.list && list.list.length > 0 ? 600 : 100"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <template v-for="item in tableColumns">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : ''" :sortable="item.sortable ? item.sortable : false" v-if="item.prop === 'status'" :formatter="formatter"></el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : ''" :sortable="item.sortable ? item.sortable : false" v-else-if="item.prop === 'source'" :formatter="formatterSource"></el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width ? item.width : ''" :sortable="item.sortable ? item.sortable : false" v-else></el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope" v-if="list.list">
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
        :page-size.sync="currentSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { APIS } from '@config/APIS'
  import { split, join, groupBy, forEach, indexOf, find, toArray } from 'lodash'

  export default {
    name: 'feedback-list',
    data () {
      return {
        provinces: [],
        props: {
          label: '_name',
          value: '_name',
          children: 'cities'
        },
        list: { list: [] },
        selectedStatus: '',
        selectedSource: '',
        selectedCity: '',
        newselectedCity: [],
        currentPage: 1,
        currentSize: 100,
        total: 0,
        name: '',
        status: [{ key: '0', name: '待处理' }, { key: '1', name: '受理中' }, { key: '2', name: '已解决' }, { key: '3', name: '已关闭' }],
        sources: [{ key: '1', name: '超级教练' }, { key: '3', name: '小程序' }],
        citys: [],
        tableColumns: [
          // 序号、海报标题、状态、模板、二维码、实际生成次数、创建时间、操作【下架、上架、编辑、删除】
          { prop: 'id', label: '序号', width: '100', sortable: true },
          { prop: 'source', label: '来源', sortable: true },
          { prop: 'city', label: '城市', sortable: true },
          { prop: 'exam_room', label: '考场名称' },
          { prop: 'system', label: '系统名称' },
          { prop: 'rule', label: '灯光规则' },
          { prop: 'content', label: '其他说明' },
          { prop: 'status', label: '状态' },
          { prop: 'remark', label: '客服备注' },
          { prop: 'create_at', label: '提交时间', sortable: true }
        ]
      }
    },
    computed: {},
    async mounted () {
      this.currentPage = window.localStorage.getItem('audioCurrentPage') ? parseInt(window.localStorage.getItem('audioCurrentPage')) : 1
      this.currentSize = window.localStorage.getItem('audioCurrentSize') ? parseInt(window.localStorage.getItem('audioCurrentSize')) : 100
      this.selectedStatus = window.localStorage.getItem('audioselectedStatus') ? window.localStorage.getItem('audioselectedStatus') : ''
      this.selectedSource = window.localStorage.getItem('selectedSource') ? window.localStorage.getItem('selectedSource') : ''
      this.selectedCity = window.localStorage.getItem('selectedCity') ? window.localStorage.getItem('selectedCity') : ''
      this.newselectedCity = split(this.selectedCity, '/')
      await this.getCityList()
      this.getList()
    },
    methods: {
      async getCityList () {
        let rs = await this.$http.get(APIS.GET_CITY_LIST)
        this.citys = rs.result.list
        const province = groupBy(this.citys, '_province')
        forEach(province, (value, key) => {
          this.provinces.push({ _name: key, cities: value })
        })
      },
      getList () {
        let status = this.selectedStatus
        let source = this.selectedSource
        let city = this.selectedCity
        if (indexOf(city, '/') < 0) {
          let provice = city
          let citys = find(this.provinces, { _name: provice })
          if (citys) {
            city = citys.cities.map(value => value._name)
            city = join(city, ',')
          }
        }
        let data = {
          data: { page: this.currentPage, size: this.currentSize, status: status, name: this.name, source: source, city: city },
          success: rs => {
            this.total = rs.result.total
            this.list = rs.result
          }
        }
        this.$http.post(APIS.POST_FEEDBACK_LIST, data.data).then(data.success)
      },
      handleSizeChange () {
        console.log('handleSizeChange', this.currentPage, this.currentSize)
        this.getList()
      },
      handleCurrentChange () {
        console.log('handleCurrentChange', this.currentPage, this.currentSize)
        this.getList()
      },
      search () {
        this.getList()
      },
      handleSelectionChange () {
        this.getList()
      },
      handleClick (index, row) {
        window.localStorage.setItem('audioCurrentPage', this.currentPage)
        window.localStorage.setItem('audioCurrentSize', this.currentSize)
        window.localStorage.setItem('selectedStatus', this.selectedStatus)
        window.localStorage.setItem('selectedSource', this.selectedSource)
        window.localStorage.setItem('selectedCity', this.selectedCity)
        this.$router.push({ name: 'admin.audio.feedbackedit', params: { id: row.id } })
      },
      formatter (row, index) {
        let text = ''
        switch (parseInt(row.status)) {
          case 0:
            text = '待处理'
            break
          case 1:
            text = '受理中'
            break
          case 2:
            text = '已解决'
            break
          case 3:
            text = '已关闭'
            break
        }
        return text
      },
      formatterSource (row, index) {
        let text = ''
        switch (parseInt(row.source)) {
          case 3:
            text = '小程序'
            break
          default:
            text = '超级教练'
        }
        return text
      },
      handleItemChange (val) {
        this.selectedCity = join(val, '/')
        window.localStorage.setItem('selectedCity', this.selectedCity)
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
