<template>
  <div>
    <list-editor
    @submit="addPhone"
    @remove="removePhone"
    @refresh="refresh"
    :items="phones"
    :title="title"
    :placeholder="placeholder"
    :heading="heading"></list-editor>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import ListEditor from './list-editor.vue'

export default {
  components: {
    ListEditor
  },
  props: ['placeholder', 'heading', 'title'],
  mounted () {
    this.loadRouting(false)
  },
  computed: {
    ...mapGetters(['routing']),
    phones () {
      try {
        return this.routing.map(v => v.contact)
      } catch (e) {
        return []
      }
    }
  },
  methods: {
    ...mapActions(['addRouting', 'removeRouting', 'loadRouting']),
    addPhone (contact) {
      console.log('addPhone', contact)
      this.addRouting({contact: contact.toLowerCase()})
    },
    removePhone (contact) {
      console.log('removePhone', contact)
      this.removeRouting({contact: contact.toLowerCase()})
    },
    refresh () {
      console.log('refresh routing')
      this.loadRouting(false)
    }
  }
}
</script>
