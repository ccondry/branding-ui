<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ heading }}
        </p>
      </header>
      <section class="modal-card-body">
        <p class="content">
          {{ modalText }}
        </p>

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

        <!-- <b-field :label="messageLabel" v-if="!isUccx">
          <b-input
          type="textarea"
          v-model="formData.message"
          placeholder="Message"
          />
        </b-field> -->
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
    message: {
      type: String,
      default: ''
    },
    heading: {
      type: String,
      default: ''
    },
    modalText: {
      type: String,
      default: ''
    },
    nameLabel: {
      type: String,
      default: ''
    },
    phoneLabel: {
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
    },
    isUccx: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      formData: {
        name: '',
        phone: ''
        // message: ''
      }
    }
  },

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
    this.formData.name = this.name
    // this.formData.message = this.message
  }
}
</script>

<style lang="scss" scoped>
.animation-content {
  width: 50%
}
.modal-card-foot {
  // pull the footer buttons to the right
  justify-content: flex-end !important;
}
</style>
