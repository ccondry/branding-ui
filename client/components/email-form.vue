<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Email Us</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Your Name">
          <b-input
          v-model="formData.name"
          placeholder="Jane Smith"
          required />
        </b-field>

        <b-field label="Your Email Address">
          <b-input
          type="email"
          v-model="formData.email"
          placeholder="jsmith@gmail.com"
          required />
        </b-field>

        <b-field label="Subject">
          <b-input
          v-model="formData.subject"
          placeholder=""
          required />
        </b-field>

        <b-field label="Message">
          <b-input
          type="textarea"
          v-model="formData.body"
          placeholder=""
          required />
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-success" type="submit">Send</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['name', 'email'],

  mounted () {
    // copy props to data
    this.formData.name = this.name
    this.formData.email = this.email
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
