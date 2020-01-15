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
          placeholder="Jane Smith"
          required />
        </b-field>

        <b-field :label="emailLabel">
          <b-input
          type="email"
          v-model="formData.email"
          placeholder="jsmith@gmail.com"
          required />
        </b-field>

        <b-field :label="subjectLabel">
          <b-input
          v-model="formData.subject"
          placeholder=""
          required />
        </b-field>

        <b-field :label="messageLabel">
          <b-input
          type="textarea"
          v-model="formData.body"
          placeholder=""
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
    'name',
    'email',
    'subject',
    'body',
    'heading',
    'modalText',
    'nameLabel',
    'emailLabel',
    'subjectLabel',
    'messageLabel',
    'cancelButton',
    'sendButton'
  ],

  mounted () {
    // copy props to data
    this.formData.name = this.name
    this.formData.email = this.email
    this.formData.subject = this.subject
    this.formData.body = this.body
  },

  data () {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        body: ''
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
