<template>
  <div>
    <b-loading :is-full-page="false" :active="loading.app.demoSelectors || loading.cce.callType || loading.cce.precisionQueue" :can-cancel="false"></b-loading>
    <div class="table-responsive">
      <table class="table is-bordered is-striped is-narrow">

        <thead>
          <tr>
            <!-- <th class="is-hidden-mobile">Name</th> -->
            <!-- <th>External DNIS 1</th> -->
            <th>Name</th>
            <th class="is-hidden-mobile">ID</th>
            <th>Call Type</th>
            <th>Precision Queue</th>
            <th>Demo Script</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody v-for="map in didMap">
          <tr>
            <!-- Name -->
            <td>
              <p>
                <div v-if="type === 'inbound' || type === 'ccb'">
                  <dynamic-did inline-template :prefix="didPrefix" :map="map" :dids="dids" :dialMode="dialMode">
                    <span><a :href="`${dialMode}:${did.international}`">{{ did.international }}</a></span>
                  </dynamic-did>
                </div>
                <div v-else>
                  <static-did inline-template :model="staticDids[map.name]" :dialMode="dialMode">
                    <span v-if="mrdName === 'Cisco_Voice'"><a :href="`${dialMode}:${did}`">{{ did }}</a></span>
                    <span v-else>{{ did }}</span>
                  </static-did>
                </div>
              </p>
            </td>
            <!-- ID -->
            <td class="is-hidden-mobile">
              <span v-if="mrdName === 'Cisco_Voice'"><a :href="`sip:${map.internal}`">{{ map.internal }}</a></span>
              <span v-else>{{ map.internal }}</span>
            </td>
            <!-- Call Type -->
            <td class="is-hidden-mobile">
              <demo-cce-data
              inline-template
              :demos="myDemos[map.internal]"
              :defaults="inboundDefaults[map.internal]"
              :objects="callTypes"
              :loading="loading.app.demoSelectors || cceLoading.callType"
              variable="user.CTID">
              <span>{{ name }}</span></demo-cce-data>
            </td>
            <!-- Precision Queue -->
            <td class="is-hidden-mobile">
              <demo-cce-data
              inline-template
              :demos="myDemos[map.internal]"
              :defaults="inboundDefaults[map.internal]"
              :objects="precisionQueues"
              :loading="loading.app.demoSelectors || cceLoading.precisionQueue"
              variable="user.PQID">
              <span>{{ name }}</span></demo-cce-data>
            </td>
            <!-- Demo Script -->
            <td>
              <did-demo inline-template
              :map="map"
              :demos="myDemos"
              :defaults="inboundDefaults"
              :demos-list="inboundDemos"
              v-on:edit-demo="editDemo">
              <span>
                {{ link || 'Not Configured' }}
              </span></did-demo>
            </td>
            <!-- Actions -->
            <td>
              <button class="button is-primary"
              v-if="configurable(map)"
              @click.prevent="editDemo(map)">Configure</button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <select-demo-modal
    v-if="showModal"
    ref="modal"
    :demos-list="inboundDemos"
    :visible="showModal"
    :title="modalTitle"
    :demo="modalDemo"
    :call-types="callTypes"
    :precision-queues="precisionQueues"
    :map="modalMap"
    :eccVars="eccVars"
    :my-department="myDepartment"
    :mrd="mrd"
    :user="user"
    @close="showModal = false"
    @submit="saveDemo"></select-demo-modal>

  </div>
</template>

<script>
import Vue from 'vue'
import PhoneNumber from 'awesome-phonenumber'
import SelectDemoModal from './modals/select-demo.vue'
import SelectInput from './select-input.vue'

const DynamicDid = Vue.component('DynamicDid', {
  props: ['prefix', 'map', 'dids', 'dialMode'],
  computed: {
    did () {
      try {
        let thisDid = this.dids.find(v => v.name === this.map.name).number
        // remove spaces
        thisDid = thisDid.replace(' ', '')
        let phone
        // prefix exists in DID?
        if (thisDid.indexOf(this.prefix) === 0) {
          // prefix already exists - don't add it again
          phone = thisDid
        } else {
          // need to add prefix
          phone = this.prefix + thisDid
        }
        const pn = new PhoneNumber(phone)
        // console.log(pn)
        return {
          rfc3966: pn.getNumber('rfc3966'),
          international: pn.getNumber('international')
        }
      } catch (e) {
        return ''
      }
    }
  }
})

const StaticDid = Vue.component('StaticDid', {
  props: ['model', 'dialMode'],
  computed: {
    did () {
      try {
        const pn = new PhoneNumber(this.model)
        // console.log(pn)
        const ret = pn.getNumber('international')
        if (ret) {
          return ret
        } else {
          // if not a phone number, return the model itself (hopefully a string)
          return this.model
        }
      } catch (e) {
        // if not a phone number, return the model itself (hopefully a string)
        return this.model
      }
    }
  }
})

