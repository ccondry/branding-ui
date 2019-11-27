<template>
  <form @submit.prevent="$parent.close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ heading }}</p>
      </header>
      <section class="modal-card-body">
        <p class="content" v-html="text" />
        <table class="phone-list">
          <tr v-if="isUpstream">
            <td>{{ mainLabel }}</td>
            <td>&gt;</td>
            <td><strong>{{ uwf }}</strong></td>
          </tr>
          <tr v-if="!isUpstream">
            <td>{{ mainLabel }}</td>
            <td>&gt;</td>
            <td><strong>{{ main }}</strong></td>
          </tr>
          <tr v-if="isPcce && !isUpstream">
            <td>{{ goldLabel }}</td>
            <td>&gt;</td>
            <td><strong>{{ gold }}</strong></td>
          </tr>
          <tr v-if="isPcce && !isUpstream">
            <td>{{ vivrLabel }}</td>
            <td>&gt;</td>
            <td><strong>{{ vivr }}</strong></td>
          </tr>
          <tr v-if="isPcce || isUccx">
            <td>{{ aiLabel }}</td>
            <td>&gt;</td>
            <td><strong>{{ ai }}</strong></td>
          </tr>
        </table>
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
    'sessionInfo',
    'sessionConfig',
    'isPcce',
    'isUccx',
    'isInstantDemo',
    'isUpstream',
    'model',
    'isCwccV1',
    'dids',
    'cwccDid'
  ],
  methods: {
  },
  computed: {
    okButton () {
      return this.model.okButton
    },
    cancelButton () {
      return this.model.cancelButton
    },
    modalText () {
      return this.model.callModalText
    },
    heading () {
      return this.model.callText
    },
    mainLabel () {
      return this.model.callModalMainLabel
    },
    goldLabel () {
      return this.model.callModalGoldLabel
    },
    vivrLabel () {
      return this.model.callModalVivrLabel
    },
    aiLabel () {
      return this.model.callModalAiLabel
    },
    text () {
      return formatUnicorn(this.modalText, this.main)
    },
    main () {
      if (this.isCwccV1) {
        return this.cwccDid
      } else {
        // all others use the main 'phone' sent by the API
        return this.sessionInfo.phone.international
      }
    },
    uwf () {
      return this.sessionInfo.uwf.international
    },
    gold () {
      return this.sessionInfo.pq.international
    },
    vivr () {
      return this.sessionInfo.jacada.international
    },
    ai () {
      return this.sessionInfo.ai.international
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
.phone-list {
  td {
    padding-left: 0.4em;
    padding-right: 0.4em;
  }
}
</style>
