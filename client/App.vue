<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="!loaded" :can-cancel="false"></b-loading>

    <b-modal :active.sync="showEmailModal" :can-cancel="true" has-modal-card width="960">
      <email-form @submit="clickSubmitEmail" :name="name" :email="email" />
    </b-modal>

    <b-modal :active.sync="showSmsModal" :can-cancel="true" has-modal-card width="960">
      <sms-form @submit="clickSubmitSms" :phone="phone" />
    </b-modal>

    <b-modal :active.sync="showTaskModal" :can-cancel="true" has-modal-card width="960">
      <task-form @submit="clickSubmitTask" :request-types="requestTypes" :name="name" :phone="phone" :email="email" />
    </b-modal>

    <b-modal :active.sync="showCallbackModal" :can-cancel="true" has-modal-card width="960">
      <callback-form @submit="clickSubmitCallback" :name="name" :phone="phone" />
    </b-modal>

    <b-modal :active.sync="showCallModal" :can-cancel="true" has-modal-card width="960">
      <call-form :dnis="model.callText"/>
    </b-modal>

    <span id="main-content" v-if="endpointsLoaded">
      <!-- background iframe -->
      <iframe :src="model.iframe" class="demo-iframe"></iframe>

      <!-- talk to an expert button (button to open contact panel) -->
      <transition name="slide">
        <button id="contact-toggle-button" class="button"
        v-show="!showContactPanel && loaded"
        @click="showContactPanel = true">
        <strong>{{ model.contactButtonText }}</strong></button>
      </transition>

      <!-- contact panel -->
      <transition name="slide">
        <div id="contact-panel" v-show="showContactPanel">
          <!-- Chat Bot -->
          <b-collapse class="card" v-show="showChatBot">
            <div class="card-header" role="button" @click="showChatBot = false">
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
          <b-collapse class="card" v-show="!showChatBot">
            <div class="card-header" role="button" @click="showContactPanel = false">
              <p class="card-header-title contact-title">
                {{ model.menuTitle }}
              </p>

              <a class="card-header-icon contact-close-icon">
                <b-icon icon="close" />
              </a>
            </div>

            <div class="card-content contact-content" v-if="model.advisorEnabled">
              <img :src="model.advisorImage" style="height: 7em;">
              <span style="float: right; font-size: 1.8em;">
                <p>{{ model.advisorHeading }}</p>
                <p>{{ model.advisorText }}</p>
              </span>
            </div>

            <!-- render each contact option -->
            <footer v-for="item of contactOptions" class="card-footer contact-item">
              <a @click="item.click" class="card-footer-item">
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
      </transition>
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EmailForm from './components/email-form.vue'
import SmsForm from './components/sms-form.vue'
import TaskForm from './components/task-form.vue'
import CallbackForm from './components/callback-form.vue'
import CallForm from './components/call-form.vue'

