<template>
  <div class="is-horizontal">
    <div class="field-label">
      <label class="label">{{ label }}</label>
    </div>
    <div class="field-body" v-if="options.length">
      <div class="field">
        <div class="select">
          <select class="input"
          ref="inp"
          :value="model"
          @input="$emit('update:model', $event.target.value)"
          >
            <option value="" disabled>Please Choose</option>
            <option v-for="option of options" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
        <!-- <input class="input"
        :class="validator ? '' : 'is-danger'"
        type="text"
        :placeholder="placeholder"
        :value="model"
        @input="$emit('update:model', $event.target.value)"
        :disabled="disabled"
        > -->
      </div>
      <!-- <p v-if="!validator" class="help is-danger">
        {{ help }}
      </p> -->
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  props: ['label', 'required', 'model', 'help', 'options'],
  watch: {
    options (val) {
      // options have changed, and the dropdown will automatically show the first
      // available option without updating model. so update selected option in
      // the parent to keep model and UI data in sync
      // this.$emit('update:model', val[0].value)
      // this.$emit('update:model', val[val.length - 1].value)
      this.$nextTick(() => {
        this.$emit('update:model', this.$refs.inp.value)
      })
    }
  }
}
</script>
