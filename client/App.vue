<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="loading.dcloud.sessionInfo || loading.dcloud.brand" :can-cancel="false" />

    <!-- Session info modal -->
    <b-modal :active.sync="showSessionInfoModal"
    :can-cancel="false"
    has-modal-card
    width="960"
    >
      <session-form
      :loading="loading.dcloud.sessionInfo"
      :datacenter="datacenter"
      :session-id="sessionId"
      :is-instant-demo="isInstantDemo"
      :session-info="sessionInfo"
      :session-info-error="sessionInfoError"
      :brand="brand"
      :user-id="userId"
      @submit="clickSubmitSessionInfo"
      />
    </b-modal>

    <!-- Email modal -->
    <b-modal :active.sync="showEmailModal"
    :can-cancel="true"
    has-modal-card
    width="960"
    >
      <email-form :send-button="model.sendButton"
      :cancel-button="model.cancelButton"
      :heading="model.emailText"
      :modal-text="model.emailModalText"
      :email-label="model.emailLabel"
      :name-label="model.nameLabel"
      :message-label="model.messageLabel"
      :subject-label="model.subjectLabel"
      :name="name"
      :email="email"
      :subject="subject"
      :body="body"
      @submit="clickSubmitEmail"
      />
    </b-modal>

    <!-- SMS modal -->
    <b-modal :active.sync="showSmsModal"
    :can-cancel="true"
    has-modal-card
    width="960"
    >
      <sms-form v-if="sessionInfo.sms"
      :send-button="model.sendButton"
      :cancel-button="model.cancelButton"
      :dnis="sessionInfo.sms.international"
      :phone-label="model.phoneLabel"
      :modal-text="model.smsModalText"
      :heading="model.smsText"
      :phone="phone"
      @submit="clickSubmitSms"
      />
    </b-modal>

    <!-- Task Routing modal -->
    <b-modal :active.sync="showTaskModal"
    :can-cancel="true"
    has-modal-card
    width="960"
    >
      <task-form :send-button="model.sendButton"
      :cancel-button="model.cancelButton"
      :heading="model.taskText"
      :modal-text="model.taskModalText"
      :options="demoConfig.taskOptions || [{text: 'Report a Problem'}]"
      :email-label="model.emailLabel"
      :phone-label="model.phoneLabel"
      :name-label="model.nameLabel"
      :message-label="model.messageLabel"
      :request-type-label="model.requestTypeLabel"
      :name="name"
      :phone="phone"
      :email="email"
      :task="task"
      @submit="clickSubmitTask"
      />
    </b-modal>

    <!-- Voice Callback modal -->
    <b-modal :active.sync="showCallbackModal"
    :can-cancel="true"
    has-modal-card
    width="960"
    >
      <callback-form :send-button="model.sendButton"
      :cancel-button="model.cancelButton"
      :heading="model.callbackText"
      :modal-text="model.callbackModalText"
      :email-label="model.emailLabel"
      :phone-label="model.phoneLabel"
      :name-label="model.nameLabel"
      :message-label="model.messageLabel"
      :is-uccx="isUccx"
      :name="name"
      :phone="phone"
      :message="message"
      @submit="clickSubmitCallback"
      />
    </b-modal>

    <!-- Inbound Voice Call modal -->
    <b-modal :active.sync="showCallModal"
    :can-cancel="true"
    has-modal-card
    width="960"
    >
      <call-form v-if="Object.keys(sessionInfo)" :model="model" />
    </b-modal>

    <!-- Chat modal -->
    <b-modal :active.sync="showChatModal"
    :can-cancel="true"
    has-modal-card
    width="960"
    >
      <chat-form :send-button="model.sendButton"
      :cancel-button="model.cancelButton"
      :heading="model.chatHeading"
      :email-label="model.emailLabel"
      :phone-label="model.phoneLabel"
      :name-label="model.nameLabel"
      :message-label="model.messageLabel"
      :name="name"
      :email="email"
      :phone="phone"
      @submit="clickSubmitChat"
      />
    </b-modal>

    <!-- Main page content -->
    <span id="main-content">
      <!-- background iframe -->
      <iframe :src="model.iframe" class="demo-iframe" />

      <!-- talk to an expert button (button to open contact panel) -->
      <transition name="slide">
        <button
        v-show="!showContactPanel && loaded"
        id="contact-toggle-button"
        class="button"
        @click="showContactPanel = true"
        >
          <strong>{{ model.contactButtonText }}</strong>
        </button>
      </transition>

      <!-- contact panel -->
      <transition name="slide">
        <div v-show="showContactPanel" id="contact-panel-container">
          <div id="contact-panel">
            <!-- Chat Bot -->
            <b-collapse v-show="showChatBot" class="card">
              <div class="card-header" role="button" @click="hideChatBot">
                <p class="card-header-title contact-title">
                  {{ model.chatMenuTitle }}
                </p>

                <a class="card-header-icon contact-close-icon">
                  <b-icon icon="close" />
                </a>
              </div>

              <div style="height: 70vh;">
                <iframe :src="chatIframe" class="demo-iframe" />
              </div>
            </b-collapse>
            <!-- /Chat Bot -->
            <!-- Contact Menu -->
            <b-collapse v-show="!showChatBot" class="card">
              <div class="card-header" role="button" @click="showContactPanel = false">
                <p class="card-header-title contact-title">
                  {{ model.menuTitle }}
                </p>

                <a class="card-header-icon contact-close-icon">
                  <b-icon icon="close" />
                </a>
              </div>

              <div v-if="model.advisorEnabled" class="card-content contact-content">
                <img :src="model.advisorImage" style="height: 7em;">
                <span style="float: right; font-size: 1.8em;">
                  <p>{{ model.advisorHeading }}</p>
                  <p>{{ model.advisorText }}</p>
                </span>
              </div>

              <!-- render each contact option -->
              <footer v-for="(item, key) of contactOptions" :key="key" class="card-footer contact-item">
                <a class="card-footer-item" @click="item.click">
                  <b-icon class="contact-icon" :icon="item.icon" />
                  <div class="content">
                    <h4>{{ item.heading }}<small v-if="item.waitTime"> - {{ item.waitTime }}</small></h4>
                    <p class="contact-subtext">{{ item.subtext }}</p>
                  </div>
                </a>
              </footer>

            </b-collapse>
            <!-- /Contact Menu -->
          </div>
        </div>
      </transition>

    </span>

    <!-- any IMI / Webex Connect chat-->
    <div
    v-if="demoBaseConfig"
    id="divicw"
    :data-bind="demoBaseConfig.imiConnectId"
    data-org=""
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SessionForm from './components/session-form.vue'
import EmailForm from './components/email-form.vue'
import SmsForm from './components/sms-form.vue'
import TaskForm from './components/task-form.vue'
import CallbackForm from './components/callback-form.vue'
import CallForm from './components/call-form.vue'
import CallQrForm from './components/call-qr-form.vue'
import ChatForm from './components/chat-form.vue'
import defaultBrandConfig from './store/modules/default-brand-config'
import {formatUnicorn} from './utils'

