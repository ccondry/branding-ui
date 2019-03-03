<template>
  <form @submit.prevent="$emit('submit')">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Email Us</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Your Name">
          <b-input
          :value="name"
          placeholder="John Smith"
          required />
        </b-field>

        <b-field label="Your Email Address">
          <b-input
          type="email"
          :value="email"
          placeholder="jsmith@gmail.com"
          required />
        </b-field>

        <b-field label="Your Question">
          <b-input
          type="textarea"
          :value="body"
          placeholder=""
          required />
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button" type="button" @click="$parent.close()">Close</button> -->
        <button class="button is-success" type="submit">Send</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['email', 'phone', 'name']
}
</script>

<style lang="scss">
  .animation-content {
    width: 50%
  }
</style>