export default {
  created () {
    // get query string and put the object into this component's data
    let uri = window.location.search.substring(1)
    this.qs = new window.URLSearchParams(uri)
  },

  components: {
    EmailForm,
    SmsForm,
    TaskForm,
    CallbackForm,
    CallForm
  },

  data () {
    return {
      name: '',
      phone: '',
      email: '',
      loaded: false,
      qs: {},
      requestTypes: [{
        value: 'bill',
        text: 'Report Bill Issue'
      }, {
        value: 'test',
        text: 'Report test Issue'
      }],
      production: process.env.NODE_ENV === 'production',
      showContactPanel: false,
      showEmailModal: false,
      showSmsModal: false,
      showTaskModal: false,
      showCallbackModal: false,
      showCallModal: false,
      showChatBot: false,
      chatIframe: '',
      model: {
        // basic config
        title: '',
        favicon: '',
        iframe: '',
        color1: '#2357af',
        color2: '#4881e2',
        // advanced config
        contactButtonText: 'Talk to an Expert',
        menuTitle: 'Need Help?',
        chatMenuTitle: 'Now Chatting',
        // advisor
        advisorEnabled: true,
        advisorImage: 'https://mm.cxdemo.net/static/images/cumulus/common/author1.png',
        advisorHeading: 'Expert Advisor',
        advisorText: `We're here to help`,
        // chat
        chatEnabled: true,
        chatIcon: 'message-processing',
        chatHeading: 'Chat Now',
        chatText: 'An expert will chat with you live',
        chatWaitTime: '1 min wait time',
        // sms
        smsEnabled: true,
        smsIcon: 'message-processing',
        smsHeading: 'Text Us',
        smsText: '+1 817-755-6260',
        smsWaitTime: '1 min wait time',
        // call
        callEnabled: true,
        callIcon: 'phone',
        callHeading: 'Call Us',
        callText: '+1 919-555-5776',
        callWaitTime: '8 min wait time',
        // callback
        callbackEnabled: true,
        callbackIcon: 'phone-forward',
        callbackHeading: `We'll Call You`,
        callbackText: 'Receive a call back from an expert',
        callbackWaitTime: '8 min wait time',
        // email
        emailEnabled: true,
        emailIcon: 'email',
        emailHeading: 'Email an Expert',
        emailText: 'An expert will respond to your email',
        emailWaitTime: '12-24 hour wait time',
        // task
        taskEnabled: true,
        taskIcon: 'clipboard-check',
        taskHeading: 'Request',
        taskText: 'An expert will handle your task',
        taskWaitTime: '',
        // cobrowse
        cobrowseEnabled: true,
        cobrowseIcon: 'lan-connect',
        cobrowseHeading: 'Cobrowse',
        cobrowseText: 'An expert will cobrowse with you live',
        cobrowseWaitTime: '8 min wait time'
      }
    }
  },

  async mounted () {
    // update view now - probably remove this later for production
    this.updateView(this.model)
    // set dCloud session ID and datacenter from query parameters
    if (this.qs.get('session')) {
      this.setSessionId(this.qs.get('session'))
    } else {
      // session ID not set - show error and stop loading
      this.$toast.open({
        duration: 5 * 60 * 1000,
        message: `Please specify a session ID in the URL query parameters as "session".`,
        type: 'is-danger'
      })
      return
    }
    if (this.qs.get('datacenter')) {
      this.setDatacenter(this.qs.get('datacenter'))
    } else {
      // datacenter not set - show error and stop loading
      this.$toast.open({
        duration: 5 * 60 * 1000,
        message: `Please specify a datacenter in the URL query parameters as "datacenter".`,
        type: 'is-danger'
      })
      return
    }
    if (this.qs.get('userId')) {
      this.setUserId(this.qs.get('userId'))
    }
    // load URL endpoints list from the API server
    console.log('getting endpoints...')
    await this.getEndpoints(false)
    // load dcloud session info
    console.log('getting session info...')
    await this.getSessionInfo(false)
    if (!this.brand) {
      // no brand set. show relevant error message to user.
      if (this.isInstantDemo) {
        // instant demo
        if (this.userId) {
          // userId is set
          this.$toast.open({
            duration: 5 * 60 * 1000,
            message: `Your instant demo configuration does not have a brand
            selected. Please select one on the Brand page of the dCloud Instant
            Demo Toolbox, and then refresh this page.`,
            type: 'is-danger'
          })
        } else {
          // userId is not set
          this.$toast.open({
            duration: 5 * 60 * 1000,
            message: `Your dCloud session is an instant demo session, but your
            user ID was not specified in the URL query parameters. Please use
            the link on the Brand Demo page of the dCloud Instant Demo Toolbox,
            and then refresh this page.`,
            type: 'is-danger'
          })
          return
        }
      } else {
        // scheduled demo
        this.$toast.open({
          duration: 5 * 60 * 1000,
          message: `Your dCloud session doesn't have a brand configured. Please
          choose one from the Session Configuration Toolbox in your dCloud demo,
          and then refresh this page.`,
          type: 'is-danger'
        })
        return
      }
    }
    if (this.brand) {
      // brand ID has a value assigned - continue
      // load brand configuration
      console.log('getting brand configuration info...')
      await this.getBrand(false)
    }
  },

  computed: {
    ...mapGetters([
      'loading',
      'endpoints',
      'endpointsLoaded',
      'chatBotEnabled',
      'isUccx',
      'isUpstream',
      'sessionInfo',
      'sessionConfig',
      'brand',
      'brandConfig',
      'isInstantDemo',
      'userId',
      'datacenter',
      'sessionId'
    ]),
    contactOptions () {
      const chat = {
        click: this.clickChat,
        icon: this.model.chatIcon,
        heading: this.model.chatHeading,
        subtext: this.model.chatText,
        waitTime: this.model.chatWaitTime
      }
      const sms = {
        click: this.clickSms,
        icon: this.model.smsIcon,
        heading: this.model.smsHeading,
        subtext: this.model.smsText,
        waitTime: this.model.smsWaitTime
      }
      const call = {
        click: this.clickCall,
        icon: this.model.callIcon,
        heading: this.model.callHeading,
        subtext: this.model.callText,
        waitTime: this.model.callWaitTime
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

      const ret = []
      if (this.model.chatEnabled) {
        ret.push(chat)
      }
      if (this.model.smsEnabled) {
        ret.push(sms)
      }
      if (this.model.callEnabled) {
        ret.push(call)
      }
      if (this.model.callbackEnabled) {
        ret.push(callback)
      }
      if (this.model.emailEnabled) {
        ret.push(email)
      }
      if (this.model.taskEnabled) {
        ret.push(task)
      }
      if (this.model.cobrowseEnabled) {
        ret.push(cobrowse)
      }
      return ret
    }
  },

  methods: {
    ...mapActions([
      'getEndpoints',
      'getSessionInfo',
      'setUserId',
      'setSessionId',
      'setDatacenter',
      'getBrand',
      'sendEmail',
      'sendSms',
      'sendCallback',
      'sendTask'
    ]),
    updateView (model) {
      // set color 1
      window.document.documentElement.style.setProperty('--color-1', model.color1)
      // set color 2
      window.document.documentElement.style.setProperty('--color-2', model.color2)
      // set the number of active options, to change the top property of the contact panel
      window.document.documentElement.style.setProperty('--active-options', this.contactOptions.length)
      // change the favicon
      this.changeFavicon(model.favicon)
      // change the title
      document.title = model.title
    },
    clickSubmitEmail (data) {
      // update customer data cache
      this.name = data.name
      this.email = data.email
      // clicked submit on the email modal form
      console.log('clickSubmitEmail', data)
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
      // send the SMS
      this.sendSms(data)
    },
    clickSubmitTask (data) {
      // update customer data cache
      this.name = data.name
      this.phone = data.phone
      this.email = data.email
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
      // clicked submit on the callback modal form
      console.log('clickSubmitCallback', data)
      // close the modal
      this.showCallbackModal = false
      // send callback request to server
      this.sendCallback(data)
    },
    clickChat (event) {
      // clicked chat option from contact panel
      console.log('clickChat', event)
      if (this.chatBotEnabled) {
        // hide contact panel menu and show chat bot
        this.showChatBot = true
        // set chat bot iframe to the chat bot URL
        this.chatIframe = `https://mm-chat.cxdemo.net/?expand=true&session=${this.sessionId}&datacenter=${this.datacenter}&userId=${this.userId}`
      } else {
        if (this.isUccx) {
          // UCCX demo
          // run chat bot with bot turned off for CCX
          // hide contact panel menu and show chat bot
          this.showChatBot = true
          // set chat bot iframe to the chat bot URL
          this.chatIframe = `https://mm-chat.cxdemo.net/?expand=true&session=${this.sessionId}&datacenter=${this.datacenter}&userId=${this.userId}&botDisabled=true`
        } else {
          // not UCCX demo - default to PCCE demo
          // check if upstream or ECE
          if (this.isUpstream) {
            // pop Upstream chat window
            this.popUpstreamChatWindow()
          } else {
            // default to ECE chat, if not Upstream
            // pop ECE chat window
            this.popEceChatWindow()
          }
        }
      }
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
    clickCall (event) {
      // clicked call option from contact panel
      console.log('clickCall', event)
      // open the call modal
      this.showCallModal = true
    },
    clickCallback (event) {
      // clicked callback option from contact panel
      console.log('clickCallback', event)
      if (this.isUpstream || this.isUccx) {
        // open the callback modal
        this.showCallbackModal = true
      } else {
        // PCCE without Upstream - pop ECE callback window
        this.popEceCallbackWindow()
      }
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
      if (document.eGain) {
        console.log('running document.eGain.cobrowse.startCobrowse()')
        document.eGain.cobrowse.startCobrowse()
      } else if (window.eGain) {
        console.log('running window.eGain.cobrowse.startCobrowse()')
        window.eGain.cobrowse.startCobrowse()
      } else {
        console.log('failed to start cobrowse - window.eGain and document.eGain are undefined.')
        this.$toast.open({
          duration: 15000,
          message: `eGain Cobrowse library failed to load. If you are using a
          browser outside of the demo workstation, please make sure you are
          connected to your demo VPN.`,
          type: 'is-danger'
        })
      }
    },
    popEceChatWindow () {
      console.log('popEceChatWindow')
      // create url
      // let url = `${this.endpoints.eceProxy.path}/${this.datacenter}-${this.sessionId}`
      // url += `/system/templates/chat/kiwi/chat.html?subActivity=Chat&entryPointId=1001&templateName=kiwi&languageCode=en&countryCode=US&ver=v11`
      // aqua template does not work through the reverse proxy
      // https://${this.datacenter}-${this.session}.tunnel.cc-dcloud.com/system/templates/chat/aqua/index.html?subActivity=Chat&entryPointId=1001&templateName=aqua&ver=v11&locale=en-US
      // url += `/system/templates/chat/aqua/index.html?subActivity=Chat&entryPointId=1001&templateName=aqua&ver=v11&locale=en-US`
      // http://cceece.dcloud.cisco.com/system/templates/chat/aqua/index.html?subActivity=Chat&entryPointId=1001&templateName=aqua&ver=v11&locale=en-US
      let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/ece/system/templates/chat/aqua/index.html?subActivity=Chat&entryPointId=1001&templateName=aqua&ver=v11&locale=en-US`
      console.log('ECE chat URL:', url)
      let w = 400
      let h = 600
      let top = (window.screen.height / 2) - (h / 2)
      let left = (window.screen.width / 2) - (w / 2)
      // open popup
      window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
      // window.resize('400', '600')
    },
    popEceCallbackWindow () {
      console.log('popEceCallbackWindow')
      // create url
      // rainbow template
      let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/ece/system/templates/callback/rainbow/call.html?subActivity=Callback&entryPointId=1002&templateName=rainbow&languageCode=en&countryCode=US&ver=v11`
      // cumulus template
      // let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/ece/system/templates/callback/cumulus/call.html?subActivity=Callback&entryPointId=1002&templateName=cumulus&languageCode=en&countryCode=US&ver=v11`
      console.log('ECE callback URL:', url)
      let w = 400
      let h = 600
      let top = (window.screen.height / 2) - (h / 2)
      let left = (window.screen.width / 2) - (w / 2)
      // open popup
      window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
      // window.resize('400', '600')
    },
    popUpstreamChatWindow (data) {
      console.log('popUpstreamChatWindow', data)
      let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/Home`
      console.log('ECE URL:', url)
      let w = 400
      let h = 600
      let top = (window.screen.height / 2) - (h / 2)
      let left = (window.screen.width / 2) - (w / 2)
      // open popup
      window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
      // window.resize('400', '600')
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
    }
  },

  watch: {
    model (val) {
      console.log('model changed - update view')
      this.updateView(val)
    },
    sessionInfo (val) {
      console.log('sessionInfo changed')
      // session config loaded - update phone number and SMS number
      this.$set(this.model, 'smsText', val.sms.international)
      this.$set(this.model, 'callText', val.phone.international)
    },
    brandConfig (val) {
      console.log('brandConfig changed - copying changes to local model')
      // configuration info loaded - merge into model
      for (const key of Object.keys(val)) {
        // ignore id and owner keys
        if (['_id', 'id', 'owner'].includes(key)) {
          continue
        } else {
          // set model value for each brand config value
          this.$set(this.model, key, val[key])
        }
      }
      // brand has now loaded
      this.loaded = true
    }
  }
}
</script>

<style lang="scss">

html {
  background-color: darkgrey;
  height: 100%;
  overflow: hidden;
}

body {
  height: 100%;
  overflow-y: scroll;
}

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

#contact-panel {
  // calculate height based on how many options are enabled
  top: calc(4em + 20% - var(--active-options) * 20px);
  min-width: 450px;
  right: 0 !important;
  position: fixed;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  // slide the drawer out
  // -webkit-transition:right .5s ease;
  // transition:right .5s ease;
  .card {
    // nice rounded corners
    border-radius: 1em;
    // hide anything that flows over the rounded corners
    overflow: hidden;
  }
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
</style>