function setQueryStringParameter (name, value) {
  const params = new window.URLSearchParams(window.location.search)
  params.set(name, value)
  window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}?${params}`))
}

export default {

  components: {
    SessionForm,
    EmailForm,
    SmsForm,
    TaskForm,
    CallbackForm,
    CallForm,
    ChatForm
  },

  data () {
    return {
      eceDockedChatLoaded: false,
      name: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      subject: '',
      body: '',
      message: '',
      task: null,
      loaded: false,
      qs: {},
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0,
      dragging: false,
      production: process.env.NODE_ENV === 'production',
      showSessionInfoModal: false,
      showContactPanel: false,
      showEmailModal: false,
      showSmsModal: false,
      showTaskModal: false,
      showCallbackModal: false,
      showCallModal: false,
      showChatModal: false,
      showChatBot: false,
      chatIframe: '',
      model: defaultBrandConfig
    }
  },

  computed: {
    ...mapGetters([
      'loading',
      'endpoints',
      'chatBotEnabled',
      'demoUsesInboundVoice',
      'demoUsesCallQr',
      'hasSessionInfo',
      'isCjp',
      'isCjpCcone',
      'isCjpWebex',
      'isCwcc',
      'isCwccV1',
      'isEce',
      'isInstantDemo',
      'isMsDynamics',
      'isPcce',
      'isRcdn',
      'isServiceNow',
      'isSfdc',
      'isTsaCwcc',
      'isUccx',
      'isUpstream',
      'isWebexCustom',
      'isWebexConnect',
      'isWebexV3Prod',
      'isWebexV4Prod',
      'isWebexV6',
      'isPcceWebexConnect',
      'sessionInfo',
      'sessionConfig',
      'brand',
      'brandConfig',
      'userId',
      'datacenter',
      'sessionId',
      'sessionInfoError',
      'demoBaseConfig',
      'demoConfig',
      'dids',
      'cwccDid',
      'demoVersion',
      'multichannelOptions'
    ]),
    contactOptions () {
      // build all possible contact options
      const chat = {
        click: this.clickChat,
        icon: this.model.chatIcon,
        heading: this.model.chatHeading,
        subtext: this.model.chatText,
        waitTime: this.model.chatWaitTime
      }
      const chatBot = {
        click: this.clickChat,
        icon: this.model.chatBotIcon,
        heading: this.model.chatBotHeading,
        subtext: this.model.chatBotText,
        waitTime: this.model.chatBotWaitTime
      }
      const chatTranslation = {
        click: this.clickChatTranslation,
        icon: this.model.chatTranslationIcon,
        heading: this.model.chatTranslationHeading,
        subtext: this.model.chatTranslationText,
        waitTime: this.model.chatTranslationWaitTime
      }
      const sms = {
        click: this.clickSms,
        icon: this.model.smsIcon,
        heading: this.model.smsHeading,
        subtext: this.model.smsText,
        waitTime: this.model.smsWaitTime
      }
      const smsBot = {
        click: this.clickSms,
        icon: this.model.smsBotIcon,
        heading: this.model.smsBotHeading,
        subtext: this.model.smsBotText,
        waitTime: this.model.smsBotWaitTime
      }
      const call = {
        click: this.clickCall,
        icon: this.model.callIcon,
        heading: this.model.callHeading,
        subtext: this.model.callText,
        waitTime: this.model.callWaitTime
      }
      const callQr = {
        click: this.clickCallQr,
        icon: this.model.callQrIcon,
        heading: this.model.callQrHeading,
        subtext: this.model.callQrText,
        waitTime: this.model.callQrWaitTime
      }
      const callback = {
        click: this.clickCallback,
        icon: this.model.callbackIcon,
        heading: this.model.callbackHeading,
        subtext: this.model.callbackText,
        waitTime: this.model.callbackWaitTime
      }
      const email = {
        click: this.clickEmail,
        icon: this.model.emailIcon,
        heading: this.model.emailHeading,
        subtext: this.model.emailText,
        waitTime: this.model.emailWaitTime
      }
      const task = {
        click: this.clickTask,
        icon: this.model.taskIcon,
        heading: this.model.taskHeading,
        subtext: this.model.taskText,
        waitTime: this.model.taskWaitTime
      }
      const cobrowse = {
        click: this.clickCobrowse,
        icon: this.model.cobrowseIcon,
        heading: this.model.cobrowseHeading,
        subtext: this.model.cobrowseText,
        waitTime: this.model.cobrowseWaitTime
      }

      // determine which options are enabled for this demo type and vertical
      const ret = []
      if (
        // if the demo base config exists
        this.demoBaseConfig &&
        // and the demo base config has channels defined
        this.demoBaseConfig.channels
      ) {
        const channels = this.demoBaseConfig.channels

        // chat
        if (
          // if demo has chat
          channels.includes('chat') &&
          // and the current multichannel type has chat
          this.multichannelOptions.includes('chat') &&
          // and is not webex connect demo (which uses separate chat UI)
          !this.isWebexConnect
        ) {
          // show either chat or chatbot option
          // if chat is enabled in the vertical and multichannel is upstream
          if (this.model.chatEnabled && this.isUpstream) {
            // add Chat Live option
            ret.push(chat)
          } else if (
            // if chat is enabled
            this.model.chatEnabled &&
            // and chat bot is disabled
            !this.demoConfig.chatBotEnabled
          ) {
            // add Chat Live option
            ret.push(chat)
          } else if (
            // if vertical has chat bot enabled
            this.model.chatBotEnabled &&
            // and the demo has chat bot enabled
            this.demoConfig.chatBotEnabled
          ) {
            // add Chat Bot option
            ret.push(chatBot)
            if (
              // if chat translation is enabled in demo base config
              channels.includes('chatTranslation') &&
              // and if multichannel is set to ECE
              this.isEce &&
              // and if vertical config has chat translation enabled (default true)
              this.model.chatTranslationEnabled
            ) {
              // add Chat Translation option
              ret.push(chatTranslation)
            }
          }
        }

        // SMS
        if (channels.includes('sms') && this.multichannelOptions.includes('sms')) {
          if (this.model.smsEnabled && !this.demoConfig.chatBotEnabled) {
            // direct SMS to agent, no chat bot
            ret.push(sms)
          } else if (this.model.smsBotEnabled && this.demoConfig.chatBotEnabled) {
            // SMS bot
            ret.push(smsBot)
          }
        }

        // voice call
        if (
          channels.includes('voice') &&
          this.multichannelOptions.includes('voice') &&
          this.model.callEnabled
        ) {
          ret.push(call)
        }

        // voice call using QR code
        if (this.demoUsesCallQr && Array.isArray(this.demoBaseConfig.callQr)) {
          // create an entry for each QR code button
          for (const j of this.demoBaseConfig.callQr) {
            ret.push({
              icon: j.icon,
              heading: j.heading,
              subtext: j.subtext,
              waitTime: j.waitTime,
              click: () => this.clickCallQr(j)
            })
          }
        }

        // voice callback
        if (
          channels.includes('callback') &&
          this.multichannelOptions.includes('callback') &&
          this.model.callbackEnabled
        ) {
          ret.push(callback)
        }

        // email
        if (
          channels.includes('email') &&
          this.multichannelOptions.includes('email') &&
          this.model.emailEnabled
        ) {
          ret.push(email)
        }

        // task
        if (
          channels.includes('task') &&
          this.multichannelOptions.includes('task') &&
          this.model.taskEnabled
        ) {
          ret.push(task)
        }

        // cobrowse
        if (
          channels.includes('cobrowse') &&
          this.multichannelOptions.includes('cobrowse') &&
          this.model.cobrowseEnabled
        ) {
          ret.push(cobrowse)
        }

        // JDS buttons
        if (
          // if the demo has JDS feature enabled
          typeof this.demoBaseConfig === 'object' &&
          Array.isArray(this.demoBaseConfig.features) &&
          this.demoBaseConfig.features.includes('jds') &&
          // and the brand has JDS buttons enabled
          this.model.jdsEnabled &&
          // and jdsButtons is an array
          Array.isArray(this.model.jdsButtons)
        ) {
          // create an entry for each JDS button
          for (const j of this.model.jdsButtons) {
            ret.push({
              icon: j.icon,
              heading: j.heading,
              subtext: j.subtext,
              waitTime: j.waitTime,
              click: () => this.clickJds(j)
            })
          }
        }
      }

      // done
      return ret
    }
  },

  watch: {
    model (val) {
      console.log('model changed. updating view...')
      this.updateView(val)
    },
    sessionInfo (val) {
      console.log('sessionInfo changed')
      // make sure instant demo has user ID set
      if (val.instant && (!this.userId || this.userId.length !== 4)) {
        console.log('this is instant demo, but user did not provide user ID. popping session info modal...')
        // pop session info modal again
        this.showSessionInfoModal = true
      } else {
        // console.log('getting base demo config and multichannel options...')
        if (this.isWebexConnect) {
          this.model.contactButtonText = 'Showcase'
        }
        // get base demo config
        this.getDemoBaseConfig()
      }
    },
    demoBaseConfig (val) {
      console.log('base demo config changed. processing text templates and checking configuration...')
      // get multichannel options
      this.getMultichannelOptions()
      // get brand (vertical) config
      this.getBrand(false)
      // process any templates into the final text value
      this.processTextTemplates()
      this.checkConfig(val)
    },
    sessionInfoError (val) {
      if (!val) {
        // network error?
        this.$dialog.alert({
          title: 'Error Retrieving dCloud Session Info',
          message: `There was an error retrieving your dCloud
          session information. Please refresh the page to try again, or
          contact dCloud support if you continue to have this issue.`,
          type: 'is-danger',
          canCancel: false,
          hasIcon: true,
          icon: 'close-circle',
          iconPack: 'mdi'
        })
      }
      // error getting session info. display message
      if (val.status === 404) {
        // session not found - probably user entered invalid data
        // pop session modal again
        this.showSessionInfoModal = true
      } else {
        // other error - display message
        // display error message
        this.$dialog.alert({
          title: 'Error Retrieving dCloud Session Info',
          message: `There was an error retrieving your dCloud
          session information. Please refresh the page to try again, or
          contact dCloud support if you continue to have this issue.
          <br />
          Status Code: <strong>${val.status}</strong>
          <br />
          Error Message: <strong>${val.data}</strong>`,
          type: 'is-danger',
          canCancel: false,
          hasIcon: true,
          icon: 'close-circle',
          iconPack: 'mdi'
        })
      }
    },
    brandConfig (val) {
      // brand config loaded
      console.log('brandConfig changed - copying changes to local model')
      // update query string with the valid data we have now
      setQueryStringParameter('session', this.sessionId)
      setQueryStringParameter('datacenter', this.datacenter)
      setQueryStringParameter('userId', this.userId)
      // configuration info loaded - merge into model
      for (const key of Object.keys(val)) {
        // ignore id and owner keys
        if (['_id', 'id', 'owner'].includes(key)) {
          continue
        } else if (typeof val[key] !== 'string' || val[key].length) {
          // set model value for each brand config value, if the value is not
          // an empty string
          this.$set(this.model, key, val[key])
        }
      }
      // process any templates into the final text value
      this.processTextTemplates()
      // brand has now loaded
      this.loaded = true
      // hide session modal
      this.showSessionInfoModal = false
      // update colors, favicon, html title
      this.updateView(val)
      // set default iframe to cumulus website if there was no iframe configured
      if (!(this.model.iframe && this.model.iframe.trim().length)) {
        this.model.iframe = `https://mm.cxdemo.net/?session=${this.sessionId}&datacenter=${this.datacenter}&userId=${this.userId}`
      }
    },
    brand () {
      // brand ID has been set - load this brand now
      // this.getBrand(false)
    }
  },

  created () {
    // get query string and put the object into this component's data
    let uri = window.location.search.substring(1)
    this.qs = new window.URLSearchParams(uri)
    // add chat iframe event listener for postMessage
    window.addEventListener('message', (message) => {
      // console.log('iframe message:', message)
      try {
        if (message.data.type === 'sparky.command') {
          console.log('setting iframe to', message.data.data)
          this.model.iframe = message.data.data
        } else if (message.data.type === 'sparky.submit') {
          const d = message.data.data
          // save submitted data as cached user info
          this.firstName = d.firstName
          this.lastName = d.lastName
          this.phone = d.phone
          this.email = d.email
          // update URL query parameters to match cached data
          setQueryStringParameter('firstName', this.firstName)
          setQueryStringParameter('lastName', this.lastName)
          setQueryStringParameter('phone', this.phone)
          setQueryStringParameter('email', this.email)
        }
      } catch (e) {
        // failed to process postMessage from iframe
        console.error('failed to process postMessage from iframe. message:', e)
      }
    })
  },

  async mounted () {
    // update view now - probably remove this later for production
    this.updateView(this.model)
    // set dCloud session ID and datacenter from query parameters
    if (this.qs.get('session')) {
      this.setSessionId(this.qs.get('session'))
    }
    if (this.qs.get('datacenter')) {
      this.setDatacenter(this.qs.get('datacenter'))
    }
    if (this.qs.get('userId')) {
      this.setUserId(this.qs.get('userId'))
    }
    // set user/contact info from query parameters
    if (this.qs.get('firstName')) {
      this.firstName = this.qs.get('firstName')
      this.name = this.firstName + ' ' + this.lastName
    }
    if (this.qs.get('lastName')) {
      this.lastName = this.qs.get('lastName')
      this.name = this.firstName + ' ' + this.lastName
    }
    if (this.qs.get('phone')) {
      this.phone = this.qs.get('phone')
    }
    if (this.qs.get('email')) {
      this.email = this.qs.get('email')
    }
    // set cached email parameters from query parameters
    if (this.qs.get('body')) {
      this.body = this.qs.get('body')
    }
    if (this.qs.get('subject')) {
      this.subject = this.qs.get('subject')
    }
    // are datacenter and sessionID set?
    if (this.datacenter && this.sessionId) {
      // load dcloud session info
      console.log('getting session info...')
      this.getSessionInfo(false)
    } else {
      // pop modal to ask for datacenter and session ID
      this.showSessionInfoModal = true
    }
    // set up event listener for submitter user info, to cache it here
    // make a cross-browser compatible event listener
    const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
    const eventer = window[eventMethod]
    const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

    // attach event listener for message from iframe
    eventer(messageEvent, e => {
      // console.log('parent received message!:', e.data)
      if (e.data.event === 'submit-chat') {
        const d = e.data.data
        // save submitted data as cached user info
        this.firstName = d.firstName
        this.lastName = d.lastName
        this.phone = d.phone
        this.email = d.email
        this.updateUrlParameters()
      }
    }, false)

    // watch for webex teams widget title to exist, and make it draggable
    let interval
    interval = setInterval(() => {
      const elements = document.getElementsByClassName('webex-title-text')
      if (elements.length) {
        // console.log('found webex teams header:', elements)
        this.makeWebexTeamsWidgetDraggable(elements[0])
        window.clearInterval(interval)
      }
    }, 1000)
  },

  methods: {
    ...mapActions([
      'getSessionInfo',
      'setUserId',
      'setSessionId',
      'setDatacenter',
      'getBrand',
      'getDemoBaseConfig',
      'sendEmail',
      'sendJdsData',
      'sendSms',
      'sendCallback',
      'sendTask',
      'popEceCallbackWindow',
      'popEceChatWindow',
      'popUpstreamChatWindow',
      'popCconeChatWindow',
      'startEceDockedChat',
      'getMultichannelOptions'
    ]),
    async initEceDockedChat () {
      console.log('init ECE docked chat')
      // don't do anything if init already done
      if (this.eceDockedChatLoaded) {
        return
      }
      try {
        await window.initEceDockedChat('cceeceweb.dcloud.cisco.com')
        this.eceDockedChatLoaded = true
        return
      } catch (e) {
        console.log('initEceDockedChat failed:', e.message)
        this.$toast.open({
          message: `Failed to load Chat Live. Please make sure you are
          connected to the demo VPN.`,
          type: 'is-danger',
          duration: 15000
        })
        throw e
      }
    },
    makeWebexTeamsWidgetDraggable (element) {
      // draggable by the title bar
      element.onmousemove = (e) => {
        if (this.dragging) {
          // calculate the new cursor position:
          this.pos1 = this.pos3 - e.clientX
          this.pos2 = this.pos4 - e.clientY
          this.pos3 = e.clientX
          this.pos4 = e.clientY
          // set the element's new position:
          this.$refs.teams.style.top = (this.$refs.teams.offsetTop - this.pos2) + 'px'
          this.$refs.teams.style.left = (this.$refs.teams.offsetLeft - this.pos1) + 'px'
        }
      }

      element.onmousedown = (e) => {
        this.dragging = true
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX
        this.pos4 = e.clientY
        // document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        // document.onmousemove = elementDrag
      }

      element.onmouseup = () => {
        this.dragging = false
      }
    },
    hideChatBot () {
      // change the chat bot iframe URL to kill the session
      this.chatIframe = ''
      // and stop showing the chat bot iframe. reveals the main menu again.
      this.showChatBot = false
    },
    clickSubmitSessionInfo (data) {
      // user submitted modal form with dCloud session information
      // hide the modal
      // this.showSessionInfoModal = false
      // set data in state from the modal data
      this.setSessionId(data.sessionId)
      this.setDatacenter(data.datacenter)
      this.setUserId(data.userId)
      // get session info now
      this.getSessionInfo(false)
    },
    updateView (model) {
      // set color 1
      console.log('setting color1 to', model.color1)
      window.document.documentElement.style.setProperty('--color-1', model.color1)
      // set color 2
      console.log('setting color2 to', model.color2)
      window.document.documentElement.style.setProperty('--color-2', model.color2)
      // set the number of active options, to change the top property of the contact panel
      window.document.documentElement.style.setProperty('--active-options', this.contactOptions.length)
      // change the favicon
      this.changeFavicon(model.favicon)
      // change the title
      document.title = model.title
    },
    clickSubmitEmail (data) {
      // clicked submit on the email modal form
      console.log('clickSubmitEmail', data)
      // update customer data cache
      this.name = data.name
      // try to set first/last name
      try {
        const nameParts = this.name.split(' ')
        this.firstName = nameParts.shift()
        this.lastName = nameParts.join(' ')
      } catch (e) {
        console.log('clickSubmitEmail - failed to parse firstName and lastName from', this.name)
      }
      this.email = data.email
      this.subject = data.subject
      this.body = data.body
      // update URL query parameters to match cached data
      setQueryStringParameter('firstName', this.firstName)
      setQueryStringParameter('lastName', this.lastName)
      setQueryStringParameter('subject', this.subject)
      setQueryStringParameter('body', this.body)
      setQueryStringParameter('email', this.email)
      // close the modal
      this.showEmailModal = false
      // send the email
      this.sendEmail(data)
    },
    clickSubmitSms (data) {
      // update customer data cache
      this.phone = data.phone
      // clicked submit on the SMS modal form
      console.log('clickSubmitSms', data)
      // close the modal
      this.showSmsModal = false
      // attach the SMS message
      data.message = this.model.smsDeflectionMessage
      // send the SMS
      this.sendSms(data)
    },
    clickSubmitTask (data) {
      // update customer data cache
      this.name = data.name
      this.phone = data.phone
      this.email = data.email
      this.task = data.task
      // clicked submit on the task request modal form
      console.log('clickSubmitTask', data)
      // close the modal
      this.showTaskModal = false
      // send task request
      this.sendTask(data)
    },
    clickSubmitCallback (data) {
      // update customer data cache
      this.name = data.name
      this.phone = data.phone
      // this.message = data.message
      // clicked submit on the callback modal form
      console.log('clickSubmitCallback', data)
      // close the modal
      this.showCallbackModal = false
      // send callback request to server
      this.sendCallback(data)
    },
    clickSubmitChat (data) {
      // clicked submit on the chat modal form
      // log input data
      console.log('clickSubmitChat', data)
      // update customer data cache
      this.name = data.name
      // try to set first/last name
      try {
        const nameParts = this.name.split(' ')
        this.firstName = nameParts.shift()
        this.lastName = nameParts.join(' ')
      } catch (e) {
        console.log('clickSubmitChat - failed to parse firstName and lastName from', this.name)
      }
      this.phone = data.phone
      this.email = data.email
      // update URL query parameters to match cached data
      setQueryStringParameter('firstName', this.firstName)
      setQueryStringParameter('lastName', this.lastName)
      setQueryStringParameter('phone', this.phone)
      setQueryStringParameter('email', this.email)
      // close the modal
      this.showChatModal = false
      if (this.isCjpCcone || this.isCwccV1) {
        // CJP CCOne and CWCC v1 (R10)
        // pop CJP CCone chat window
        this.popCconeChatWindow(data)
      } else if (this.isUpstream) {
        // pop Upstream chat window
        this.popUpstreamChatWindow(data)
      }
    },
    clickChat (event) {
      // clicked chat option from contact panel
      console.log('clickChat', event)
      if (this.isUpstream) {
        this.showChatModal = true
      } else if (this.isCjpCcone) {
        // show chat modal for cjp
        this.showChatModal = true
      } else if (this.isCwccV1) {
        // show chat modal for CWCC v1 demo (R10)
        this.showChatModal = true
      } else if (this.isCjpWebex) {
        // do nothing - should not be here
      } else if (this.isUccx && this.demoConfig.uccxBubbleChat === true) {
        // UCCX and bubble chat is enabled
        // use bubble chat!
        let smHost
        if (this.isRcdn) {
          // RCDN Compete Lab demo
          smHost = 'chat.cdxdemo.net'
        } else {
          // smHost = this.datacenter + '-' + this.sessionId + '.tunnel.cc-dcloud.com'
          smHost = 'sm2-uccx.dcloud.cisco.com'
        }
        console.log('sessionConfig', this.sessionConfig)
        const widgetId = this.sessionConfig.widgetId || '3'
        console.log('opening bubble chat with smHost =', smHost)
        console.log('opening bubble chat with widget ID =', widgetId)
        // init UCCX bubble chat
        let ciscoBubbleChat
        if (this.demoVersion.startsWith('12.0')) {
          // UCCX 12.0
          ciscoBubbleChat = window.initBubbleChat(smHost, widgetId)
        } else {
          // UCCX 12.5 and higher
          ciscoBubbleChat = window.init125BubbleChat(smHost, widgetId)
        }
        // show the UCCX bubble chat start form
        ciscoBubbleChat.showChatWindow()
        // close the contact menu
        this.showContactPanel = false
      } else if (this.chatBotEnabled) {
        // hide contact panel menu and show chat bot
        this.showChatBot = true
        // build chat bot iframe URL
        let chatUrl = 'https://mm-chat.cxdemo.net/?'
        const options = {
          expand: true,
          session: this.sessionId,
          datacenter: this.datacenter,
          userId: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          email: this.email
        }
        // append URL options
        let count = 0
        for (const key of Object.keys(options)) {
          if (count !== 0) {
            chatUrl += '&'
          }
          chatUrl += `${key}=${options[key]}`
          count++
        }
        console.log('chatbot URL =', chatUrl)
        // set chat iframe URL
        this.chatIframe = chatUrl
      } else if (this.isUccx) {
        // UCCX demo and chat bot not enabled and bubble chat not enabled
        // run chat bot with bot turned off for CCX
        // hide contact panel menu and show chat bot
        this.showChatBot = true
        // build chat bot iframe URL
        let chatUrl = 'https://mm-chat.cxdemo.net/?'
        const options = {
          expand: true,
          session: this.sessionId,
          datacenter: this.datacenter,
          userId: this.userId,
          firstName: this.firstName,
          lastName: this.firstName,
          phone: this.phone,
          email: this.email,
          botDisabled: true
        }
        // append URL options
        let count = 0
        for (const key of Object.keys(options)) {
          if (count !== 0) {
            chatUrl += '&'
          }
          chatUrl += `${key}=${options[key]}`
          count++
        }
        // set chat iframe URL
        this.chatIframe = chatUrl
      } else if (this.isPcce) {
        // PCCE demo and chat bot not enabled
        // is docked chat enabled? variable name uccxBubbleChat now applies to
        // UCCX and PCCE chat
        if (this.demoConfig.uccxBubbleChat) {
          // docked chat
          this.startEceDockedChat()
        } else {
        // no docked chat - pop ECE chat window
          this.popEceChatWindow()
        }
      } else if (
        this.isTsaCwcc ||
        this.isWebexV3Prod ||
        this.isWebexV4Prod ||
        this.isPcceWebexConnect
      ) {
        // we should not be here. these chats should be started by clicking
        // their bubble chat icon, which is not in our contact panel
      }
    },
    clickChatTranslation () {
      // this starts the chat bot with translation
      // hide contact panel menu and show chat bot
      this.showChatBot = true
      // build chat bot iframe URL
      let chatUrl = 'https://mm-chat.cxdemo.net/?'
      const options = {
        expand: true,
        session: this.sessionId,
        datacenter: this.datacenter,
        userId: this.userId,
        firstName: this.firstName,
        lastName: this.firstName,
        phone: this.phone,
        email: this.email,
        botDisabled: false,
        host: 'bucher-suter.dcloud.cisco.com:1880'
      }
      // append URL options
      let count = 0
      for (const key of Object.keys(options)) {
        if (count !== 0) {
          chatUrl += '&'
        }
        chatUrl += `${key}=${options[key]}`
        count++
      }
      // set chat iframe URL
      this.chatIframe = chatUrl
    },
    clickSms (event) {
      // clicked SMS option from contact panel
      console.log('clickSms', event)
      // open the SMS modal
      this.showSmsModal = true
      // this.$dialog.prompt({
      //   message: `Enter your mobile number and we will text you`,
      //   inputAttrs: {
      //     placeholder: 'Enter your mobile phone number'
      //   },
      //   confirmText: 'Text Me',
      //   canCancel: true,
      //   onConfirm: (value) => this.$toast.open({
      //     duration: 15000,
      //     message: `We are sending a text message to ${value}. Please respond to
      //     this text message to begin chatting with one of our experts.`,
      //     type: 'is-primary'
      //   })
      // })
    },
    clickJds (jds) {
      // clicked one of the JDS options from contact panel (webex CC v8 demo)
      console.log('clickJds', jds)
      this.sendJdsData(jds.data)
    },
    clickCallQr (option) {
      // clicked one of the QR options from contact panel (webex connect demo)
      console.log('clickCallQr', option)
      // open the call QR modal
      // this.showCallQrModal = true
      this.$modal.open({
        parent: this,
        component: CallQrForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape', 'x'],
        props: {
          heading: option.modalHeading,
          value: option.url,
          description: option.urlDescription
        }
      })
    },
    clickCall (event) {
      // clicked call option from contact panel
      console.log('clickCall', event)
      // open the call modal
      this.showCallModal = true
    },
    clickCallback (event) {
      // clicked callback option from contact panel
      console.log('clickCallback', event)
      // open the callback modal
      this.showCallbackModal = true
    },
    clickEmail (event) {
      // clicked email option from contact panel
      console.log('clickEmail', event)
      // open the email modal
      this.showEmailModal = true
    },
    clickTask (event) {
      // clicked task option from contact panel
      console.log('clickTask', event)
      // open the task modal
      this.showTaskModal = true
    },
    clickCobrowse (event) {
      console.log('click cobrowse button', event)
      // do egain cobrowse?
      if (document.eGain) {
        console.log('running document.eGain.cobrowse.startCobrowse()')
        document.eGain.cobrowse.startCobrowse()
      } else if (window.eGain) {
        console.log('running window.eGain.cobrowse.startCobrowse()')
        window.eGain.cobrowse.startCobrowse()
      } else {
        console.log('failed to start cobrowse - window.eGain and document.eGain are undefined.')
        this.$toast.open({
          duration: 8000,
          message: `eGain Cobrowse library failed to load. If you are using a
          browser outside of the demo workstation, please make sure you are
          connected to your demo VPN.`,
          type: 'is-danger'
        })
      }
    },
    changeFavicon (src) {
      // change the favorite icon
      /*
      * Dynamically changing favicons with JavaScript
      * Works in all A-grade browsers except Safari and Internet Explorer
      * Demo: http://mathiasbynens.be/demo/dynamic-favicons
      */
      var link = document.createElement('link')
      var oldLink = document.getElementById('dynamic-favicon')
      link.id = 'dynamic-favicon'
      link.rel = 'shortcut icon'
      link.href = src
      if (oldLink) {
        console.log('removing old favicon', oldLink)
        document.head.removeChild(oldLink)
      }
      console.log('adding favicon code to HTML head', link)
      document.head.appendChild(link)
    },
    processTextTemplates () {
      // don't do anything if this demo doesn't use voice
      if (!this.demoUsesInboundVoice) {
        return
      }
      // session config loaded
      if (this.isUpstream) {
        try {
          // upstream demo - set phone number to the upstream number
          const formattedCallNumber = formatUnicorn(this.model.callText, this.sessionInfo.uwf.international)
          this.$set(this.model, 'callText', formattedCallNumber)
        } catch (e) {
          console.log('failed to format call number:', e)
        }
      } else if (this.isCwccV1 || this.isWebexV3Prod || this.isWebexV4Prod) {
        // CWCC v1/v2 demo, or Webex CC v3 demo
        const formattedCallNumber = formatUnicorn(this.model.callText, this.cwccDid)
        this.$set(this.model, 'callText', formattedCallNumber)
      } else {
        // not upstream demo or CWCC demo
        // set main call number using template
        try {
          const formattedCallNumber = formatUnicorn(this.model.callText, this.sessionInfo.phone.international)
          this.$set(this.model, 'callText', formattedCallNumber)
        } catch (e) {
          console.log('failed to format call number:', e)
        }

        // set SMS number using template, if this is not CJP demo
        if (!this.isCjp) {
          try {
            const formattedSmsNumber = formatUnicorn(this.model.smsText, this.sessionInfo.sms.international)
            this.$set(this.model, 'smsText', formattedSmsNumber)
          } catch (e) {
            console.log('failed to format call number and sms number:', e)
          }
        }
      }
    },
    async checkConfig () {
      console.log('checkConfig')
      if (!this.brand) {
        console.log('checkConfig - no brand set')
        // no brand set. show relevant error message to user.
        if (this.isInstantDemo) {
          // instant demo
          if (this.userId) {
            // instant demo, userId is set, but no brand configured
            // display error message
            this.$dialog.alert({
              title: 'No Brand Configured',
              message: `Your instant demo configuration does not have a vertical
                selected. Please select one on the
                <a target="instant-toolbox" href="https://dcloud-collab-toolbox-${this.datacenter}.cisco.com/pcce/demos/cumulus">
                <strong>PCCE Instant Demo Toolbox</strong></a>,
                and then try again.`,
              type: 'is-danger',
              canCancel: false,
              hasIcon: true,
              icon: 'close-circle',
              iconPack: 'mdi'
            })
          } else {
            // instant demo, userId is not set - make sure session modal is shown
            this.showSessionInfoModal = true
          }
        } else {
          // scheduled demo, but brand not configured - show error message
          this.$dialog.alert({
            title: 'dCloud Session Not Configured',
            message: `Your dCloud session doesn't have a vertical configured. Please
              choose one from the
              <a target="session-toolbox" href="https://branding.dcloud.cisco.com/configure">
              <strong>Session Configuration Toolbox</strong>
              </a>
              while connected to your dCloud demo, and then try again.`,
            type: 'is-danger',
            canCancel: false,
            hasIcon: true,
            icon: 'close-circle',
            iconPack: 'mdi'
          })
        }
      } else {
        // brand is set
        console.log('checkConfig - brand is set')
        // determine if we need to load another chat library
        if (this.isWebexConnect) {
          console.log('init Webex Connect chat')
          // init webex connect chat for webex connect demo
          window.initWebexConnectChat()
        } else if (this.isCjpWebex) {
          console.log('init Spark Care chat')
          // init CJP chat from Webex Sandbox (old spark care chat)
          window.initSparkCareChat(this.sessionConfig.orgId, this.sessionConfig.templateId)
        } else if (this.isTsaCwcc) {
          console.log('init Webex chat')
          // this is for the Cisco TSA tenants on Webex Contact Center Abilene
          window.initWebexChat({
            async: typeof this.sessionConfig.async === 'boolean' ? this.sessionConfig.async : true,
            CiscoAppId: this.sessionConfig.CiscoAppId || 'cisco-chat-bubble-app',
            appPrefix: this.sessionConfig.appPrefix,
            DC: this.sessionConfig.DC || 'appstaging.ciscoccservice.com',
            orgId: this.sessionConfig.orgId || '83f66514-200c-47cd-8310-4a5711e7b356',
            templateId: this.sessionConfig.templateId || 'ce28a900-a8bc-11e9-9dce-53872d5a6b64'
          })
        } else if (this.isWebexV3Prod || this.isWebexV4Prod || this.isWebexCustom) {
          console.log('init Webex chat')
          // Webex v3 production Abilene tenant for dCloud
          // are they using IMI Connect?
          if (this.sessionConfig.imiConnectId) {
            // use IMI chat
            await window.initWebexConnectChat()
          } else {
            // use old webex chat
            await window.initWebexChat(this.sessionConfig)
          }
        } else if (this.isWebexV6) {
          // use IMI Connect chat for webex v6
          await window.initWebexConnectChat()
        } else if (this.isSfdc) {
          console.log('init SFDC chat')
          // SalesForce.com chat for PCCE 12.5+
          window.initSfdcChat(this.datacenter, this.sessionId)
        } else if (this.isPcceWebexConnect) {
          console.log('init PCCE Webex Connect chat widget')
          try {
            // load the webex teams space widget javascript library
            await window.initWebexConnectChat()
            console.log('successfully loaded Webex Connect widget library')
          } catch (e) {
            this.$toast.open({
              duration: 15000,
              message: `Webex Connect chat widget failed to load: ${e.message}`,
              type: 'is-danger'
            })
          }
        } else if (this.isPcce && this.demoConfig.uccxBubbleChat) {
          // use ECE docked chat for PCCE live chat
          this.initEceDockedChat()
        }
      }
    }
  }
}
</script>

