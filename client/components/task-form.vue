<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Submit Task Request</p>
      </header>
      <section class="modal-card-body">
        <p class="content">
          Enter your name, phone number, and email address, and choose the task
          you would like us to complete for you.
        </p>

        <b-field label="Your Name">
          <b-input
          v-model="formData.name"
          placeholder="Jane Smith"
          required />
        </b-field>

        <b-field label="Your Phone Number">
          <b-input
          v-model="formData.phone"
          type="phone"
          placeholder="5551112222"
          required />
        </b-field>

        <b-field label="Your Email Address">
          <b-input
          v-model="formData.email"
          type="email"
          placeholder="jsmith@gmail.com"
          required />
        </b-field>

        <b-field label="Request Type">
          <b-select
          placeholder="Select a Request Type"
          v-model="formData.task">
          <option
          v-for="option in requestTypes"
          :value="option">
          {{ option.text }}</option>
          </b-select>
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-success" type="submit">Submit Request</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['requestTypes', 'phone', 'email', 'name'],

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
