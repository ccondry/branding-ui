<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <p v-if="heading.length" class="modal-card-title">
        {{ heading }}
      </p>
    </header>
    <section class="modal-card-body">
      <div style="display: flex; justify-content: space-around;">
        <vue-qr :text="value" />
      </div>
      <div style="display: flex; justify-content: space-around;">
        <p v-if="description.length">
          {{ description }}
        </p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons" style="width: 100%; justify-content: flex-end;">
        <b-button
        type="is-success"
        @click="$parent.close()"
        >
          OK
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
import VueQr from 'vue-qr'

export default {
  components: {
    VueQr
  },
  
  props: {
    value: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      default () {
        return ''
      }
    },
    description: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>
