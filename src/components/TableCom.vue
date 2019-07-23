<template>
  <el-table v-if="maxHeight > 0"
    stripe
    :size="tableSize"
    highlight-current-row
    :data="data"
    style="width: 100%"
    :max-height="maxHeight">
    <template v-for="prop in props">
      <el-table-column
        :sortable="prop.sortable ? prop.sortable : false"
        :fixed="prop.fix ? prop.fix : false"
        :prop="prop.prop"
        :label="prop.label"
        :width="prop.width ? prop.width : ''">
        <slot v-if="prop.scope" :name="prop.scope"></slot>
      </el-table-column>
    </template>
    <el-table-column
      :fixed="handleConfig.fixed ? handleConfig.fixed : false"
      :label="handleConfig.label ? handleConfig.label : '操作'"
      :width="parseInt(handleConfig.width) ? parseInt(handleConfig.width) : 120">
      <template slot-scope="scope">
        <el-button
          :size="handle.size ? handle.size : 'mini'"
          :type="handle.type ? handle.type : 'primary'"
          @click="handle.function(scope.$index, scope.row)"  v-for="handle in handles" :key="handle.id">{{ handle.title }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: 'TableCom',
    props: {
      data: {
        type: Array,
        required: true
      },
      props: {
        type: Array,
        required: true
      },
      handles: {
        type: Array,
        required: true
      },
      tableSize: {
        type: String,
        default: 'small'
      },
      handleConfig: {
        type: Object,
        default: () => {
          return { fixed: false, label: '操作', width: 120 }
        }
      },
      tableStyle: {
        type: String,
        default: 'width: 100%'
      },
      maxHeight: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style scoped>

</style>
