<template>
  <form @submit.prevent="$parent.close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ heading }}</p>
      </header>
      <section class="modal-card-body">
        <p class="content" v-html="text" />
        <table class="phone-list">
          <tr v-for="(number, index) of numbers" :key="index">
            <td>{{ number.label }}</td>
            <td>&gt;</td>
            <td><strong>{{ number.number }}</strong></td>
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
    'cwccDid',
    'demoVersion',
    'isWebexV3Prod'
  ],
  methods: {
  },
  computed: {
    numbers () {
      const ret = []
      // returns the phone numbers to display
      if (this.isPcce && this.demoVersion === '12.5CVA') {
      // PCCE 12.5CVA lab
        ret.push({
          label: this.mainLabel,
          number: this.dids.DID7
        })
        ret.push({
          label: 'DF',
          number: this.dids.DID8
        })
        ret.push({
          label: 'DF Param',
          number: this.dids.DID9
        })
        ret.push({
          label: 'DF Transcribe',
          number: this.dids.DID10
        })
        // return
        return ret
      }

      // main number for all demos
      ret.push({
        label: this.mainLabel,
        number: this.main
      })

      // normal PCCE, not with Upstream and not 12.5CVA lab, has gold and VIVR numbers
      if (this.isPcce && !this.isUpstream) {
        ret.push({
          label: this.goldLabel,
          number: this.gold
        })
        ret.push({
          label: this.vivrLabel,
          number: this.vivr
        })
      }

      // all PCCE and UCCX have AI number
      if (this.isPcce || this.isUccx) {
        ret.push({
          label: this.aiLabel,
          number: this.ai
        })
      }
      return ret
    },
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
      // main phone number
      if (this.isCwccV1 || this.isWebexV3Prod) {
        // webex CC v1/v2/v3
        return this.cwccDid
      } else if (this.isUpstream) {
        // upstream PCCE demo
        return this.sessionInfo.uwf.international
      } else {
        // all others use the main 'phone' sent by the API
        return this.sessionInfo.phone.international
      }
    },
    gold () {
      return this.sessionInfo.pq.international
    },
    vivr () {
      return this.sessionInfo.jacada.international
    },
    ai () {
      if (this.demoVersion === '12.5CVA') {
        return this.dids.DID2
      } else {
        return this.sessionInfo.ai.international
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
.phone-list {
  td {
    padding-left: 0.4em;
    padding-right: 0.4em;
  }
}
</style>
