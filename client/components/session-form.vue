<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Enter your dCloud demo session information</p>
      </header>
      <section class="modal-card-body">

        <b-field label="Datacenter">
          <b-select v-model="formData.datacenter" placeholder="Choose Datacenter">
            <option disabled value="">Choose Datacenter</option>
            <option value="RTP">US East</option>
            <option value="SJC">US West</option>
            <option value="LON">EMEAR</option>
            <option value="SNG">APJ</option>
          </b-select>
        </b-field>

        <b-field label="Session ID">
          <b-input
          v-model="formData.sessionId"
          placeholder="123456"
          required />
        </b-field>

        <b-field label="User ID (only for instant demos)">
          <b-input
          v-model="formData.userId"
          placeholder="" />
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
  props: ['datacenter', 'sessionId', 'userId'],

  mounted () {
    // copy props to data
    this.formData.datacenter = this.datacenter
    this.formData.sessionId = this.sessionId
    this.formData.userId = this.userId
  },

  data () {
    return {
      formData: {
        datacenter: '',
        sessionId: '',
        userId: ''
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
