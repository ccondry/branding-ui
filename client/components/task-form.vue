<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ heading }}</p>
      </header>
      <section class="modal-card-body">
        <p class="content" v-html="modalText" />

        <b-field :label="nameLabel">
          <b-input
          v-model="formData.name"
          placeholder=""
          required />
        </b-field>

        <b-field :label="phoneLabel">
          <b-input
          v-model="formData.phone"
          type="phone"
          placeholder=""
          required />
        </b-field>

        <b-field :label="emailLabel">
          <b-input
          v-model="formData.email"
          type="email"
          placeholder=""
          required />
        </b-field>

        <b-field :label="requestTypeLabel">
          <b-select
          required
          placeholder=""
          v-model="formData.task">
          <option
          v-for="option in options"
          :value="option.text">
          {{ option.text }}</option>
          </b-select>
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">{{ cancelButton }}</button>
        <button class="button is-success" type="submit">{{ sendButton }}</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: [
    'options',
    'phone',
    'email',
    'name',
    'heading',
    'modalText',
    'phoneLabel',
    'nameLabel',
    'emailLabel',
    'requestTypeLabel',
    'messageLabel',
    'cancelButton',
    'sendButton'
  ],

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
    this.formData.email = this.email
    this.formData.name = this.name
  },

  data () {
    return {
      formData: {
        name: '',
        email: '',
        task: null,
        phone: ''
      }
    }
  }
}
</script>

<style lang="scss">
.animation-content {
  width: 50%
}
.modal-card-foot {
  // pull the footer buttons to the right
  justify-content: flex-end !important;
}
</style>
