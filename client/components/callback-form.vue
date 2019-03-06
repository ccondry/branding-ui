<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">We'll Call You</p>
      </header>
      <section class="modal-card-body">
        <p class="content">
          Enter your name and phone number and one of our experts will call you.
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
          placeholder="5551112222"
          required />
        </b-field>

        <b-field label="Your Message">
          <b-input
          type="textarea"
          v-model="formData.message"
          placeholder="Message"
          required />
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-success" type="submit">Call Me</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        name: '',
        phone: '',
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
