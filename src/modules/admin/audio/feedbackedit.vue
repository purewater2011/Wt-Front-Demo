<template>
  <div>
    <div class="container">
      <el-form label-width="150px"
               :model="form_data"
               :rules="rules"
               ref='refForm'>
        <el-form-item label="用户ID" prop='system' v-if="form_data.uid > 0">
          <el-button type="text" @click="showUserInfo = true">{{form_data.uid}}</el-button>
        </el-form-item>
        <el-form-item label="来源" prop='source' style="width:600px;">
          {{form_data.source === '3' ? "小程序" : "超级教练"}}
        </el-form-item>
        <el-form-item label="所在城市" prop='title' style="width:600px;">
          {{form_data.city}}
        </el-form-item>
        <el-form-item label="考场名称" prop='title' style="width:600px;">
          {{form_data.exam_room}}
        </el-form-item>
        <el-form-item label="系统名称" prop='title' style="width:600px;">
          {{form_data.system}}
        </el-form-item>
        <el-form-item label="其他说明" prop='content' style="width:600px;">
          {{form_data.content}}
        </el-form-item>
        <el-form-item label="图片" prop='title' style="width:100%;">
          <div class="avatar-uploader">
            <template v-for="item in form_data.imgs">
              <a :href="item" target="_blank"> <img class="avatar" :src="item" alt="" ></a>
            </template>
          </div>
        </el-form-item>
        <el-form-item label="客服备注" prop='remark' style="width:600px;">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="客服备注"
            v-model="form_data.remark">
          </el-input>
        </el-form-item>
        <el-form-item label="提交时间" prop='title' style="width:600px;">
          {{form_data.create_at}}
        </el-form-item>
        <el-form-item label="状态" prop='system'>
          <el-select v-model="form_data.status" filterable placeholder="请选择">
            <el-option :value='item.key' :label="item.name" v-for="item in status" :key="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='onSubmit("refForm")'>保存</el-button>
          <el-button @click='back'>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--用户信息-->
    <el-dialog title="用户信息" :visible.sync="showUserInfo" v-if="userinfo">
      <el-form :model="userinfo" label-width="80px"  label-position="right" size="mini" :inline="true">
        <el-form-item label="用户名称">
          {{userinfo.c_nickname}}
        </el-form-item>
        <el-form-item label="电话">
          {{userinfo.c_phone}}
        </el-form-item>
        <el-form-item label="所属驾校">
          {{userinfo.c_s_name}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showUserInfo = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { APIS } from '@config/APIS'

  export default {
    components: {},
    name: 'feedbackedit',
    data () {
      return {
        showUserInfo: false,
        form_data: {},
        userinfo: {},
        status: [{ key: '0', name: '待处理' }, { key: '1', name: '受理中' }, { key: '2', name: '已解决' }, { ey: '3', name: '已关闭' }],
        rules: {
          status: [
            { required: true, message: '请选择', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {},
    mounted () {
      let id = this.$route.params.id
      console.log('edit', id)
      if (!id) {
        this.$message({
          message: '参数错误',
          type: 'warning'
        })
        return
      }
      this.getInfo(id)
    },
    methods: {
      back () {
        this.$confirm('是否放弃编辑内容?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$router.replace({ name: 'admin.audio.feedbacklist', params: { 'page': window.localStorage.getItem('audioCurrentPage'), 'size': window.localStorage.getItem('audioCurrentSize') } })
        }).catch(() => {
          console.log('back')
        })
      },
      getInfo (id) {
        let success = rs => {
          console.log('getinfo', rs)
          this.form_data = rs.result
          this.getUserInfo(rs.result.uid)
        }
        this.$http.post(APIS.GET_FEEDBACK_INFO + id).then(success)
      },
      getUserInfo (uid) {
        let success = rs => {
          this.userinfo = rs.result
        }
        this.$http.get(APIS.GET_COACHINFO + uid).then(success)
      },
      onSubmit () {
        let data = { id: this.form_data.id, status: this.form_data.status, remark: this.form_data.remark }
        let success = rs => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.replace({ name: 'admin.audio.feedbacklist', params: { 'page': window.localStorage.getItem('audioCurrentPage'), 'size': window.localStorage.getItem('audioCurrentSize') } })
        }
        let error = err => {
          let text = err.msg ? err.msg : '操作失败'
          this.$message({
            message: text,
            type: 'warning'
          })
        }
        this.$http.post(APIS.POST_EDIT_FEEDBACK, data).then(success, error)
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
    display: inline;
  }

  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }

</style>
