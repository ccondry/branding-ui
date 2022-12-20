<template>
  <form @submit.prevent="$parent.close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ heading }}
        </p>
      </header>
      <section class="modal-card-body">
        <table class="phone-list">
          <tr v-for="(number, index) of numbers" :key="index">
            <td>{{ number.label }}</td>
            <td>&gt;</td>
            <td>
              <strong>{{ number.number }}</strong>
              <span v-show="number.extension">ext. <strong>{{ number.extension }}</strong></span>
            </td>
          </tr>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          {{ cancelButton }}
        </button>
        <button class="button is-success" @click="$parent.close()">
          {{ okButton }}
        </button>
      </footer>
    </div>
  </form>
</template>

<script>
import {fillOption} from '../utils'
import {mapGetters} from 'vuex'

export default {
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'sessionInfo',
      'sessionConfig',
      'isPcce',
      'isUccx',
      'isInstantDemo',
      'isUpstream',
      'isCwccV1',
      'dids',
      'cwccDid',
      'demoVersion',
      'isWebexV3Prod',
      'isWebexV4Prod',
      'isWebexV6',
      'demoBaseConfig'
    ]),
    numbers () {
      // returns the phone numbers to display
      // return only main number for upstream
      if (this.isUpstream) {
        return [{
          label: this.model.callModalMainLabel,
          number: this.dids.DID10
        }]
      }
      // does this demo have base config from cumulus-api?
      // use the demoBaseConfig to configure phone numbers
      return this.demoBaseConfig.call.map(v => {
        // replace values like ${model.callModalMainLabel} with data from this.model
        const label = fillOption(v.label, 'model', this.model)

        let number = v.number
        // replace values like ${dids.DID1} variables with data from this.dids
        number = fillOption(number, 'dids', this.dids)
        // replace ${cwccDid} variable
        number = number.replace(/\${cwccDid}/, this.cwccDid)
        // replace variables like ${sessionConfig.phone}
        number = fillOption(number, 'sessionConfig', this.sessionConfig)

        // replace variables like ${sessionConfig.queueId}
        const extension = fillOption(v.extension, 'sessionConfig', this.sessionConfig)

        return {label, number, extension}
      })
    },
    okButton () {
      return this.model.okButton
    },
    cancelButton () {
      return this.model.cancelButton
    },
    heading () {
      return this.model.callText
    },
    main () {
      // main phone number
      if (this.isCwccV1 || this.isWebexV3Prod || this.isWebexV4Prod || this.isWebexV6) {
        // webex CC v1/v2/v3/4
        return this.cwccDid
      } else if (this.isUpstream) {
        // upstream PCCE demo
        return this.sessionInfo.uwf.international
      } else {
        // all others use the main 'phone' sent by the API
        return this.sessionInfo.phone.international
      }
    }
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
.phone-list {
  td {
    padding-left: 0.4em;
    padding-right: 0.4em;
  }
}
</style>
