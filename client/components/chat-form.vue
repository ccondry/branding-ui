<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ heading }}</p>
      </header>
      <section class="modal-card-body">

        <b-field :label="nameLabel">
          <b-input
          v-model="formData.name"
          placeholder="Jane Smith"
          required />
        </b-field>

        <b-field :label="phoneLabel">
          <b-input
          v-model="formData.phone"
          placeholder="5551112222"
          required />
        </b-field>

        <b-field :label="emailLabel">
          <b-input
          v-model="formData.email"
          placeholder="jsmith@gmail.com"
          required />
        </b-field>

        <b-field :label="messageLabel">
          <b-input
          type="textarea"
          v-model="formData.message"
          placeholder="Message"
          required />
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
    'phone',
    'name',
    'email',
    'heading',
    'nameLabel',
    'emailLabel',
    'phoneLabel',
    'messageLabel',
    'cancelButton',
    'sendButton'
  ],

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
    this.formData.name = this.name
    this.formData.email = this.email
  },

  data () {
    return {
      formData: {
        name: '',
        phone: '',
        email: '',
        message: ''
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
