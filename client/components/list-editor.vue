<template>
  <div>
    <h1 class="title">
      {{ title }}
      <button class="button is-primary" @click="$emit('refresh')">Refresh</button>
    </h1>

    <div class="table-responsive">
      <form @submit.prevent="$emit('submit', input); input = ''">
        <table class="table is-bordered is-narrow">

          <thead>
            <tr>
              <th>{{ heading }}</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in items">
              <td>{{ item }}</td>
              <td><button type="button" class="button is-danger"
                @click.prevent="$emit('remove', item); input = item">Remove</button>
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr>
              <td>
                <input class="input" type="text" :placeholder="placeholder" v-model="input">
              </td>
              <td>
                <button type="submit" class="button is-success" :disabled="!input.length">Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'title', 'placeholder', 'heading'],
  data () {
    return {
      input: ''
    }
  }
}
</script>
