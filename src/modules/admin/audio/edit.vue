<template>
  <div>
    <div class="form">
      <el-form label-width="150px" style="margin:20px;width:90%;min-width:600px;"
               :model="form_data"
               :rules="rules"
               ref='refForm'>
        <el-form-item label="选择系统" prop='system'>
          <el-select v-model="form_data.systemid" filterable placeholder="请选择">
            <el-option :value='item.systemid' :label="item.name" v-for="item in syslist" :key="item.systemid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指令名称" prop='title' style="width:600px;">
          <el-input v-model="form_data.title"></el-input>
        </el-form-item>
        <el-form-item label="指令设置" prop='content' style="width:600px;">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 100}"
            placeholder="请输入指令内容，格式如：下面将进行模拟夜间行驶灯光的考试，请在5秒内做出相应的灯光操作。 启动；多条使用多行即可。"
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

  export default {
    components: {},
    name: 'audio-edit',
    data () {
      return {
        form_data: { system: '' },
        data_items: [{ key: '1', label: '教练姓名' }],
        rules: {
          content: [
            { required: true, message: '请输入指令内容', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入指令标题', trigger: 'blur' }
          ],
          systemid: [
            { required: true, message: '请选择指令系统', trigger: 'change' }
          ]
        }
      }
    },
    mounted () {
      let id = this.$route.params.id
      if (!id) {
        this.$message({
          message: '参数错误',
          type: 'warning'
        })
        return
      }
      this.getInfo(id)
      this.getSysList()
    },
    methods: {
      getSysList () {
        this.$http.get(APIS.GET_SYSTEM_LIST).then(rs => {
          this.syslist = rs.result
        })
      },
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
      getInfo (id) {
        let success = rs => {
          this.form_data = rs.result
        }
        this.$http.get(APIS.GET_SYSTEM_INFO + id).then(success)
      },
      onSubmit () {
        let sysId = parseInt(this.form_data.systemid)
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
        let data = { id: this.form_data.id, title: this.form_data.title, sys_id: system.systemid, city_id: system.cityid, content: this.form_data.content }
        let success = rs => {
          if (rs.code !== 0) {
            this.$message.error(rs.msg)
            return
          }
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.push({ name: 'admin.audio.list' })
        }
        let error = err => {
          let text = err.msg ? err.msg : '操作失败'
          this.$message({
            message: text,
            type: 'warning'
          })
        }
        this.$http.post(APIS.POST_EDIT_AUDIO, data).then(success, error)
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
