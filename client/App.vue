<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="!endpointsLoaded" :can-cancel="false"></b-loading>
    <span id="main-content" v-if="endpointsLoaded">
      <iframe id="demo-iframe" :src="model.iframe"></iframe>
      <div id="contact-panel" v-if="showContactPanel">
        <b-collapse class="card">
          <div
          slot="trigger"
          slot-scope="props"
          class="card-header"
          role="button">

          <button id="contact-toggle-button" class="button"
          v-show="!props.open"
          @click="showContactPanel = true">
          <strong>{{ model.contactButtonText }}</strong></button>

          <p class="card-header-title" v-show="props.open">
            {{ model.menuTitle }}
          </p>

          <a class="card-header-icon" v-show="props.open">
            <b-icon icon="close" />
          </a></div>

          <div class="card-content contact-content" v-if="model.advisorEnabled">
            <img :src="model.advisorImage" style="height: 124px;">
            <span style="float: right;">
              <p>{{ model.advisorHeading }}</p>
              <p>{{ model.advisorText }}</p>
            </span>
          </div>

          <footer v-for="item of items" class="card-footer contact-item">
            <a @click="item.click" class="card-footer-item">
              <b-icon class="contact-icon" :icon="item.icon" />
              <div class="content">
                <h4>{{ item.heading }}<small v-if="item.waitTime"> - {{ item.waitTime }}</small></h4>
                <p class="contact-subtext">{{ item.subtext }}</p>
              </div>
            </a>
          </footer>

          <!-- <footer v-if="model.smsEnabled" class="card-footer contact-item">
            <a @click="clickChat" class="card-footer-item contact-icon">
              <b-icon icon="message-processing" />
            </a>
            <a @click="clickChat" class="card-footer-item">
              <div class="content">
                <h4>{{ model.smsHeading }}<small> - {{ waitText(model.smsWaitTime) }}</small></h4>
                <p class="contact-subtext">{{ model.smsText }}</p>
              </div>
            </a>
          </footer> -->

          <!--
                      <div v-if="!(model.chat && model.chat.history && model.chat.history.enabled === false)" class="ibm-chat-btn cmr-block ibm-chat-available" @click="clickChatHistory">
                        <h2>{{ model.chat.history.heading || 'Chat History' }}</h2>
                        <p>{{ model.chat.history.text || 'Show your chat history' }}</p>
                      </div>
                      <div v-if="model.sms && model.sms.enabled" class="ibm-chat-btn cmr-block ibm-chat-available" @click="clickText">
                        <h2>{{ model.sms.heading || 'Text Us' }}<small> - {{ waitText(model.sms.waitTime) }} </small></h2>
                        <p>{{ formattedSmsNumber }}</p>
                      </div>
                      <div v-if="model.call && model.call.enabled" id="phone-container" class="cmr-phone-container cmr-block" @click="clickCall">
                        <h2>{{ model.call.heading || 'Call Us' }}<small> - {{ waitText(model.call.waitTime) }} </small></h2>
                        <p>{{ formattedDemoDnis }}</p>
                      </div>
                      <div v-if="model.callback && model.callback.enabled" class="cmr-callback-container cmr-block" @click="clickCallback">
                        <h2>{{ model.callback.heading || 'We\'ll Call You' }}<small> - {{ waitText(model.callback.waitTime) }}</small></h2>
                        <p>{{ model.callback.text || 'Receive a call back from an expert.' }}</p>
                      </div>
                      <div v-if="model.email && model.email.enabled" id="cmr-email-container" class="cmr-email-container cmr-block" @click="clickEmail">
                        <h2>{{ model.email.heading || 'Email an expert' }}<small> - {{ waitText([model.email.waitTimeMin, model.email.waitTimeMax]) }}</small></h2>
                        <p>{{ model.email.text || 'An expert will respond to your email.' }}</p>
                      </div>
                      <div v-if="model.task && model.task.enabled" class="cmr-task-container cmr-block" @click="clickTask">
                        <h2>{{ model.task.heading || 'Route a Task' }}</h2>
                        <p>{{ model.task.text || 'An expert will handle your task.' }}</p>
                      </div>
                      <div v-if="model.tracking && model.tracking.enabled" class="cmr-tracking-container cmr-block" @click="clickTracking">
                        <h2>{{ model.tracking.heading || 'Add Tracking Info' }}</h2>
                        <p>{{ model.tracking.text || 'An expert will receive tracking info from you.' }}</p>
                      </div>
                      <div v-if="model.cobrowse && model.cobrowse.enabled" class="cmr-cobrowse-container cmr-block" @click="clickCobrowse">
                        <h2>{{ model.cobrowse.heading || 'Cobrowse' }}<small> - {{ waitText(0) }}</small></h2>
                        <p>{{ model.cobrowse.text || 'An expert will cobrowse with you live.' }}</p>
                      </div>
                      <div v-if="model.video && model.video.enabled" class="cmr-video-container cmr-block" @click="clickVideo">
                        <h2>{{ model.video.heading || 'Live Video Assistance' }}<small> - {{ waitText(model.video.waitTime) }}</small></h2>
                        <p>{{ model.video.text || 'An expert will help you live over video.' }}</p>
                      </div>
                      <div v-if="model.menu && model.menu.custom" v-show="model.menu.custom" :class="model.menu.custom.class" @click="clickCustom">
                        <h2>{{ model.menu.custom.header }}<small> - {{ waitText(model.menu.custom.waitTime) }}</small></h2>
                        <p>{{ model.menu.custom.text }}</p>
                      </div>
                    -->


        </b-collapse>
      </div>
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      production: process.env.NODE_ENV === 'production',
      showContactPanel: true,
      model: {
        contactButtonText: 'Talk to an Expert',
        menuTitle: 'Need Help?',
        menuSubtitle: `We're here to help`,
        // iframe: 'https://toolbox.cdxdemo.net/users/matthmcc/Ashley%20Furniture%20HomeStore%20_%20Home%20Furniture%20&%20Decor.html',
        iframe: '',
        color1: '#0000aa',
        color2: '#0000dd',
        advisorEnabled: true,
        advisorImage: 'https://static.cxdemo.net/images/ming_advisor.png',
        advisorHeading: 'Expert Advisor',
        advisorText: `We're here to help`,
        chatEnabled: true,
        chatIcon: 'message-processing',
        chatHeading: 'Chat Now',
        chatText: 'An expert will chat with you live in your browser asdf',
        chatWaitTime: '1 min wait time',
        smsEnabled: true,
        smsIcon: 'message-processing',
        smsHeading: 'Text Us',
        smsText: '+1 817-949-1884',
        smsWaitTime: '1 min wait time',
        callEnabled: true,
        callIcon: 'phone-forward',
        callHeading: 'Call Us',
        callText: '+1 919-474-1884',
        callWaitTime: '1 min wait time'
      }
    }
  },

  mounted () {
    // load URL endpoints list from the API server
    this.getEndpoints()
    // update view now - probably remove this later for production
    this.updateView(this.model)
  },

  computed: {
    ...mapGetters([
      'loading',
      'endpoints',
      'endpointsLoaded',
      'instancesLoaded'
    ]),
    items () {
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
      return ret
    }
  },

  methods: {
    ...mapActions([
      'getEndpoints',
      'getSession',
      'getInstances'
    ]),
    updateView (model) {
      // set color 1
      window.document.documentElement.style.setProperty('--color-1', model.color1)
      // set color 2
      window.document.documentElement.style.setProperty('--color-2', model.color2)
      // --active-options
      window.document.documentElement.style.setProperty('--active-options', this.items.length)
    },
    waitText () {
      return '2 minutes'
    },
    clickChat (event) {
      console.log('clickChat', event)
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
  top: calc(20px + 20% - var(--active-options) * 20px);
  width: 30%;
  right: 0 !important;
  position: fixed;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  // slide the drawer out
  -webkit-transition:right .5s ease;
  transition:right .5s ease;
  .card {
    // nice rounded corners
    border-radius: 1em;
    // hide anything that flows over the rounded corners
    overflow: hidden;
  }
}

.contact-content {
  padding-top: 4px !important;
  padding-bottom: 0px !important;
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
}

.contact-icon {
  padding-left: 0.5em;
  padding-right: 1em;
  max-width: 4em;
  color: var(--color-1);
}

.contact-icon:hover {
  color: var(--color-2);
}

.contact-subtext {
  max-width: 95%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
