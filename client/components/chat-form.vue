<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ heading }}
        </p>
      </header>
      <section class="modal-card-body">
        <b-field :label="nameLabel">
          <b-input
          v-model="formData.name"
          placeholder="Jane Smith"
          required
          />
        </b-field>

        <b-field :label="phoneLabel">
          <b-input
          v-model="formData.phone"
          placeholder="5551112222"
          required
          />
        </b-field>

        <b-field :label="emailLabel">
          <b-input
          v-model="formData.email"
          placeholder="jsmith@gmail.com"
          required
          />
        </b-field>

        <b-field :label="messageLabel">
          <b-input
          v-model="formData.message"
          type="textarea"
          placeholder="Message"
          required
          />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          {{ cancelButton }}
        </button>
        <button class="button is-success" type="submit">
          {{ sendButton }}
        </button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    phone: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    heading: {
      type: String,
      default: ''
    },
    nameLabel: {
      type: String,
      default: ''
    },
    emailLabel: {
      type: String,
      default: ''
    },
    phoneLabel: {
      type: String,
      default: ''
    },
    messageLabel: {
      type: String,
      default: ''
    },
    cancelButton: {
      type: String,
      default: ''
    },
    sendButton: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      formData: {
        name: '',
        phone: '',
        email: '',
        message: ''
      }
    }
  },

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
    this.formData.name = this.name
    this.formData.email = this.email
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