<style lang="scss">

html {
  background-color: darkgrey;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
body {
  height: 100%;
  // overflow-y: scroll;
  // overflow-y: hidden;
}

// body:hover {
  // overflow-y: hidden;
// }

#app {
  height: 100%;
}

#main-content {
  height: 100%;
}

.demo-iframe {
  height: 100%;
  width: 100%;
  border: 0;
}

#contact-toggle-button {
  top: 35%;
  right: 0 !important;
  position: fixed;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  color: white;
  background-color: var(--color-1);
  border-color: var(--color-1);
}

#contact-toggle-button:hover {
  background-color: var(--color-2);
  border-color: var(--color-2);
}

// transition container for contact-panel
#contact-panel-container {
  // flex item centered vertically
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  // fixed position on the top-right of the screen
  position: fixed;
  top: 0;
  right: 0 !important;
  // full height
  height: 100%;
}

// the slide-out contact options panel
#contact-panel {
  min-width: 450px;
  .card {
    // nice rounded corners
    border-radius: 1em;
    // hide anything that flows over the rounded corners
    overflow: hidden;
  }
  z-index: 10;
}

// slide the drawer out
.slide-enter-active {
  transition: 0.5s;
}
.slide-enter {
  transform: translate(100%, 0);
}

// slide the drawer back in
.slide-leave-active {
  transition: 0.5s;
}
.slide-leave-to {
  transform: translate(100%, 0);
}

.contact-title {
  font-size: 1.5em;
  font-weight: normal !important;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
}

.contact-content {
  padding-top: 0.4em !important;
  padding-bottom: 0.0em !important;
}

.contact-item {
  // font-size: 0.8em;
  // line-height: 0.5em;
  // .content {
  //   left: 5em;
  //   position: absolute;
  // }
  .card-footer-item {
    border-right: none !important;
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    .contact-icon {
      color: var(--color-1);
    }
    .content {
      width: 100%;
      h4 {
        margin-bottom: 0px;
        small {
          font-size: 16px !important;
          color: var(--color-1);
        }
      }
    }
  }
}

.contact-item:hover {
  border-left:4px solid var(--color-2);
  padding-left:0;
  .contact-icon {
    color: var(--color-2);
  }
}

.contact-icon {
  padding-left: 0.5em;
  padding-right: 1em;
  max-width: 4em;
}

.contact-close-icon {
  color: var(--color-1);
}

.contact-close-icon:hover {
  color: var(--color-2);
}

.contact-subtext {
  max-width: 95%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
}

// hide the broken tooltip from webex CC chat
#welcomeTooltip {
  display: none;
}
</style>
