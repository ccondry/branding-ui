<template>
  <form @submit.prevent="$emit('submit')">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Your Name">
          <b-input
          :value="name"
          placeholder="John Smith"
          required />
        </b-field>

        <b-field label="Phone">
          <b-input
          :value="phone"
          placeholder="5551112222"
          required />
        </b-field>

        <b-field label="Email">
          <b-input
          type="email"
          :value="email"
          placeholder="jsmith@cisco.com"
          required />
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button" type="button" @click="$parent.close()">Close</button> -->
        <button class="button is-primary" type="submit">Login</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['email', 'phone', 'name']
}
</script>
