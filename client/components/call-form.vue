<template>
  <form @submit.prevent="$parent.close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ heading }}</p>
      </header>
      <section class="modal-card-body">
        <p class="content" v-html="text" />
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">{{ cancelButton }}</button>
        <button class="button is-success" @click="$parent.close()">{{ okButton }}</button>
      </footer>
    </div>
  </form>
</template>

<script>
import {formatUnicorn} from '../utils'

export default {
  props: [
    'dnis',
    'modalText',
    'heading',
    'cancelButton',
    'okButton'
  ],
  methods: {
  },
  computed: {
    text () {
      return formatUnicorn(this.modalText, this.dnis)
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
