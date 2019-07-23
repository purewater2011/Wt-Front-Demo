<template lang="html">
 <div>
     <el-row :gutter="4">
       <draggable v-model="titles" :options="config" @start="drag=true" @end="drag=false" @change="log">
         <el-col :span="6" v-for="(item, index) in titles" :key="item.id">
           <el-card class="box-card">
             <div slot="header" class="clearfix">
               <el-row>
                 <el-col :span="20" class="show-overflow-tooltip">{{item.label}}</el-col>
                 <el-col :span="4">
                   <el-button style="float: right; padding: 3px 0" type="text">
                     <el-dropdown>
                       <i class="el-icon-more"></i>
                       <el-dropdown-menu slot="dropdown">
                         <el-dropdown-item>编辑</el-dropdown-item>
                         <el-dropdown-item>归档</el-dropdown-item>
                         <el-dropdown-item>删除</el-dropdown-item>
                       </el-dropdown-menu>
                     </el-dropdown>
                   </el-button>
                   <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                 </el-col>
               </el-row>
             </div>
             <draggable v-model="list1" :options="config" @start="drag=true" @end="drag=false" @change="log">
               <template v-for="o in list1">
                 <div class="text item" @mouseover="handleShowEdit(o, 1)" @mouseout="handleShowEdit(o, 0)">
                   <el-row justify="center">
                     <el-col :span="2"><el-checkbox /></el-col>
                     <el-col :span="20">
                       <el-row justify="center">
                         <el-col :span="24" class="show-overflow-tooltip">{{'列表内容 ' + o.name }}</el-col>
                         <el-col :span="24">
                           <el-popover
                             width="180"
                             placement="right"
                             trigger="click">
                             <div style="font-size: 10px;">
                               <el-row>将任务指派给</el-row>
                               <el-row><el-autocomplete
                                 class="inline-input"
                                 style="width: 150px;"
                                 size="mini"
                                 v-model="state1"
                                 :fetch-suggestions="querySearch"
                                 placeholder="请输入内容"
                               ></el-autocomplete></el-row>
                               <el-row>任务截止时间</el-row>
                               <el-row>
                                 <el-col><el-date-picker
                                   style="width: 150px;"
                                 size="mini"
                                 v-model="value1"
                                 type="date"
                                 placeholder="选择日期">
                               </el-date-picker></el-col></el-row>
                             </div>
                             <el-tag slot="reference" size="mini">eric 2018-11-12</el-tag>
                           </el-popover>
                         </el-col>
                       </el-row>
                     </el-col>
                     <el-col :span="2">
                       <el-button style="float: right;padding: 3px 0" type="text" v-if="showEdit[o.id]">
                         <i class="el-icon-edit"></i>
                         &nbsp;
                         <i class="el-icon-delete"></i>
                       </el-button>
                     </el-col>
                   </el-row>
                 </div>
               </template>
             </draggable>
           </el-card>
         </el-col>
       </draggable>
       <el-col :span="6" align="center" class="addnew">
         <el-button type="primary" >添加新的清单</el-button>
       </el-col>
     </el-row>
 </div>
</template>

<script>
  import draggable from 'vuedraggable'
  const data = [
      { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
      { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
      { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
      { "value": "泷千家(天山西路店)", "address": "天山西路438号" }
    ]
  export default {
    components: { draggable },
    data() {
      return {
        state1: '',
        value1: '',
        restaurants: [],
        showEdit: [],
        list1: [
          { id: 1, "name": "vue.draggable", "order": 1, "fixed": false },
          { id: 2, "name": "vue.draggable2", "order": 2, "fixed": false },
          { id: 3, "name": "vue.draggable3", "order": 3, "fixed": false },
          { id: 4, "name": "vue.draggable4", "order": 4, "fixed": false }
        ],
        list2: [],
        config: { animation: 300 },
        titles: [ { label: "任务1" }, { label: "任务2" }, { label: "任务3" }, { label: "任务4" }, { label: "任务5" }, { label: "任务6" }, { label: "任务7" }, { label: "任务8" }, { label: "任务9" }, { label: "任务任务任务务任务任务任务任务务任务任务任务任务10" }],
      }
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = data;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleShowEdit (item, status) {
        this.$set(this.showEdit, item.id, status)
      },
      handleChange() {
        console.log('handleChange')
      },
      inputChanged(value) {
        console.log('inputChanged', value)
      },
      getComponentData () {
        return {
          on: {
            change: this.handleChange,
            input: this.inputChanged
          },
          props: {
            value: this.activeNames
          }
        }
      },
      addFooter (tt) {
        console.log('addFooter', tt)
        let item = { "name": "new add footer", "order": 10, "fixed": false }
        this.list1.push(item)
      },
      addHeader (tt, tt2, tt3) {
        console.log('addheader', tt, tt2, tt3)
        let item = { "name": "new add header", "order": 10, "fixed": false }
        this.list1.unshift(item)
      },
      log (item) {
        if (!_.isEmpty(item.moved)) {
          return
          // 移动
          let tt = item.moved
          let Old = this.list1[tt.oldIndex]
          let New = this.list1[tt.newIndex]
          this.list1[tt.oldIndex]['order'] = New['order']
          this.list1[tt.newIndex]['order'] = Old['order']
        }
      }
    }
  }
</script>

<style lang="scss">
  .show-overflow-tooltip {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item {
    margin: 2px auto 5px auto;
    padding: 8px 8px;
    border-radius: 8px;
    background: #f4f0ea;
    outline: 6px solid white;
  }
  .addnew {
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
</style>
