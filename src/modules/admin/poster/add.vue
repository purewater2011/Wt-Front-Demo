<template>
  <div class="container">
    <div class="">
      <el-form label-width="150px" style="margin:20px;"
               :model="form_data"
               :rules="rules"
               ref='refForm'>
        <el-form-item label="海报标题" prop='title' style="width:600px;">
          <el-input v-model="form_data.title" placeholder="请输入海报的标题，12字以内"></el-input>
        </el-form-item>
        <el-form-item label="选择海报模板" prop='template'>
          <el-col :span="6">
          <el-select v-model="form_data.template" placeholder="请选择">
            <el-option :value='template.id' :label="template.name" v-for="template in templates" :key="template.id"></el-option>
          </el-select>
          </el-col>
          <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true" size="small">模板预览</el-button>
          <el-dialog title="模板列表" :visible.sync="dialogVisible">
            <el-carousel :interval="4000" type="card" height="600px">
              <el-carousel-item v-for="item in templates" :key="item.id">
                <img :src="item.img">
                <h3>{{item.name}}</h3>
              </el-carousel-item>
            </el-carousel>
          </el-dialog>
          </el-col>
        </el-form-item>
        <el-form-item label="设置海报字段（最多可选6个）" prop="select_column">
          <el-transfer
            v-model="form_data.select_column"
            :titles="['海报字段', '已添加字段']"
            :right-default-checked="rightChecked"
            :props="{
              key: 'key',
              label: 'title'
            }"
            :data="data_items"
          >
          </el-transfer>
          <el-tag type="gray">提示：已添加字段顺序与海报字段显示的顺序一致</el-tag>

        </el-form-item>
        <el-form-item label="上传海报背景" prop='back_image' style="width:600px;"  :rules="{required: true, message: '不能为空', trigger: 'blur'}">
          <el-input v-model="form_data.back_image" placeholder="请输入海报背景图片链接"></el-input>
        </el-form-item>
        <el-form-item label="上传海报封面" prop='index_image' style="width:600px;">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleCover"
            :before-upload="beforeAvatarUpload">
            <img v-if="form_data.index_image" :src="form_data.index_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="配置海报参数" prop='qrcode_type' style="width:600px;">
          <el-radio-group v-model="form_data.qrcode_type">
            <el-radio label="1">静态二维码</el-radio>
            <el-radio label="0">动态二维码</el-radio>
            <el-radio label="2">带cid模式二维码</el-radio>
          </el-radio-group>
          <el-input v-model="form_data.qrcode_link" placeholder="请输入二维码链接"></el-input>
        </el-form-item>
        <el-form-item label="海报生成量放大系数" prop='rate'>
          <el-col :span="6">
            <el-input-number v-model="form_data.rate" :min="0" :max="100"></el-input-number>
          </el-col>
          <el-col :span="6">
            <el-tag type="gray">海报生成量=实际生成量*放大系数；</el-tag>
          </el-col>
          <el-col :span="6">
            <el-tag type="gray">提示：1.0表示不放大，小于1.0表示缩小</el-tag>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='onSubmit("refForm")'>保存并生成</el-button>
          <el-button @click='back'>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import * as global from '@config/APIS'
  export default {
    components: {},
    name: 'echarts',
    data () {
      return {
        uploadUrl: '',
        rightChecked: [],
        form_data: { type: '1', template: 'template1', select_column: [], qrcode_type: '0', rate: 1, back_image: '', index_image: '', qrcode_link: '', img: '' },
        tableColumns: [
          { prop: 'time', label: '发送时间' },
          { prop: 'count', label: '发送数量' }
        ],
        templates: [
          { id: 'template1', name: '模板1', img: 'https://static.clfile.com/g1/img/p/supercoach/template1.png' },
          { id: 'template2', name: '模板2', img: 'https://static.clfile.com/g1/img/p/supercoach/template2.png' },
          { id: 'template3', name: '模板3', img: 'https://static.clfile.com/g1/img/p/supercoach/template3.png' },
          { id: 'template4', name: '模板4', img: 'https://static.clfile.com/g1/img/p/supercoach/template4.png' },
          { id: 'template5', name: '模板5', img: 'https://static.clfile.com/g1/img/p/supercoach/template5.png' },
          { id: 'template6', name: '模板6', img: 'https://static.clfile.com/g1/img/p/supercoach/template6.png' },
          { id: 'template7', name: '模板7', img: 'https://static.clfile.com/g1/img/p/supercoach/template7.png' }
        ],
        dialogVisible: false,
        data_items: [
          { key: 'coach_name', title: '教练姓名' },
          { key: 'telephone', title: '教练电话' },
          { key: 'school_name', title: '所属驾校' },
          { key: 'recruit_addr', title: '招生范围' },
          { key: 'tuition', title: '学车费用' }
        ],
        rules: {
          template: [
            { required: true, message: '请输入短信模板', trigger: 'blur' },
            { min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur' }
          ],
          back_image: [
            { required: true, message: '请选择背景图片', trigger: 'change' }
          ],
          index_image: [
            { required: true, message: '请选择封面', trigger: 'change' }
          ],
          select_column: [
            { type: 'array', required: true, message: '请选择海报字段', trigger: 'change' }
          ],
          qrcode_type: [
            { message: '请选择类型', trigger: 'change' }
          ],
          rate: [
            { type: 'number', message: '请设置比例' }
          ],
          title: [
            { required: true, message: '请填写标题', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    mounted () {
      if (global.env === 'production') {
        this.uploadUrl = 'http://cjjl.chelun.com/Upload/Pics/'
      } else {
        this.uploadUrl = 'http://dev.cjjl.chelun.com/Upload/Pics/'
      }
      let id = this.$route.params.id ? this.$route.params.id : 0
      if (id > 0) {
        this.getPosterInfo(id)
      }
    },
    methods: {
      getPosterInfo (id) {
        this.$http.post(global.APIS.GET_POSTER_INFO, { id: id }).then(rs => {
          this.form_data = rs.result
          this.form_data.select_column.forEach(value => {
            this.rightChecked.push(value.key)
          })
          this.$set(this.form_data, 'select_column', this.rightChecked)
        })
      },
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let success = rs => {
              if (rs.code !== 0) {
                this.$message.error(rs.msg)
                return
              }
              this.$message({ message: '操作成功', type: 'success' })
              this.$router.push({ name: 'admin.poster.list' })
            }
            let id = this.$route.params.id ? this.$route.params.id : 0
            let tmp = []
            this.form_data.select_column.map(value => {
              this.data_items.forEach(v => {
                if (v.key === value) {
                  tmp.push(v)
                }
              })
            })
            this.$set(this.form_data, 'select_column2', JSON.stringify(tmp))
            // this.$set(this.form_data, 'select_column', JSON.stringify(this.form_data.select_column))
            if (id > 0) {
              this.$http.post(global.APIS.POST_EDIT_POSTER, this.form_data).then(success)
            } else {
              this.$http.post(global.APIS.POST_ADD_POSTER, this.form_data).then(success)
            }
          } else {
            console.log(valid)
            return false
          }
        })
      },
      handleBackground (res, file) {
        console.log('handleBackground', res, file)
        if (res.code === 0) {
          this.form_data.back_image = res.result.url
        } else {
          this.$message({
            message: '上传失败',
            type: 'warning'
          })
        }
      },
      handleCover (res, file) {
        console.log('handleCover', res, file)
        if (res.code === 0) {
          this.form_data.index_image = res.result[0]
        } else {
          this.$message({
            message: '上传失败',
            type: 'warning'
          })
        }
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
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
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
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
  .el-carousel__item {
    text-align: center;
    /*width: 178px;*/
    img {
      width: 100%;
      height: 100%;
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    /*line-height: 200px;*/
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
