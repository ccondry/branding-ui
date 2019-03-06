<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Text With Us</p>
      </header>
      <section class="modal-card-body">
        <p class="content">
          Enter your mobile phone number and we will text you. Reply to begin
          texting with one of our experts.
        </p>

        <b-field label="Your Mobile Phone Number">
          <b-input
          v-model="formData.phone"
          placeholder="5551112222"
          required />
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-success" type="submit">Text Me</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['phone'],

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
  },

  data () {
    return {
      formData: {
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
