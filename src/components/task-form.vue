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
          placeholder=""
          required
          />
        </b-field>

        <b-field :label="phoneLabel">
          <b-input
          v-model="formData.phone"
          type="phone"
          placeholder=""
          required
          />
        </b-field>

        <b-field :label="emailLabel">
          <b-input
          v-model="formData.email"
          type="email"
          placeholder=""
          required
          />
        </b-field>

        <b-field :label="requestTypeLabel">
          <b-select
          v-model="formData.task"
          required
          placeholder=""
          >
            <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.text"
            >
              {{ option.text }}
            </option>
          </b-select>
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
    'options': {
      required: true,
      type: Object
    },
    'phone': {
      type: String,
      default: ''
    },
    'email': {
      type: String,
      default: ''
    },
    'name': {
      type: String,
      default: ''
    },
    'heading': {
      type: String,
      default: ''
    },
    'modalText': {
      type: String,
      default: ''
    },
    'phoneLabel': {
      type: String,
      default: ''
    },
    'nameLabel': {
      type: String,
      default: ''
    },
    'emailLabel': {
      type: String,
      default: ''
    },
    'requestTypeLabel': {
      type: String,
      default: ''
    },
    'messageLabel': {
      type: String,
      default: ''
    },
    'cancelButton': {
      type: String,
      default: ''
    },
    'sendButton': {
      type: String,
      default: ''
    },
    'task': {
      type: [String, Object],
      default: ''
    }
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
  },

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
    this.formData.email = this.email
    this.formData.name = this.name
    this.formData.task = this.task
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
