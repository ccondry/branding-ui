<template>
  <form @submit.prevent="submit">
    <div class="modal-card" style="width: auto">

      <header class="modal-card-head">
        <p class="modal-card-title">Enter your dCloud demo session information</p>
      </header>
      <section class="modal-card-body">

        <b-loading :is-full-page="false" :active="loading" :can-cancel="false" style="z-index:1;"></b-loading>

        <b-field label="Datacenter">
          <b-select :disabled="loading" v-model="formData.datacenter" required placeholder="Choose Datacenter">
            <option disabled value="">Choose Datacenter</option>
            <option value="SJC">US West</option>
            <option value="RTP">US East</option>
            <option value="LON">EMEAR</option>
            <option value="SNG">APJ</option>
          </b-select>
        </b-field>

        <b-field label="Session ID">
          <b-input
          :disabled="loading"
          v-model="formData.sessionId"
          placeholder="123456"
          required />
        </b-field>

        <b-field label="User ID (Only for Instant Demos)" :message="userIdMessage" :type="userIdClass">
          <b-input
          :disabled="loading"
          :required="userIdRequired"
          v-model="formData.userId"
          placeholder="" />
        </b-field>

      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button" type="button" @click="$parent.close()">Cancel</button> -->
        <button class="button is-success" type="submit" :disabled="!submitEnabled">Submit</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['datacenter', 'sessionId', 'userId', 'loading', 'sessionInfo', 'isInstantDemo', 'brand'],

  mounted () {
    // copy props to data
    this.formData.datacenter = this.datacenter
    this.formData.sessionId = this.sessionId
    this.formData.userId = this.userId
  },

  data () {
    return {
      userIdRequired: false,
      userIdMessage: '',
      userIdClass: '',
      formData: {
        datacenter: '',
        sessionId: '',
        userId: ''
      }
    }
  },

  computed: {
    submitEnabled () {
      if (this.isInstantDemo) {
        return this.formData.datacenter.length &&
        this.formData.sessionId.length >= 6 &&
        this.formData.userId.length === 4 &&
        !this.loading
      } else {
        return this.formData.datacenter.length &&
        this.formData.sessionId.length >= 6 &&
        !this.loading
      }
    }
  },

  watch: {
    sessionInfo (val) {
      if (!this.brand && this.isInstantDemo && !this.userId) {
        // userId is not set, but we know now it neds to be. alert user.
        this.userIdRequired = true
        this.userIdMessage = 'This demo is an instant demo, so your user ID is required'
        this.userIdClass = 'is-danger'
      }
    }
  },

  methods: {
    submit ($event) {
      this.$emit('submit', this.formData)
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
