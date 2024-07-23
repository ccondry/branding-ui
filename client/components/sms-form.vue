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
          {{ text }}
        </p>

        <b-field :label="phoneLabel">
          <b-input
          v-model="formData.phone"
          placeholder="5551112222"
          required
          />
        </b-field>
        <b-field label="Country">
          <b-select
          v-model="formData.country"
          >
            <option value="US">US</option>
            <option value="UK">UK</option>
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
import {formatUnicorn} from '../utils'

export default {
  props: {
    phone: {
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
    dnis: {
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
    }
  },

  data () {
    return {
      formData: {
        phone: '',
        country: 'US',
      }
    }
  },

  computed: {
    text () {
      return formatUnicorn(this.modalText, this.dnis)
    }
  },

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
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
