<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <!-- <b-field style="margin-top: 0.2em; margin-bottom: 0.2em;">
            <b-input placeholder="Search Menu..."
            v-if="authenticated"
            type="search"
            icon="magnify"
            v-model="filter"
            @keyup.esc="filter = ''"/>
          </b-field> -->
          <!-- <a class="nav-item is-hidden-tablet" @click="toggleSidebar({opened: !sidebar.opened})">
            <b-icon icon="bars" v-show="!sidebar.hidden" />
          </a> -->
        </div>
        <div class="nav-center">
          <!-- <router-link class="nav-item hero-brand" to="Home"> -->
            <!-- <tooltip :label="'v' + pkginfo.version" placement="right" type="success" size="small" :no-animate="true" :always="true" :rounded="true"> -->
              <!-- <div class="is-hidden-mobile"> -->
              <nav class="level">
                <div class="level-item">
                  <p>
                    <strong>
                      dCloud Toolbox - {{ currentInstance.datacenter }} {{ currentInstance.session }}
                    </strong>
                  </p>
                </div>
                <!-- <div class="level-item">
                  <b-select v-model="instanceSelection">
                    <option v-for="i of instances" :value="i.datacenter + '-' + i.id">{{ i.datacenter + '-' + i.id }}</option>
                  </b-select>
                </div> -->
              </nav>
              <!-- </div> -->
            <!-- </tooltip> -->
          <!-- </router-link> -->
        </div>
        <div class="nav-right is-flex">
          <a v-if="authenticated" class="nav-item">{{ user.username }}</a>
          <!-- <router-link v-if="!authenticated" to="/login" class="nav-item">Login</router-link> -->
          <a v-if="authenticated" @click="clickLogout" class="nav-item">Logout</a>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import Tooltip from 'vue-bulma-tooltip'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      filter: ''
      // instanceSelection: this.instance
    }
  },

  components: {
    Tooltip
  },

  props: {
    show: Boolean,
    menuFilter: String
  },

  computed: {
    ...mapGetters({
      pkginfo: 'pkg',
      sidebar: 'sidebar',
      authenticated: 'authenticated',
      user: 'user',
      instance: 'instance',
      'currentInstance': 'currentInstance'
      // instances: 'instances'
    })
  },

  methods: {
    ...mapActions([
      'toggleSidebar',
      'logout',
      'setInstance'
    ]),
    clickLogout () {
      this.logout()
    }
  },

  watch: {
    // instanceSelection (val, oldVal) {
    //   // user changed the instance selection
    //   if (val && val.length && val !== this.instance) {
    //     // change to another instance
    //     console.log('changing instance to', val)
    //     const parts = val.split('-')
    //     this.setInstance({
    //       datacenter: parts[0],
    //       id: parts[1]
    //     })
    //   }
    // },
    filter (val) {
      // this.$emit('update:menuFilter', $event.target.value)"
      this.$emit('update:menuFilter', val)
    }
    // instance (val) {
    //   // update form
    //   this.instanceSelection = val
    // }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';

.app-navbar {
  color: #28374B;
  a {
    color: #28374B;
  }
  position: fixed;
  min-width: 100%;
  z-index: 4;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .nav {
    min-height: 0em;
  }

  .container {
    // margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}

.hero-head {

  // .vue {
  //   margin-left: 10px;
  //   color: #36AC70;
  // }
  // .admin {
  // }
}
</style>
