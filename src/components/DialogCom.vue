<template>
  <el-dialog :title="dialogConfig.title" :visible.sync="dialogConfig.visble">
    <el-form label-width="100px" v-if="!dialogConfig.hideForm && forms">
      <el-form-item :label="form.label" :label-width="form.width" v-for="form in forms" :key="form.id">
        <el-input v-if="form.type === 'input'" v-model="form.value"></el-input>
        <el-select v-else-if="form.type === 'select'" v-model="form.value" :placeholder="form.placeholder">
          <el-option :label="select.label" :value="select.value" v-for="select in form.selects" :key="select.id"></el-option>
        </el-select>
        <el-radio-group v-else-if="form.type === 'radio'" v-model="form.value" size="mini">
          <el-radio :label="radio.value"  v-for="radio in form.radios" :key="radio.id">{{radio.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <slot name="other"></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogConfig.visble = false">取 消</el-button>
      <el-button type="primary" @click="dialogSubmit(forms)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'DialogCom',
    props: {
      dialogConfig: {
        type: Object,
        required: true
      },
      forms: {
        type: Array,
        required: true
      }
    },
    methods: {
      dialogSubmit (forms) {
        this.$emit('submit', forms)
      }
    }
  }
</script>

<style scoped>

</style>
