<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="!endpointsLoaded" :can-cancel="false"></b-loading>
    <!-- <b-modal :active="!loggedIn" :can-cancel="false" has-modal-card>
      <login-form v-bind="loginFormData" @submit="clickLogin" />
    </b-modal> -->
    <b-modal :active.sync="showEmailModal" :can-cancel="true" has-modal-card width="960">
      <email-form v-bind="emailFormData" @submit="clickSubmitEmail" />
    </b-modal>
    <span id="main-content" v-if="endpointsLoaded">
      <!-- background iframe -->
      <iframe id="demo-iframe" :src="model.iframe"></iframe>

      <!-- talk to an expert button (open drawer) -->
      <transition name="slide">
        <button id="contact-toggle-button" class="button"
        v-show="!showContactPanel"
        @click="showContactPanel = true">
        <strong>{{ model.contactButtonText }}</strong></button>
      </transition>

      <!-- contact panel -->
      <transition name="slide">
        <div id="contact-panel" v-show="showContactPanel">
          <b-collapse class="card">
            <div
            class="card-header"
            role="button"
            @click="showContactPanel = false">

            <p class="card-header-title contact-title">
              {{ model.menuTitle }}
            </p>

            <a class="card-header-icon contact-close-icon">
              <b-icon icon="close" />
            </a></div>

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
        </div>
      </transition>
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EmailForm from './components/email-form.vue'

export default {
  components: {
    EmailForm
  },

  data () {
    return {
      production: process.env.NODE_ENV === 'production',
      showContactPanel: false,
      // showLoginModal: false,
      // loggedIn: false,
      showEmailModal: false,
      emailFormData: {
        name: 'Coty Condry',
        email: 'ccondry@cisco.com',
        body: 'help me'
      },
      model: {
        contactButtonText: 'Talk to an Expert',
        menuTitle: 'Need Help?',
        menuSubtitle: `We're here to help`,
        iframe: 'https://toolbox.cdxdemo.net/users/matthmcc/Ashley%20Furniture%20HomeStore%20_%20Home%20Furniture%20&%20Decor.html',
        // iframe: '',
        color1: '#0000aa',
        color2: '#00ffdd',
        advisorEnabled: true,
        advisorImage: 'https://static.cxdemo.net/images/ming_advisor.png',
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
        smsText: '+1 817-949-1884',
        smsWaitTime: '1 min wait time',
        // call
        callEnabled: true,
        callIcon: 'phone',
        callHeading: 'Call Us',
        callText: '+1 919-474-1884',
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

  mounted () {
    // load URL endpoints list from the API server
    this.getEndpoints()
    // update view now - probably remove this later for production
    this.updateView(this.model)
    // get user info
    this.showLoginModal = true
  },

  computed: {
    ...mapGetters([
      'loading',
      'endpoints',
      'endpointsLoaded',
      'instancesLoaded'
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
      'getSession'
    ]),
    clickLogin () {
      console.log('clickLogin')
    },
    updateView (model) {
      // set color 1
      window.document.documentElement.style.setProperty('--color-1', model.color1)
      // set color 2
      window.document.documentElement.style.setProperty('--color-2', model.color2)
      // set the number of active options, to change the top property of the contact panel
      window.document.documentElement.style.setProperty('--active-options', this.contactOptions.length)
    },
    clickSubmitEmail () {
      // clicked submit on the email modal form
      console.log('clickSubmitEmail')
      // close the modal
      this.showEmailModal = false
      // pop toaster notification
      this.$toast.open({
        duration: 15000,
        message: `We have received your email and an expert will respond as
        soon as possible.`,
        type: 'is-primary'
      })
    },
    clickChat (event) {
      console.log('clickChat', event)
    },
    clickSms (event) {
      console.log('clickSms', event)
      this.$dialog.prompt({
        message: `Enter your mobile number and we will text you`,
        inputAttrs: {
          placeholder: 'Enter your mobile phone number'
        },
        confirmText: 'Text Me',
        onConfirm: (value) => this.$toast.open({
          duration: 15000,
          message: `We are sending a text message to ${value}. Please respond to
          this text message to begin chatting with one of our experts.`,
          type: 'is-primary'
        })
      })
    },
    clickCall (event) {
      console.log('clickCall', event)
    },
    clickCallback (event) {
      console.log('clickCallback', event)
    },
    clickEmail (event) {
      // clicked email option from contact panel
      console.log('clickEmail', event)
      // open the email modal
      this.showEmailModal = true
    },
    clickTask (event) {
      console.log('clickTask', event)
    },
    clickCobrowse (event) {
      console.log('clickCobrowse', event)
    }
  },

  watch: {
    model (val) {
      this.updateView(val)
    }
  }
}
</script>

<style lang="scss">

@import '~bulma';

$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';

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

#demo-iframe {
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
  width: 30%;
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
}
</style>
