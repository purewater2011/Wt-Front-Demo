<template>
  <div class="page">
    <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :layout="layout"
    :total="total">
  </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'PageCom',
    props: {
      total: Number,
      currentPage: {
        type: Number,
        default: 1
      },
      pageSizes: {
        type: Array,
        default: () => {
          return [50, 100, 200]
        }
      },
      pageSize: {
        type: Number,
        default: 100
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
      }
    },
    methods: {
      handleSizeChange (data) {
        this.$emit('handleSizeChange', data)
      },
      handleCurrentChange (data) {
        this.$emit('handleCurrentChange', data)
      }
    }
  }
</script>

<style lang="scss">
  .page{
    margin-top: 20px;
  }
</style>
