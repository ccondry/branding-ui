<template>
  <form @submit.prevent="$parent.close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Call Us</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <p>
            You can reach one of our experts by phone at
            <strong>{{ dnis }}</strong>
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-success" @click="$parent.close()">OK</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['dnis']
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
