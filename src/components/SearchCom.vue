<template>
  <el-form :inline="true">
    <el-form-item :label="form.label ? form.label : ''" v-for="form in forms" :key="form.id">
      <template v-if="form.type === 'input'">
        <el-input clearable :placeholder="form.placeholder" v-model="search[form.name]" @change="onChangeInput(form)"></el-input>
      </template>
      <template v-else-if="form.type === 'select'">
        <el-select v-model="search[form.name]" clearable :placeholder="form.placeholder" @change="onChangeSelect(form)">
          <el-option :value='item.key' :label="item.name" v-for="item in form.options" :key="item.key"></el-option>
        </el-select>
      </template>
    </el-form-item>
    <slot></slot>
    <el-form-item>
      <el-button :type="button.type" @click="onSearchSubmit(button)"  v-for="button in buttons" :key="button.id">{{button.title}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'SearchCom',
    props: {
      forms: {
        type: Array,
        required: true
      },
      buttons: {
        type: Array,
        default: () => {
          return [
            { id: 1, title: '搜索', type: 'primary' }
          ]
        }
      },
      search: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      onChangeSelect (form) {
        this.$emit('onChangeSelect', form, this.search)
      },
      onChangeInput (form) {
        this.$emit('onChangeInput', form, this.search)
      },
      onSearchSubmit (button) {
        this.$emit('onSearchSubmit', this.search, button)
      }
    }
  }
</script>

<style scoped>

</style>
