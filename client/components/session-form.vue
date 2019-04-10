<template>
  <form @submit.prevent="submit">
    <div class="modal-card" style="width: auto">

      <header class="modal-card-head">
        <p class="modal-card-title">Enter your dCloud demo session information</p>
      </header>
      <section class="modal-card-body">

        <!-- <b-loading :is-full-page="false" :active="loading" :can-cancel="false" style="z-index:1;"></b-loading> -->

        <b-field label="Datacenter" :message="datacenterMessage" :type="datacenterType">
          <b-select :disabled="loading" v-model="formData.datacenter" required placeholder="Choose Datacenter">
            <option disabled value="">Choose Datacenter</option>
            <option value="SJC">US West</option>
            <option value="RTP">US East</option>
            <option value="LON">EMEAR</option>
            <option value="SNG">APJ</option>
            <option value="CJP">CJP</option>
            <option value="RCDN">RCDN</option>
          </b-select>
        </b-field>

        <b-field label="Session ID" :message="sessionMessage" :type="sessionType">
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
        <button class="button is-success" type="submit">Submit</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: [
    'datacenter',
    'sessionId',
    'userId',
    'loading',
    'sessionInfo',
    'isInstantDemo',
    'brand',
    'sessionInfoError'
  ],

  mounted () {
    // copy props to data
    this.formData.datacenter = this.datacenter
    this.formData.sessionId = this.sessionId
    this.formData.userId = this.userId
    this.checkConfig()
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
    },
    formUserId () {
      return this.formData.userId
    },
    datacenterType () {
      if (this.sessionInfoError) return 'is-danger'
    },
    datacenterMessage () {
      if (this.sessionInfoError) {
        return `Invalid session information. Please check your
        datacenter selection and try again.`
      }
    },
    sessionType () {
      if (this.sessionInfoError) return 'is-danger'
    },
    sessionMessage () {
      if (this.sessionInfoError) {
        return `Invalid session information. Please check your
        session ID and try again.`
      }
    }
  },

  watch: {
    sessionInfo (val) {
      this.checkConfig()
    },
    formUserId (val) {
      // user typed into userId form field
      if (val.length === 4) {
        // clear the field message
        this.userIdMessage = ''
        this.userIdClass = ''
      }
    }
  },

  methods: {
    submit ($event) {
      this.$emit('submit', this.formData)
    },
    checkConfig () {
      if (!this.brand && this.isInstantDemo && !this.userId) {
        // userId is not set, but we know now it neds to be. alert user.
        this.userIdRequired = true
        this.userIdMessage = 'This demo is an instant demo, so your 4-digit user ID is required'
        this.userIdClass = 'is-danger'
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
