<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ heading }}</p>
      </header>
      <section class="modal-card-body">
        <p class="content" v-html="modalText" />

        <b-field :label="nameLabel">
          <b-input
          v-model="formData.name"
          placeholder="Jane Smith"
          required />
        </b-field>

        <b-field :label="phoneLabel">
          <b-input
          v-model="formData.phone"
          placeholder="5551112222"
          required />
        </b-field>

        <!-- <b-field :label="messageLabel" v-if="!isUccx">
          <b-input
          type="textarea"
          v-model="formData.message"
          placeholder="Message"
          />
        </b-field> -->

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">{{ cancelButton }}</button>
        <button class="button is-success" type="submit">{{ sendButton }}</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: [
    'phone',
    'name',
    'message',
    'heading',
    'modalText',
    'nameLabel',
    'phoneLabel',
    // 'messageLabel',
    'cancelButton',
    'sendButton',
    'isUccx'
  ],

  mounted () {
    // copy props to data
    this.formData.phone = this.phone
    this.formData.name = this.name
    // this.formData.message = this.message
  },

  data () {
    return {
      formData: {
        name: '',
        phone: ''
        // message: ''
      }
    }
  }
}
</script>

<style lang="scss">
.animation-content {
  width: 50%
}
.modal-card-foot {
  // pull the footer buttons to the right
  justify-content: flex-end !important;
}
</style>
