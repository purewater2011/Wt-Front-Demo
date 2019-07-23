<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="Form">
      <el-form-item label="短信模板" prop="template">
        <el-input v-model="ruleForm.template"></el-input>
      </el-form-item>
      <el-form-item label="发送类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择活动区域">
          <el-option value='1' label="手机号"></el-option>
          <el-option value='2' label="教练名称和手机号"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否是营销短信" prop="is_sale">
        <el-switch v-model="ruleForm.is_sale"></el-switch>
      </el-form-item>
      <el-form-item label="教练手机号" prop="desc">
        <el-row>
        <el-col :span="18"><upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/></el-col>
        <el-col :span="6">
          <el-popover
            placement="bottom"
            width="400"
            trigger="hover">
            <el-table :data="demoData">
              <el-table-column width="100" property="name" label="姓名"></el-table-column>
              <el-table-column width="300" property="phone" label="手机号"></el-table-column>
            </el-table>
            <el-button slot="reference" size="mini" type="danger">查看上传模板</el-button>
          </el-popover>
        </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="buttonLoading">点击发送</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;" v-if="tableData && tableData.length > 1">
      <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
    </el-table>
  </div>
</template>

<script>
  import UploadExcelComponent from '@components/UploadExcel'
  import { APIS } from '@config/APIS'
  const demoData = [{
    name: '王小虎',
    phone: '17000000001'
  }, {
    name: '王小虎',
    phone: '17000000002'
  }, {
    name: '王小虎',
    phone: '17000000003'
  }, {
    name: '王小虎',
    phone: '17000000004'
  }]

  export default {
    name: 'send',
    components: { UploadExcelComponent },
    data () {
      return {
        demoData: demoData,
        tableData: [],
        tableHeader: [],
        buttonLoading: false,
        ruleForm: {
          type: '1',
          template: '',
          is_sale: 0,
          phones: ''
        },
        rules: {
          template: [
            { required: true, message: '请输入短信模板', trigger: 'blur' },
            { min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择一种发送类型', trigger: 'change' }
          ],
          phones: [
            { required: true, message: '请输入手机号', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      beforeUpload (file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (isLt1M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning'
        })
        return false
      },
      handleSuccess ({ results, header }) {
        this.tableData = results
        this.tableHeader = header
        this.ruleForm.phones = results.map(v => v[header[1]])
      },
      submitForm: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttonLoading = true
            this.$http.post(APIS.POST_SMS_SEND, this.ruleForm).then((rs) => {
              if (rs.code === 0) {
                this.$message.success('发送成功' + JSON.stringify(rs.result))
                // this.$refs[formName].resetFields()
              } else {
                this.$message.error(rs.msg)
              }
              this.buttonLoading = false
            }, (err) => {
              console.log('http-error', err)
              this.buttonLoading = false
            }
            )
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
