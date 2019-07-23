<template>
  <div>
    <div class="form">
      <el-form label-width="150px" style="margin:20px;width:90%;min-width:600px;"
               :model="form_data"
               :rules="rules"
               ref='refForm'>
        <el-form-item label="选择系统" prop='system'>
          <el-select v-model="form_data.system" clearable filterable placeholder="请选择">
            <el-option :value='item.systemid' :label="item.name" v-for="item in syslist" :key="item.systemid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择类目" prop='category'>
          <el-select v-model="form_data.category" filterable placeholder="请选择">
            <el-option :value='item.key' :label="item.name" v-for="item in categorys" :key="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统添加" prop='content' style="width:600px;">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 100}"
            placeholder="请输入系统名称，如果添加多个请换行。"
            v-model="form_data.content">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='onSubmit("refForm")'>保存</el-button>
          <el-button @click='back'>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { APIS } from '@config/APIS'
  import { mapGetters } from 'vuex'

  export default {
    components: {},
    name: 'audio-batchadd',
    data () {
      return {
        form_data: { system: '', category: '34' },
        tableColumns: [
          { prop: 'time', label: '发送时间' },
          { prop: 'count', label: '发送数量' }
        ],
        dialogFormVisible: false,
        data_items: [{ key: '1', label: '教练姓名' }],
        categorys: [{ key: '2', name: '科目二自带语音' }, { key: '31', name: '科目三自带灯光' }, { key: '32', name: '科目三自带语音' }, { ey: '34', name: '科目三自带灯光指令' }],
        rules: {
          content: [
            { required: true, message: '请输入系统名称', trigger: 'blur' }
          ],
          system: [
            { required: true, message: '请选择指令系统', trigger: 'change' }
          ],
          category: [
            { required: true, message: '请选择类目', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        syslist: 'systemList'
      })
    },
    mounted () {
      this.$store.dispatch('getSysList')
    },
    methods: {
      back () {
        this.$confirm('是否放弃编辑内容?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          window.history.back()
        }).catch(() => {
          console.log('back')
        })
      },
      onSubmit (ref) {
        this.$refs[ref].validate((valid) => {
          if (valid) {
            console.log(this.form_data)
            this.postData()
          } else {
            console.log(valid)
          }
        })
      },
      postData () {
        let sysId = parseInt(this.form_data.system)
        let system = ''
        this.syslist.forEach(value => {
          if (parseInt(value.systemid) === sysId) {
            system = value
          }
        })
        if (!system) {
          this.$message({
            message: '请选择正确的系统',
            type: 'warning'
          })
          return
        }
        let data = { sys_id: system.systemid, type: this.form_data.category, content: this.form_data.content }
        let success = rs => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.push({ name: 'AudioList' })
        }
        let error = err => {
          let text = err.msg ? err.msg : '操作失败'
          this.$message({
            message: text,
            type: 'warning'
          })
        }
        this.$http.post(APIS.POST_BATCH_ADD_AUDIO, data).then(success, error)
      }
    }
  }
</script>
<style scoped lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>
