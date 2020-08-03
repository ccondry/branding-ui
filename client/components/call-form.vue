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
              <span v-show="showExtension">ext. <strong>{{ sessionConfig.queueId }}</strong></span>
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
import {mapGetters} from 'vuex'

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
  computed: {
    ...mapGetters([
      'isWebexV4Prod'
    ]),
    showExtension () {
      return this.isWebexV3Prod || this.isWebexV4Prod
    },
    numbers () {
      // returns the phone numbers to display

      // return only main number for upstream
      if (this.isUpstream) {
        return [{
          label: this.mainLabel,
          number: this.main
        }]
      }

      // UCCX 12.5 demo (any revision)
      if (this.isUccx && this.demoVersion.startsWith('12.5')) {
        return [{
          label: this.mainLabel,
          number: this.main
        }, {
          label: this.wxmLabel,
          number: this.dids.DID9
        }, {
          label: this.aiLabel,
          number: this.dids.DID6
        }]
      }

      // PCCE 12.5 demo (any revision)
      if (this.isPcce && this.demoVersion.startsWith('12.5')) {
        // 12.5 no upstream
        return [{
          label: this.mainLabel,
          number: this.main
        }, {
          label: this.wxmLabel,
          number: this.dids.DID1
        }, {
          label: this.goldLabel,
          number: this.gold
        }, {
          label: this.vivrLabel,
          number: this.vivr
        }, {
          label: this.model.callModalCvaAiLabel,
          number: this.dids.DID2
        }, {
          label: this.model.callModalCustomAiLabel,
          number: this.dids.DID6
        }]
      }

      const ret = []

      // PCCE 12.5CVA lab
      if (this.isPcce && this.demoVersion === '12.5CVA') {
        return [{
          label: this.mainLabel,
          number: this.dids.DID7
        }, {
          label: 'DF',
          number: this.dids.DID8
        }, {
          label: 'DF Param',
          number: this.dids.DID9
        }, {
          label: 'DF Transcribe',
          number: this.dids.DID10
        }]
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
        // else = all other demos
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

        // all 11.x and 12.0 PCCE and UCCX have AI number, though PCCE 12.5 has different AI
        if (this.isUccx || (this.isPcce && this.demoVersion !== '12.5v1')) {
          ret.push({
            label: this.aiLabel,
            number: this.ai
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
    wxmLabel () {
      return this.model.callModalWxmLabel
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
      if (this.isCwccV1 || this.isWebexV3Prod || this.isWebexV4Prod) {
        // webex CC v1/v2/v3/4
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
