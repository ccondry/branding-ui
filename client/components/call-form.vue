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
            <td>
              <strong>{{ number.number }}</strong>
              <span v-show="isWebexV3Prod">ext. <strong>{{ sessionConfig.queueId }}</strong></span>
            </td>
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
      // returns the phone numbers to display
      const ret = []

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
      } else if (this.isPcce && this.demoVersion === 'wxccev1') {
        // Webex CCE v1
        // main
        ret.push({
          label: this.mainLabel,
          number: this.dids.DID7
        })
        // gold
        ret.push({
          label: this.goldLabel,
          number: this.gold
        })
        // AI
        ret.push({
          label: this.aiLabel,
          number: this.ai
        })
        // Portal Demo
        ret.push({
          label: 'Portal Demo',
          number: this.dids.DID2
        })
        // Portal Free
        ret.push({
          label: 'Portal Free',
          number: this.dids.DID3
        })

        return ret
      } else {
        // else = all other demos, not webex CCE v1 or PCCE 12.5 CVA Lab
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

        // all PCCE and UCCX have AI number, though PCCE 12.5 has different AI
        if (this.isUccx || (this.isPcce && this.demoVersion !== '12.5')) {
          ret.push({
            label: this.aiLabel,
            number: this.ai
          })
        }

        // PCCE 12.5 demo AI numbers
        if (this.isPcce && this.demoVersion === '12.5') {
          // AI label is for new CVP CVA feature
          ret.push({
            label: this.aiLabel,
            number: this.dids.DID2
          })
          // new "Custom AI" label is for the old Conversational IVR demo
          ret.push({
            label: this.customAiLabel,
            number: this.dids.DID6
          })
        }
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
    customAiLabel () {
      return this.model.callModalCustomAiLabel
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
