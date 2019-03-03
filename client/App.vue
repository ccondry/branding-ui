<template>
  <div id="app">
    <p>
      Hello!
    </p>
    <b-loading :is-full-page="true" :active="!authenticated && production" :can-cancel="false"></b-loading>
    <div v-if="authenticated || !production">
      <div v-if="!endpointsLoaded || !instancesLoaded">
        <!-- endpoints have not finished loading yet -->
        <b-loading :is-full-page="true" :active="(!endpointsLoaded || !instancesLoaded) && production" :can-cancel="false"></b-loading>
      </div>
      <div v-if="(endpointsLoaded && instancesLoaded) || !production">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      production: process.env.NODE_ENV === 'production'
    }
  },

  async beforeMount () {
    // check the JWT in localstorage to see if the user is already logged in
    // try {
    console.log('checking login...')
    await this.checkLogin()
    console.log('checking login done.')
    if (this.authenticated || !this.production) {
      // logged in
      console.log('getting instances...')
      await this.getInstances(false)
      console.log('getting instances done.')
      console.log('getting endpoints...')
      await this.getEndpoints(false)
      console.log('getting endpoints done.')
      // load the dcloud session details
      await this.getSession(false)
    } else {
      // not logged in
    }
  },

  computed: {
    ...mapGetters([
      'authenticated',
      'loading',
      'endpoints',
      'endpointsLoaded',
      'instancesLoaded'
    ])
  },

  methods: {
    ...mapActions([
      'toggleDevice',
      'checkLogin',
      'getEndpoints',
      'getSession',
      'getInstances'
    ])
  },

  watch: {
    async authenticated (val, oldVal) {
      // if user goes from logged in to logged out, forward them to the login page
      if (oldVal === true && val === false) {
        // if development, don't forward them
        if (this.production) {
          window.location = '/auth/login?destination=' + window.location
        }
      }
      // if the user logged in, load endpoints
      // if (oldVal === false && val === true) {
      //   // get instances
      //   await this.getInstances(false)
      //   // get endpoints
      //   await this.getEndpoints()
      //   // get dCloud session information
      //   await this.getSession(false)
      // }
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
}
</style>