const CallType = Vue.component('CallType', {
  props: ['model', 'options', 'variable'],
  components: {
    SelectInput
  },
  computed: {
    ctId () {
      try {
        return this.model.params.eccVar.find(v => v.name === this.variable).value
      } catch (e) {
        return {params: {eccVar: [{name: this.variable, value: '5000'}]}}
      }
    }
  }
})

const DemoCceData = Vue.component('DemoCceData', {
  props: ['demos', 'defaults', 'objects', 'variable', 'loading'],
  components: {
    SelectInput
  },
  computed: {
    name () {
      if (this.loading === true) {
        return 'Loading...'
      }
      try {
        return this.objects.find(v => v.id === this.ctId).name
      } catch (e) {
        return 'None'
      }
    },
    ctId () {
      try {
        // return this users demo parameters
        return this.demos.params.eccVar.find(v => v.name === this.variable).value
      } catch (e) {
        try {
          // return default parameters
          return this.defaults.params.eccVar.find(v => v.name === this.variable).value
        } catch (e2) {
          // return dummy data if nothing else
          return {params: {eccVar: [{name: this.variable, value: '5000'}]}}
        }
      }
    }
  }
})

const DidDemo = Vue.component('DidDemo', {
  props: ['map', 'demos', 'defaults', 'loading', 'demosList'],
  computed: {
    link () {
      try {
        if (this.demos[this.map.internal]) {
          // return user-configured demo
          const demo = this.demos[this.map.internal]
          // get the name of the configured demo's ID from the master list of demos
          // or default to the demo ID
          return this.demosList[demo.demo].name || demo.demo
        } else if (this.defaults[this.map.internal]) {
          // return default demo
          // get the name of the default demo's ID from the master list of demos
          // or default to the demo ID
          const demo = this.defaults[this.map.internal]
          return this.demosList[demo.demo].name || demo.demo
        } else {
          // still loading
          return 'Loading...'
        }
      } catch (e) {
        try {
          return this.demos[this.map.internal].demo
        } catch (e) {
          return 'Loading...'
        }
      }
    }
  }
})

export default {
  props: {
    'dids': {},
    'user': {},
    'didMap': {},
    'didPrefix': {},
    'type': {},
    'mrdName': {
      default: 'Cisco_Voice'
    },
    'inboundDemos': {},
    'inboundDefaults': {},
    'staticDids': {},
    'cceObjects': {},
    'myDemos': {},
    'loading': {},
    'myDepartment': {},
    'configurableDids': {
      default: []
    }
  },
  components: {
    // DemoDisplay,
    DidDemo,
    StaticDid,
    CallType,
    // SelectInput,
    SelectDemoModal,
    DemoCceData,
    DynamicDid
  },
  data () {
    return {
      userString: '',
      modalMap: {},
      modalDemo: {},
      modalTitle: '',
      showModal: false,
      dialMode: 'tel' // or 'sip'
    }
  },
  computed: {
    cceLoading () {
      return this.loading.cce || {}
    },
    mrd () {
      try {
        return this.mrds.find(v => v.name.toLowerCase() === this.mrdName.toLowerCase())
      } catch (e) {
        return {}
      }
    },
    mrds () {
      return this.cceObjects['mediaRoutingDomain'] || []
    },
    eccVars () {
      return this.cceObjects['expandedCallVariable'] || []
    },
    callTypes () {
      return this.cceObjects['callType'] || []
    },
    precisionQueues () {
      return this.cceObjects['precisionQueue'] || []
    },
    departments () {
      return this.cceObjects['department'] || []
    },
    callTypeOptions () {
      return this.filteredCallTypes.map(v => {
        return {
          value: v.id,
          text: v.name
        }
      })
    },
    precisionQueueOptions () {
      return this.filteredPrecisionQueues.map(v => {
        return {
          value: v.id,
          text: v.name
        }
      })
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    configurable (map) {
      return this.user.admin || this.configurableDids.includes(map.internal)
    },
    saveDemo (data) {
      console.log('save demo emit received. data =', data)
      this.$emit('save', data)
      this.showModal = false
    },
    editDemo (map) {
      console.log('clicked edit demo for', map)
      this.modalTitle = `Change Demo for ${map.name} (${map.internal})`
      // this.modalTitle = `Choose Demo`
      this.modalDemo = this.myDemos[map.internal] || this.inboundDefaults[map.internal]
      console.log('modalDemo =', this.modalDemo)
      this.modalMap = map
      this.showModal = true
      // force the modal to be active, even if it was dismissed by the internal deactive() method
      // this.$refs['modal'].$children[0].active()
      // console.log(this)
      // this.CardModal.$children[0].active()
      if (this.$refs['modal']) {
        this.$refs['modal'].$children[0].active()
      }
    }
  }
}
</script>
