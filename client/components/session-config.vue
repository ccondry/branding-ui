<template>
  <div>
    <!-- Demo Configuration -->
    <b-collapse class="content card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Demo Configuration</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model">
        <button class="button is-primary" @click="$set(model, 'configuration', JSON.parse(JSON.stringify(defaults)))">Configure</button>
      </div>
      <div class="card-content" v-else>

        <!-- Vertical Configuration -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Vertical Configuration</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.vertical">
            <button class="button is-primary" @click="$set(model, 'vertical', defaults.vertical)">Configure</button>
          </div>
          <div class="card-content" v-else>
            <div class="block">
              <div class="field">
                <div class="field">
                  <b-radio v-model="verticalFilter"
                  native-value="all">Show all verticals</b-radio>
                </div>
                <div class="field">
                  <b-radio v-model="verticalFilter"
                  native-value="mine">Show only my verticals</b-radio>
                </div>
                <div class="field">
                  <b-radio v-model="verticalFilter"
                  native-value="other">
                  Show only this user's verticals:
                  <b-autocomplete
                    v-model="ownerFilter"
                    :data="autocompleteOwners">
                    <template slot="empty">No results found</template>
                  </b-autocomplete>
                </b-radio>
                </div>
                <!-- <b-field>
                  <b-checkbox v-model="showOnlyMyVerticals">Show only my verticals</b-checkbox>
                </b-field> -->
                <!-- <b-checkbox v-model="filterTemplates">Show only this user's verticals:</b-checkbox> -->
                <b-field grouped>
                  <!-- <b-input v-model="ownerFilter" /> -->

                </b-field>
                Choose your desired vertical here:
              </div>
              <div class="select">
                <select class="input" v-model="model.vertical">
                  <option value="" disabled selected>Choose a vertical to use</option>
                  <option v-for="vertical in systemVerticals" :value="vertical.id">{{ `${vertical.name} (${vertical.id})` }}</option>
                  <option disabled>-----------------------------------------</option>
                  <option v-for="vertical in userVerticals" :value="vertical.id" v-if="verticalFilter === 'all'">{{ `${vertical.name} (${vertical.id})` }}</option>
                  <option v-for="vertical in myVerticals" :value="vertical.id" v-if="verticalFilter === 'mine'">{{ `${vertical.name} (${vertical.id})` }}</option>
                  <option v-for="vertical in filteredSortedVerticals" :value="vertical.id" v-if="verticalFilter === 'other'">{{ `${vertical.name} (${vertical.id})` }}</option>
                </select>
              </div>
            </div>

          </div>
        </b-collapse>
        <!-- /Vertical Configuration -->

        <!-- Multichannel Configuration -->
        <b-collapse class="content card" v-if="model.demo === 'pcce'">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Multichannel Configuration</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.multichannel">
            <button class="button is-primary" @click="$set(model, 'multichannel', defaults.multichannel)">Configure</button>
          </div>
          <div class="card-content" v-else>
            <b-field label="Multichannel System">
              <b-select v-model="model.multichannel">
                <option value="ece">ECE</option>
                <!-- <option value="sfdc">SFDC</option> -->
                <option value="upstream">Upstream Works</option>
              </b-select>
            </b-field>
          </div>
        </b-collapse>
        <!-- /Multichannel Configuration -->

        <!-- AI Configuration -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">AI Configuration</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="chatBotConfigured">
            <button class="button is-primary" @click="configureChatBot">Configure</button>
          </div>
          <div class="card-content" v-else>

            <b-field label="Bot Enabled">
              <b-select v-model="model.chatBotEnabled">
                <option :value="true">Enabled</option>
                <option :value="false">Disabled</option>
              </b-select>
            </b-field>

            <p>
              Please download
              <a :href="intentsZipUrl">
                this zip file
              </a>
              containing the dCloud DialogFlow intents and import it into your
              DialogFlow. Then you can customize it with your own text and
              intents, and use your Client Access API Token here.
            </p>

            <b-field label="DialogFlow Client Access API Token">
              <b-autocomplete
              v-model="model.chatBotToken"
              :data="[defaults.chatBotToken]"
              :placeholder="defaults.chatBotToken" />
            </b-field>

            <b-field grouped>
              <b-field label="Language">
                <b-select v-model="model.language">
                  <option value="en">English</option>
                  <option value="pt">Portugese</option>
                </b-select>
              </b-field>

              <b-field label="Region">
                <b-select v-model="model.region">
                  <option value="US">US</option>
                  <option value="GB">GB</option>
                  <option value="AU">AU</option>
                  <option value="BR">BR</option>
                  <option value="PT">PT</option>
                </b-select>
              </b-field>
            </b-field>

            <b-field label="Post-Chat-Bot Survey">
              <b-select v-model="model.chatBotSurveyEnabled">
                <option :value="true">Enabled</option>
                <option :value="false">Disabled</option>
              </b-select>
            </b-field>

            <b-field label="Conversational IVR TTS Engine">
              <b-select v-model="model.ttsEngine">
                <option value="nuance">Nuance</option>
                <option value="google">Google</option>
              </b-select>
            </b-field>

          </div>
        </b-collapse>
        <!-- /AI Configuration -->


        <!-- SMS Deflection Configuration -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Courtesy Callback SMS Deflection Configuration</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.smsDeflectionMessage">
            <button class="button is-primary" @click="$set(model, 'smsDeflectionMessage', defaults.smsDeflectionMessage)">Configure</button>
          </div>
          <div class="card-content" v-else>
            <div class="block">
              <b-field label="SMS Deflection Message">
                  <b-input
                  :value="decodeURIComponent(model.smsDeflectionMessage)"
                  @change="model.smsDeflectionMessage = encodeURIComponent($event.target.value)"
                  />
                </b-field>
            </div>
          </div>
        </b-collapse>
        <!-- /SMS Deflection Configuration -->
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ownerFilter: '',
      verticalFilter: 'all'
    }
  },

  props: {
    'model': {
      type: Object,
      default () { return {} }
    },
    'working': {
      type: Object
    },
    'loading': {
      type: Object
    },
    'defaults': {
      type: Object,
      default () { return {} }
    },
    'verticals': {
      type: Array,
      default () {
        return [
          {id: 'travel', name: 'Travel'},
          {id: 'city', name: 'City'},
          {id: 'finance', name: 'Finance'},
          {id: 'health', name: 'Health'},
          {id: 'utility', name: 'Utility'}
        ]
      }
    },
    'username': {
      type: String
    },
    'intentsZipUrl': {
      type: String
    }
  },

  methods: {
    pushChanges (data) {
      this.$emit('update:data', JSON.stringify(data, null, 2))
    },
    submit () {
      console.log('vertical config form submitted')
      this.$emit('save', this.model)
    },
    configureChatBot () {
      this.$set(this.model, 'chatBotEnabled', this.defaults.chatBotEnabled)
      this.$set(this.model, 'chatBotToken', this.defaults.chatBotEnabled)
      this.$set(this.model, 'language', this.defaults.chatBotEnabled)
      this.$set(this.model, 'region', this.defaults.chatBotEnabled)
      this.$set(this.model, 'chatBotSurveyEnabled', this.defaults.chatBotEnabled)
      this.$set(this.model, 'ttsEngine', this.defaults.ttsEngine)
    }
  },

  computed: {
    chatBotConfigured () {
      return this.model.chatBotEnabled === undefined &&
      this.model.chatBotToken === undefined &&
      this.model.language === undefined &&
      this.model.region === undefined &&
      this.model.chatBotSurveyEnabled === undefined
    },
    autocompleteOwners () {
      const allOwners = this.verticals.map(v => v.owner)
      const uniqueOwners = Array.from(new Set(allOwners))
      return uniqueOwners.filter((option) => {
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.ownerFilter.toLowerCase()) >= 0
      })
    },
    sortedVerticals () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.verticals))
        // case-insensitive sort by name
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        console.log(`couldn't get sorted verticals`, e)
      }
    },
    systemVerticals () {
      return this.sortedVerticals.filter(v => !v.owner || v.owner === 'system' || v.owner === null)
    },
    userVerticals () {
      return this.sortedVerticals.filter(v => v.owner && v.owner !== 'system' && v.owner !== null)
    },
    myVerticals () {
      return this.sortedVerticals.filter(v => v.owner === this.username)
    },
    filteredSortedVerticals () {
      // filter to only show the verticals owned by specified user
      return this.sortedVerticals.filter(v => v.owner === this.ownerFilter)
    }
  },

  watch: {
    model (val, oldVal) {
      // model changed - format and push those changes back to the parent
      this.pushChanges(val)
    }
  }
}
</script>

<style lang="scss">
.content .card-header .card-header-title {
  margin-bottom: 0;
}
.card-header-title, .card-header-icon {
  background-color: #f3f3f3;
}
</style>
