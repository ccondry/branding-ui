<template>
  <div>
    <b-loading :is-full-page="false" :active="loading.templates[type]" :can-cancel="false"></b-loading>
    <div class="block">
      <div class="field">
        <b-checkbox v-model="filterTemplates">Only show my templates</b-checkbox>
      </div>
      <div class="select is-fullwidth">
        <select class="input" v-model="selectedTemplate">
          <option value="" disabled selected>Choose a template to load</option>
          <option v-for="template in filteredSortedTemplates" :value="template.name">{{ template.name }}</option>
        </select>
      </div>
    </div>
    <b-field grouped group-multiline>
      <p class="control">
        <button type="button" class="button is-primary"
        @click="clickLoadTemplate"
        :disabled="!selectedTemplate">Load</button>
      </p>
      <p class="control">
        <button type="button" class="button is-success"
        @click="clickSaveTemplate"
        :disabled="disableSaveTemplate">Save</button>
      </p>
      <p class="control">
        <button type="button" class="button is-success"
        @click="clickSaveAsTemplate">Save As</button>
      </p>
      <p class="control">
        <button type="button" class="button is-info"
        @click="refresh">Refresh</button>
      </p>
    </b-field>
    <div class="content">
      <p>
        Use this form to load and save existing templates.
      </p>
      <p>
        You can save over your own templates again by using the save button
        on this panel. You will not be able to save over other users'
        templates.
      </p>
      <p>
        You can create new templates using the 'Save As' button.
      </p>
    </div>

    <save-template-modal
    ref="modal"
    :visible="showModal"
    title="Save As New Template"
    @close="showModal = false"
    @submit="modalSubmit" />

  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import SaveTemplateModal from './modals/save-template.vue'

export default {
  props: {
    type: {}
  },

  components: {
    SaveTemplateModal
  },

  data () {
    return {
      templateString: '',
      selectedTemplate: '',
      filterTemplates: false,
      formModel: {},
      showModal: false
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    ...mapActions({
      loadTemplates: 'loadTemplates',
      saveTemplate: 'saveTemplate'
    }),
    refresh () {
      // load templates
      this.loadTemplates({type: this.type, showNotification: false})
    },
    updateCache (data) {
      // copy state data to local data
      this.templateString = JSON.stringify(data, null, 2)
    },
    clickLoadTemplate () {
      console.log('loading template', this.selectedTemplate)
      this.$emit('load', this.selectedTemplateObject)
      // user clicked button to load a template
      // // update the raw JSON string
      // this.updateCache(this.selectedTemplateObject.data)
      // // update the form with a copy of the template object
      // this.formModel = JSON.parse(JSON.stringify(this.selectedTemplateObject.data))
    },
    clickSaveTemplate () {
      console.log('saving template', this.selectedTemplateObject)
      this.$emit('save', this.selectedTemplateObject)
    },
    clickSaveAsTemplate () {
      console.log('saving as template')
      // show the Save As modal
      this.showModal = true
    },
    modalSubmit (name) {
      // dismiss the modal
      this.showModal = false
      // submit the Save As modal
      this.$emit('save-as', name)
    }
  },

  computed: {
    ...mapGetters(['templates', 'user', 'loading', 'working']),
    sortedTemplates () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.templates[this.type]))
        // case-insensitive sort
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
        // console.log(`couldn't get sorted templates`, e)
        return []
      }
    },
    filteredSortedTemplates () {
      if (this.filterTemplates) {
        return this.sortedTemplates.filter(v => {
          return v.username === this.user.username
        })
      } else {
        return this.sortedTemplates
      }
    },
    disableSaveTemplate () {
      if (this.selectedTemplate.length) {
        // any template has been selected
        if (this.selectedTemplateObject.username === this.user.username || this.user.admin) {
          // this user owns this template or is an admin
          return false
        } else {
          // this user doesn't have access to save over this template,
          // so disable the button
          return true
        }
      } else {
        // template selection still on placeholder option
        return true
      }
    },
    selectedTemplateObject () {
      try {
        return this.templates[this.type].find(v => v.name === this.selectedTemplate)
      } catch (e) {
        return {}
      }
    }
  }
}
</script>
