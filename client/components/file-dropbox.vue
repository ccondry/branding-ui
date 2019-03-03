<template>
  <div>
    <b-loading :is-full-page="false" :active="loading || working" :can-cancel="false"></b-loading>
    <!-- PRETTY FILE INPUT -->
    <ul>
      <li v-for="file of chosenFiles">
        {{ file.name }}
      </li>
    </ul>
    <button class="button is-primary" type="button" @click="launchFilePicker">Choose File(s)</button>

    <button v-show="chosenFiles.length" class="button is-success" @click.prevent="submit">Upload</button>
    <!-- REAL FILE INPUT HIDDEN -->
    <input type="file" style="display:none" ref="file" v-uploader multiple />
  </div>
</template>

<script>
export default {
  props: ['path', 'loading', 'working'],
  directives: {
    uploader: {
      bind (el, binding, vnode) {
        el.addEventListener('change', e => {
          vnode.context.chosenFiles = e.target.files
        })
      }
    }
  },
  data () {
    return {
      chosenFiles: [],
      uploadFieldName: 'files'
    }
  },
  methods: {
    launchFilePicker () {
      this.$refs.file.click()
    },
    // fileSize (file) {
    //   if (file.size < 1024) {
    //     return file.size + ' b'
    //   } else if (file.size < 1024 ** 2) {
    //     return (file.size / 1024).toFixed(2) + ' Kb'
    //   } else if (file.size < 1024 ** 3) {
    //     return (file.size / 1024 ** 2).toFixed(2) + ' Mb'
    //   } else {
    //     return (file.size / 1024 ** 3).toFixed(2) + ' Gb'
    //   }
    // },
    async save (formData) {
      this.$emit('save', formData)
    },
    async submit () {
      // do nothing if no files selected
      if (!this.chosenFiles.length) return

      // build html form data
      const formData = new window.FormData()

      console.log('chosenFiles', this.chosenFiles)
      // append the files to FormData
      Object.keys(this.chosenFiles).forEach(i => {
        const file = this.chosenFiles[i]
        formData.append(this.uploadFieldName, file, file.name)
      })

      // append path field
      formData.append('path', this.path)

      // save it
      await this.save(formData)
    }
  }
}
</script>

<style lang="scss">
// .dropbox {
//   outline: 2px dashed grey; /* the dash box */
//   outline-offset: -10px;
//   background: lightcyan;
//   color: dimgray;
//   padding: 10px 10px;
//   min-height: 200px; /* minimum height */
//   position: relative;
//   cursor: pointer;
// }

// .input-file {
//   opacity: 0; /* invisible but it's there! */
//   width: 100%;
//   height: 200px;
//   position: absolute;
//   cursor: pointer;
// }

// .dropbox:hover {
//   background: lightblue; /* when mouse over to the drop zone, change color */
// }
//
// .dropbox p {
//   font-size: 1.2em;
//   text-align: center;
//   padding: 50px 0;
// }
</style>
