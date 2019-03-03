<template>
  <div>
    <!-- Basic Information -->
    <b-collapse class="content card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Basic Information</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.id || !model.name">
        <button class="button is-primary" @click="$set(model, 'id', defaults.id); $set(model, 'name', defaults.name); $set(model, 'logo', {rasterised: defaults.logo.rasterised})">Configure</button>
      </div>
      <div class="card-content" v-else>
        <b-field label="ID">
          <b-input v-model="model.id" :placeholder="defaults.id" disabled="true" />
        </b-field>
        <b-field label="Name">
          <b-input v-model="model.name" :placeholder="defaults.name" />
        </b-field>
        <b-field label="Logo URL" v-if="user.admin">
          <b-input v-model.lazy="model.logo.rasterised" :placeholder="defaults.logo.rasterised" />
        </b-field>
        <b-field grouped>
          <b-loading :is-full-page="false" :active="working.images.logoFile" :can-cancel="false"></b-loading>
          <b-tooltip :label="getTooltip('logo')" multilined position="is-right">
            <b-icon type="is-primary" icon="information" />
          </b-tooltip>
          <b-field label="Logo Image">
            <img :src="model.logo.rasterised" style="max-width: 256px; max-height: 64px;"/>
          </b-field>
          <b-tooltip :label="getTooltip('logoUpload')" multilined position="is-top">
            <b-icon type="is-primary" icon="information" />
          </b-tooltip>
          <b-field label="Upload">
            <button class="button is-primary" type="button" @click="launchFilePicker('logoFile')">Browse...</button>
          </b-field>
        </b-field>
      </div>
    </b-collapse>
    <!-- /Basic Information -->

    <!-- IVR Menu -->
    <b-collapse class="content card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">IVR Menu</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.cvp">
        <button class="button is-primary" @click="$set(model, 'cvp', JSON.parse(JSON.stringify(defaults.cvp)))">Configure</button>
      </div>
      <div class="card-content" v-else>

        <b-field label="Welcome Prompt">
          <b-input v-model="model.cvp.welcomePrompt" :placeholder="defaults.cvp.welcomePrompt" />
        </b-field>
        <!-- Main and Second Menu -->
        <b-collapse class="content card" v-for="(menu, i) of ['mainMenu', 'secondMenu']" :key="menu">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">{{ menu === 'mainMenu' ? 'Main Menu' : 'Second Menu' }}</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content">

            <b-field label="TTS">
              <b-input v-model="model.cvp[menu].tts" :placeholder="defaults.cvp[menu].tts" />
            </b-field>

            <b-collapse class="content card" v-for="(option, j) of model.cvp[menu].options" :key="menu + j">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">Option {{ j + 1 }}</p>
                <!-- <p class="card-header-title">{{ option.name }}</p> -->
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content">

                <b-field grouped>
                  <b-field label="ASR Keyword">
                    <b-input v-model="option.name" :placeholder="defaults.cvp[menu].options[j].name" />
                  </b-field>
                  <b-field label="Finesse Reason Call Variable" expanded>
                    <b-input v-model="option.description" :placeholder="defaults.cvp[menu].options[j].description" />
                  </b-field>
                </b-field>

              </div>
            </b-collapse>

          </div>
        </b-collapse>
        <!-- /Main and SecondMenu -->

        <!-- Jacada -->
        <b-collapse class="content card" v-if="user.admin">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Jacada</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.cvp.jacadaMenu || !model.cvp.jacadaMenu.interactionId || !model.cvp.jacadaMenu.applicationKey">
            <button class="button is-primary" @click="$set(model.cvp, 'jacadaMenu', defaults.cvp.jacadaMenu)">Configure</button>
          </div>
          <div class="card-content" v-else>

            <b-field label="interactionId">
              <b-input v-model="model.cvp.jacadaMenu.interactionId" :placeholder="defaults.cvp.jacadaMenu.interactionId" />
            </b-field>
            <b-field label="applicationKey" expanded>
              <b-input v-model="model.cvp.jacadaMenu.applicationKey" :placeholder="defaults.cvp.jacadaMenu.applicationKey" />
            </b-field>

          </div>
        </b-collapse>
        <!-- /Jacada -->

      </div>
    </b-collapse>
    <!-- /IVR Menu -->

    <!-- Mobile -->
    <b-collapse class="content card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Mobile App</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.mobileWallpaper || !model.mobileTitle || !model.mobileOptions">
        <button class="button is-primary" @click="$set(model, 'mobileWallpaper', defaults.mobileWallpaper); $set(model, 'mobileTitle', defaults.mobileTitle); $set(model, 'mobileOptions', JSON.parse(JSON.stringify(defaults.mobileOptions)))">Configure</button>
      </div>
      <div class="card-content" v-else>

        <b-field label="Homepage Title">
          <b-input v-model="model.mobileTitle" :placeholder="defaults.mobileTitle" />
        </b-field>
        <b-field label="Wallpaper URL" v-if="user.admin">
          <b-input v-if="user.admin" v-model="model.mobileWallpaper" :placeholder="defaults.mobileWallpaper" />
        </b-field>
        <b-field grouped>
          <b-loading :is-full-page="false" :active="working.images.mobileWallpaper" :can-cancel="false"></b-loading>
          <b-field label="Wallpaper">
            <img :src="model.mobileWallpaper" style="max-height: 256px;"/>
          </b-field>
          <b-tooltip :label="getTooltip('mobileWallpaperUpload')" multilined position="is-top">
            <b-icon type="is-primary" icon="information" />
          </b-tooltip>
          <b-field label="Upload">
            <button class="button is-primary" type="button" @click="launchFilePicker('mobileWallpaper')">Browse...</button>
          </b-field>

        </b-field>

        <!-- Mobile Menu Options -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Mobile App Menu Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>

          <div class="card-content">
            <!-- Mobile Menu Option -->
            <b-collapse class="content card" v-for="(mobileOption, i) of model.mobileOptions" :key="`mobileOption${i}`">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">Mobile App Menu Option {{ i + 1 }}</p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>

              <div class="card-content">

                <b-field label="Option Title">
                  <b-input v-model="mobileOption.caption" :placeholder="defaults.mobileOptions[i].caption" />
                </b-field>

                <b-field grouped>
                  <b-field label="Icon Name">
                    <b-input v-model="mobileOption.icon" :placeholder="defaults.mobileOptions[i].icon" />
                  </b-field>
                  <b-field label="Icon">
                    <a @click.prevent="iconModalContext = {mobileOption}; showIconModal = true">
                      <b-icon pack="fa" :icon="mobileOption.icon" size="is-large" />
                    </a>
                  </b-field>
                  <b-field label="Choose Icon">
                    <button class="button is-primary" @click.prevent="iconModalContext = {mobileOption}; showIconModal = true">Browse...</button>
                  </b-field>
                </b-field>

                <!-- Mobile Menu Option Field -->
                <b-collapse class="content card" v-for="(field, j) of mobileOption.fields" :key="`mobileOption${i}Field${j}`">
                  <div slot="trigger" slot-scope="props" class="card-header">
                    <p class="card-header-title">Field {{ j + 1 }}</p>
                    <!-- <p class="card-header-title">{{ field.name }}</p> -->
                    <a class="card-header-icon">
                      <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                    </a>
                  </div>

                  <div class="card-content">
                    <b-field grouped>
                      <b-field label="Title" expanded>
                        <b-input v-model="field.name" :placeholder="defaults.mobileOptions[i].fields[j].name" />
                      </b-field>
                      <b-field label="Data Type">
                        <b-select :placeholder="defaults.mobileOptions[i].fields[j].type" v-model="field.type">
                          <option value="date">Date</option>
                          <option value="text">Text</option>
                        </b-select>
                      </b-field>
                      <b-field label="TTS Type">
                        <b-tooltip :label="getTtsTooltip(field.ttstype)" multilined>
                          <b-select :placeholder="defaults.mobileOptions[i].fields[j].ttstype" v-model="field.ttstype">
                            <option v-for="type of ttsTypes" :value="type.value">{{ type.name }}</option>
                          </b-select>
                        </b-tooltip>
                      </b-field>
                      <b-field label="Default Value" expanded v-if="field.type === 'text'">
                        <b-input type="text" v-model="field.value" :placeholder="defaults.mobileOptions[i].fields[j].value" />
                      </b-field>
                      <b-field label="Default Value" expanded v-if="field.type === 'date'">
                        <datepick inline-template :field="field">
                          <b-datepicker
                          placeholder="Click to select..."
                          icon="calendar-today"
                          v-model="model"
                          @input="input"
                          :date-parser="dateParser"
                          :date-formatter="dateFormatter"></b-datepicker>
                        </datepick>

                      </b-field>
                    </b-field>

                  </div>
                </b-collapse>
                <!-- /Mobile Menu Option Field -->
              </div>
            </b-collapse>
            <!-- /Mobile Menu Option -->
          </div>
        </b-collapse>
        <!-- /Mobile Menu Options -->

      </div>
    </b-collapse>
    <!-- /Mobile -->

    <!-- Chat Configuration -->
    <!-- <b-collapse class="content card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Chat</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.chat || !model.chat.entryPointId">
        <button class="button is-primary" @click="$set(model, 'chat', JSON.parse(JSON.stringify(defaults.chat)))">Configure</button>
      </div>
      <div class="card-content" v-else>
        <b-field label="Entry Point ID">
          <b-input v-model="model.chat.entryPointId" :placeholder="defaults.chat.entryPointId" />
        </b-field>

        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Chat Bot</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>

          <div class="card-content">

            <b-field label="DialogFlow Client Token">
              <b-input v-model="model.chat.bot.aiToken" :placeholder="defaults.chat.bot.aiToken" />
            </b-field>

          </div>
        </b-collapse>
      </div>
    </b-collapse> -->
    <!-- /Chat -->

    <!-- Website Configuration -->
    <b-collapse class="content card">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Website Configuration</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content">

        <!-- Contact Us Options -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Contact Us Page Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content">

            <!-- Contact Information -->
            <b-collapse class="content card">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">Contact Information</p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content" v-if="model.address === undefined || model.domain === undefined">
                <button class="button is-primary" @click="$set(model, 'address', defaults.address); $set(model, 'domain', defaults.domain);">Configure</button>
              </div>
              <div class="card-content" v-else>
                <b-field label="Address">
                  <b-input v-model="model.address" :placeholder="defaults.address" />
                </b-field>
                <b-field label="Domain Name">
                  <b-input v-model="model.domain" :placeholder="defaults.domain" />
                </b-field>
              </div>
            </b-collapse>
            <!-- /Contact Information -->

            <!-- Map GPS -->
            <b-collapse class="content card">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">Map Location</p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content" v-if="model.gps === undefined || model.gps.latitude === undefined || model.gps.longitude === undefined">
                <button class="button is-primary" @click="$set(model, 'gps', JSON.parse(JSON.stringify(defaults.gps)))">Configure</button>
              </div>
              <div class="card-content" v-else>
                <b-field grouped>
                  <b-field label="Latitude">
                    <b-input type="number" step="0.0000001" min="-90" max="90" v-model="model.gps.latitude" :placeholder="defaults.gps.latitude" />
                  </b-field>
                  <b-field label="Longitude">
                    <b-input type="number" step="0.0000001" min="-180" max="180" v-model="model.gps.longitude" :placeholder="defaults.gps.longitude" />
                  </b-field>
                </b-field>
              </div>
            </b-collapse>
            <!-- /Map GPS -->

            <!-- Task Routing Request Options -->
            <b-collapse class="content card">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">Task Routing Request Options</p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content" v-if="!model.taskOptions || !model.taskOptions.length">
                <button class="button is-primary" @click="$set(model, 'taskOptions', JSON.parse(JSON.stringify(defaults.taskOptions)))">Configure</button>
              </div>
              <div class="card-content" v-else>
                <ol>
                  <li v-for="(task, i) of model.taskOptions" :key="i">
                    <b-field grouped>
                      <b-field expanded>
                        <b-input v-model="task.text" :placeholder="defaults.taskOptions[i] ? defaults.taskOptions[i].text : defaults.taskOptions[0].text" />
                      </b-field>
                      <b-field>
                        <button class="button is-danger" @click="model.taskOptions.splice(i, 1)">Remove Option</button>
                      </b-field>
                    </b-field>
                  </li>
                </ol>
                <button class="button is-success" @click="model.taskOptions.push({text:''})">Add Option</button>
              </div>
            </b-collapse>
            <!-- /Task Routing Request Options -->
          </div>
        </b-collapse>
        <!-- /Contact Us Page Options -->

        <!-- Remote Expert Mobile -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Remote Expert Mobile</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.rem || !model.rem.reason || !model.rem.subreason">
            <button class="button is-primary" @click="$set(model, 'rem', {reason: defaults.rem.reason, subreason: defaults.rem.subreason})">Configure</button>
          </div>
          <div class="card-content" v-else>
            <b-field label="Finesse Reason Call Variable">
              <b-input v-model="model.rem.reason" :placeholder="defaults.rem.reason" />
            </b-field>
            <b-field label="Finesse Subreason Call Variable">
              <b-input v-model="model.rem.subreason" :placeholder="defaults.rem.subreason" />
            </b-field>

            <!-- Cobrowse Form -->
            <b-collapse class="content card" v-if="user.admin">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">Cobrowse Form</p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content" v-if="!model.form || !model.form.title || !model.form.fields || !model.form.fields.length || !model.form.private || !model.form.private.length">
                <button class="button is-primary" @click="$set(model, 'form', JSON.parse(JSON.stringify(defaults.form)))">Configure</button>
              </div>
              <div class="card-content" v-else>

                <b-field label="Title">
                  <b-input v-model="model.form.title" :placeholder="defaults.form.title" />
                </b-field>

                <b-collapse class="content card">
                  <div slot="trigger" slot-scope="props" class="card-header">
                    <p class="card-header-title">Form Fields</p>
                    <a class="card-header-icon">
                      <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                    </a>
                  </div>
                  <div class="card-content">
                    <ol>
                      <li v-for="(entry, i) of model.form.fields" :key="'formField' + i">
                        <b-field grouped>
                          <b-field expanded>
                            <b-input v-model="model.form.fields[i]" :placeholder="defaults.form.fields[i] ? defaults.form.fields[i] : defaults.form.fields[0]" />
                          </b-field>
                          <b-field>
                            <button class="button is-danger" @click="model.form.fields.splice(i, 1)">Remove Option</button>
                          </b-field>
                        </b-field>
                      </li>
                    </ol>
                    <button class="button is-success" @click="model.form.fields.push('')">Add Form Field</button>
                  </div>
                </b-collapse>

                <b-collapse class="content card">
                  <div slot="trigger" slot-scope="props" class="card-header">
                    <p class="card-header-title">Private Form Fields</p>
                    <a class="card-header-icon">
                      <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                    </a>
                  </div>
                  <div class="card-content">
                    <ol>
                      <li v-for="(entry, i) of model.form.private" :key="'formField' + i">
                        <b-field grouped>
                          <b-field expanded>
                            <b-select v-model="model.form.private[i]" :placeholder="defaults.form.private[i] ? defaults.form.private[i] : defaults.form.private[0]">
                              <option v-for="field of model.form.fields" :value="field">{{ field }}</option>
                            </b-select>
                          </b-field>
                          <b-field>
                            <button class="button is-danger" @click="model.form.private.splice(i, 1)">Remove Option</button>
                          </b-field>
                        </b-field>
                      </li>
                    </ol>
                    <button class="button is-success" @click="model.form.private.push('')">Add Private Form Field</button>
                  </div>
                </b-collapse>

              </div>
            </b-collapse>
            <!-- /Cobrowse Form -->
          </div>
        </b-collapse>
        <!-- /Remote Expert Mobile -->


        <!-- Homepage Banner -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Homepage Banner</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.sliders || !model.sliders.length">
            <button class="button is-primary" @click="$set(model, 'sliders', JSON.parse(JSON.stringify(defaults.sliders)))">Configure</button>
          </div>
          <div class="card-content" v-else>

            <b-collapse class="content card" v-for="(slider, i) of model.sliders" :key="i">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">
                  Banner {{ i + 1 }}
                  <!-- {{ slider.title }} -->
                  <button class="button is-danger" @click="model.sliders.splice(i, 1)" style="margin-left: auto;">Remove</button>
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content">
                <b-field label="Title">
                  <b-input v-model="slider.title" :placeholder="defaults.sliders[i] ? defaults.sliders[i].title : defaults.sliders[0].title" />
                </b-field>
                <b-field label="Text Line 1">
                  <b-input v-model="slider.text1" :placeholder="defaults.sliders[i] ? defaults.sliders[i].text1 : defaults.sliders[0].text1" />
                </b-field>
                <b-field label="Text Line 2">
                  <b-input v-model="slider.text2" :placeholder="defaults.sliders[i] ? defaults.sliders[i].text2 : defaults.sliders[0].text2" />
                </b-field>
                <b-field label="Button Text">
                  <b-input v-model="slider.buttonText" :placeholder="defaults.sliders[i] ? defaults.sliders[i].buttonText : defaults.sliders[0].buttonText" />
                </b-field>
                <b-field label="Button Destination">
                  <b-select :placeholder="defaults.sliders[i] ? defaults.sliders[i].buttonLink : defaults.sliders[0].buttonLink" v-model="slider.buttonLink">
                    <option value="about">About Us Page</option>
                    <option value="contact">Contact Us Page</option>
                    <option value="home">Home Page</option>
                    <!-- <option value="products">Products Page</option> -->
                    <option value="services">Services Page</option>
                  </b-select>
                </b-field>
                <b-field label="Image URL" v-if="user.admin">
                  <b-input v-model.lazy="slider.image" :placeholder="defaults.sliders[i] ? defaults.sliders[i].image : defaults.sliders[0].image" />
                </b-field>
                <b-field grouped>
                  <b-loading :is-full-page="false" :active="working.images['slider' + i]" :can-cancel="false"></b-loading>
                  <!-- <b-loading v-if="i === 1" :is-full-page="false" :active="working.images.slider1" :can-cancel="false"></b-loading>
                  <b-loading v-if="i === 2" :is-full-page="false" :active="working.images.slider2" :can-cancel="false"></b-loading>
                  <b-loading v-if="i === 3" :is-full-page="false" :active="working.images.slider3" :can-cancel="false"></b-loading>
                  <b-loading v-if="i === 4" :is-full-page="false" :active="working.images.slider4" :can-cancel="false"></b-loading> -->
                  <b-field label="Wallpaper">
                    <img :src="slider.image" style="max-height: 256px;"/>
                  </b-field>
                  <b-tooltip :label="getTooltip('sliderUpload')" multilined position="is-top">
                    <b-icon type="is-primary" icon="information" />
                  </b-tooltip>
                  <b-field label="Upload">
                    <button class="button is-primary" type="button" @click="launchFilePicker('slider', i)">Browse...</button>
                  </b-field>
                </b-field>
              </div>
            </b-collapse>

            <button class="button is-success" @click="model.sliders.push(JSON.parse(JSON.stringify(defaults.sliders[0])))">Add Option</button>
          </div>
        </b-collapse>
        <!-- /Homepage Banner -->

        <!-- Blog Entries -->
        <b-collapse class="content card">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">Blog Entries</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content" v-if="!model.blogItems || !model.blogItems.length">
            <button class="button is-primary" @click="$set(model, 'blogItems', JSON.parse(JSON.stringify(defaults.blogItems)))">Configure</button>
          </div>
          <div class="card-content" v-else>
            <b-collapse class="content card" v-for="(entry, i) of model.blogItems" :key="'blogItem' + i">
              <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">
                  Blog Entry {{ i + 1 }}
                  <!-- {{ entry.title }} -->
                  <button class="button is-danger" @click="model.blogItems.splice(i, 1)" style="margin-left: auto;">Remove</button>
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
                </a>
              </div>
              <div class="card-content">
                <b-field label="Title">
                  <b-input v-model="entry.title" :placeholder="defaults.blogItems[i] ? defaults.blogItems[i].title : defaults.blogItems[0].title" />
                </b-field>
                <b-field label="Subtitle">
                  <b-input v-model="entry.subTitle" :placeholder="defaults.blogItems[i] ? defaults.blogItems[i].subTitle : defaults.blogItems[0].subTitle" />
                </b-field>
                <!-- <b-field label="Description">
                <b-input type="textarea" v-model="entry.description" :placeholder="defaults.blogItems[i] ? defaults.blogItems[i].description : defaults.blogItems[0].description" />
              </b-field> -->
              <b-field label="Image URL" v-if="user.admin">
                <b-input v-model.lazy="entry.image" :placeholder="defaults.blogItems[i] ? defaults.blogItems[i].image : defaults.blogItems[0].image" />
              </b-field>
              <b-field grouped>
                <b-loading :is-full-page="false" :active="working.images['blogItem' + i]" :can-cancel="false"></b-loading>
                <b-field label="Blog Image">
                  <img :src="entry.image" style="max-height: 256px;"/>
                </b-field>
                <b-tooltip :label="getTooltip('blogItemUpload')" multilined position="is-top">
                  <b-icon type="is-primary" icon="information" />
                </b-tooltip>
                <b-field label="Upload">
                  <button class="button is-primary" type="button" @click="launchFilePicker('blogItem', i)">Browse...</button>
                </b-field>
              </b-field>
            </div>
          </b-collapse>

          <button class="button is-success" @click="model.blogItems.push(JSON.parse(JSON.stringify(defaults.blogItems[0])))">Add Option</button>
        </div>
      </b-collapse>
      <!-- /Blog Entries -->

      <!-- Services -->
      <b-collapse class="content card" v-if="user.admin">
        <div slot="trigger" slot-scope="props" class="card-header">
          <p class="card-header-title">Services</p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
          </a>
        </div>
        <div class="card-content" v-if="!model.services || !model.services.length">
          <button class="button is-primary" @click="$set(model, 'services', JSON.parse(JSON.stringify(defaults.services)))">Configure</button>
        </div>
        <div class="card-content" v-else>
          <b-collapse class="content card" v-for="(entry, i) of model.services" :key="'blogItem' + i">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">
                {{ entry.name }}
                <button class="button is-danger" @click="model.services.splice(i, 1)" style="margin-left: auto;">Remove</button>
              </p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
              </a>
            </div>
            <div class="card-content">
              <b-field label="Name">
                <b-input v-model="entry.name" :placeholder="defaults.services[i] ? defaults.services[i].title : defaults.services[0].title" />
              </b-field>
              <b-field label="Description">
                <b-input v-model="entry.description" :placeholder="defaults.services[i] ? defaults.services[i].description : defaults.services[0].description" />
              </b-field>
              <b-field label="Price">
                <b-input v-model="entry.price" :placeholder="defaults.services[i] ? defaults.services[i].price : defaults.services[0].price" />
              </b-field>

            <b-field label="Thumbnail Image URL" v-if="user.admin">
              <b-input v-model.lazy="entry.thumbnail" :placeholder="defaults.services[i] ? defaults.services[i].thumbnail : defaults.services[0].thumbnail" />
            </b-field>
            <b-field grouped>
              <b-loading :is-full-page="false" :active="working.images['servicesThumbnail' + i]" :can-cancel="false"></b-loading>
              <b-field label="Thumbnail Image">
                <img :src="entry.thumbnail" style="max-height: 128px;"/>
              </b-field>
              <b-tooltip :label="getTooltip('servicesThumbnailImageUpload')" multilined position="is-top">
                <b-icon type="is-primary" icon="information" />
              </b-tooltip>
              <b-field label="Upload">
                <button class="button is-primary" type="button" @click="launchFilePicker('servicesThumbnail', i)">Browse...</button>
              </b-field>
            </b-field>

            <b-field label="Image URL" v-if="user.admin">
              <b-input v-model.lazy="entry.image" :placeholder="defaults.services[i] ? defaults.services[i].image : defaults.services[0].image" />
            </b-field>
            <b-field grouped>
              <b-loading :is-full-page="false" :active="working.images['services' + i]" :can-cancel="false"></b-loading>
              <b-field label="Image">
                <img :src="entry.image" style="max-height: 256px;"/>
              </b-field>
              <b-tooltip :label="getTooltip('servicesImageUpload')" multilined position="is-top">
                <b-icon type="is-primary" icon="information" />
              </b-tooltip>
              <b-field label="Upload">
                <button class="button is-primary" type="button" @click="launchFilePicker('services', i)">Browse...</button>
              </b-field>
            </b-field>
          </div>
        </b-collapse>

        <button class="button is-success" @click="model.services.push(JSON.parse(JSON.stringify(defaults.services[0])))">Add Option</button>
      </div>
    </b-collapse>
    <!-- /Services -->

    <!-- Authors -->
    <b-collapse class="content card" v-if="user.admin">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Authors</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.authors || !model.authors.length">
        <button class="button is-primary" @click="$set(model, 'authors', JSON.parse(JSON.stringify(defaults.authors)))">Configure</button>
      </div>
      <div class="card-content" v-else>
        <b-collapse class="content card" v-for="(entry, i) of model.authors" :key="'author' + i">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
              {{ entry.firstName }} {{ entry.lastName }}
              <button class="button is-danger" @click="model.authors.splice(i, 1)" style="margin-left: auto;">Remove</button>
            </p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content">
            <b-field label="First Name">
              <b-input v-model="entry.firstName" :placeholder="defaults.authors[i] ? defaults.authors[i].firstName : defaults.authors[0].firstName" />
            </b-field>
            <b-field label="Last Name">
              <b-input v-model="entry.firstName" :placeholder="defaults.authors[i] ? defaults.authors[i].lastName : defaults.authors[0].lastName" />
            </b-field>
            <b-field label="Role">
              <b-input v-model="entry.role" :placeholder="defaults.authors[i] ? defaults.authors[i].role : defaults.authors[0].role" />
            </b-field>

            <b-field label="Image URL" v-if="user.admin">
              <b-input v-model.lazy="entry.image" :placeholder="defaults.authors[i] ? defaults.authors[i].image : defaults.authors[0].image" />
            </b-field>
            <b-field grouped>
              <b-loading :is-full-page="false" :active="working.images['authors' + i]" :can-cancel="false"></b-loading>
              <b-field label="Image">
                <img :src="entry.image" style="max-height: 256px;"/>
              </b-field>
              <b-tooltip :label="getTooltip('authorsImageUpload')" multilined position="is-top">
                <b-icon type="is-primary" icon="information" />
              </b-tooltip>
              <b-field label="Upload">
                <button class="button is-primary" type="button" @click="launchFilePicker('authors', i)">Browse...</button>
              </b-field>
            </b-field>
          </div>
        </b-collapse>

        <button class="button is-success" @click="model.authors.push(JSON.parse(JSON.stringify(defaults.authors[0])))">Add Option</button>
      </div>
    </b-collapse>
    <!-- /Authors -->

    <!-- Timeline Posts (About Us page) -->
    <b-collapse class="content card" v-if="user.admin">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Timeline Posts</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.timelinePosts || !model.timelinePosts.length">
        <button class="button is-primary" @click="$set(model, 'timelinePosts', JSON.parse(JSON.stringify(defaults.timelinePosts)))">Configure</button>
      </div>
      <div class="card-content" v-else>
        <b-collapse class="content card" v-for="(entry, i) of model.timelinePosts" :key="'timelinePost' + i">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
              {{ entry.title }}
              <button class="button is-danger" @click="model.timelinePosts.splice(i, 1)" style="margin-left: auto;">Remove</button>
            </p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content">
            <b-field label="Title">
              <b-input v-model="entry.title" :placeholder="defaults.timelinePosts[i] ? defaults.timelinePosts[i].title : defaults.timelinePosts[0].title" />
            </b-field>
            <b-field label="Link">
              <b-input v-model="entry.link" :placeholder="defaults.timelinePosts[i] ? defaults.timelinePosts[i].link : defaults.timelinePosts[0].link" />
            </b-field>
            <b-field label="Text">
              <b-input v-model="entry.text" :placeholder="defaults.timelinePosts[i] ? defaults.timelinePosts[i].text : defaults.timelinePosts[0].text" />
            </b-field>

            <b-field label="Image URL" v-if="user.admin">
              <b-input v-model.lazy="entry.image" :placeholder="defaults.timelinePosts[i] ? defaults.timelinePosts[i].image : defaults.timelinePosts[0].image" />
            </b-field>
            <b-field grouped>
              <b-loading :is-full-page="false" :active="working.images['timeline' + i]" :can-cancel="false"></b-loading>
              <b-field label="Image">
                <img :src="entry.image" style="max-height: 256px;"/>
              </b-field>
              <b-tooltip :label="getTooltip('timelineImageUpload')" multilined position="is-top">
                <b-icon type="is-primary" icon="information" />
              </b-tooltip>
              <b-field label="Upload">
                <button class="button is-primary" type="button" @click="launchFilePicker('timelinePosts', i)">Browse...</button>
              </b-field>
            </b-field>

          </div>
        </b-collapse>

        <button class="button is-success" @click="model.timelinePosts.push(JSON.parse(JSON.stringify(defaults.timelinePosts[0])))">Add Option</button>
      </div>
    </b-collapse>
    <!-- /Timeline Posts -->

    <!-- Testimonials (About Us page) -->
    <b-collapse class="content card" v-if="user.admin">
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">Testimonials</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content" v-if="!model.testimonials || !model.testimonials.length">
        <button class="button is-primary" @click="$set(model, 'testimonials', JSON.parse(JSON.stringify(defaults.testimonials)))">Configure</button>
      </div>
      <div class="card-content" v-else>
        <b-collapse class="content card" v-for="(entry, i) of model.testimonials" :key="'testimonials' + i">
          <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
              {{ entry.text.slice(0, 48) }}...
              <button class="button is-danger" @click="model.testimonials.splice(i, 1)" style="margin-left: auto;">Remove</button>
            </p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content">
            <b-field label="Text">
              <b-input type="textarea" v-model="entry.text" :placeholder="defaults.testimonials[i] ? defaults.testimonials[i].text : defaults.testimonials[0].text" />
            </b-field>
            <b-field label="Author">
              <b-input v-model="entry.author" :placeholder="defaults.testimonials[i] ? defaults.testimonials[i].author : defaults.testimonials[0].author" />
            </b-field>
          </div>
        </b-collapse>

        <button class="button is-success" @click="model.testimonials.push(JSON.parse(JSON.stringify(defaults.testimonials[0])))">Add Option</button>
      </div>
    </b-collapse>
    <!-- /Testimonials -->

  </div>
</b-collapse>
<!-- /Website Configuration -->

<select-icon-modal
v-if="showIconModal"
:visible="showIconModal"
:context="iconModalContext"
title="Select Icon"
@close="showIconModal = false"
@submit="selectIcon">
</select-icon-modal>

<input type="file" style="display:none" ref="file" accept="image/*" v-uploader />

</div>
</template>

<script>
import moment from 'moment'
import SelectIconModal from './modals/select-icon'
import Vue from 'vue'

// const TtsTypeSelector = Vue.component('TtsTypeSelector', {
//   props: ['field', 'types'],
//   computed: {
//     tooltip () {
//       try {
//         return this.types[this.field.ttstype].tooltip
//       } catch (e) {
//         return ''
//       }
//     }
//   }
// })

const ttsTypes = [
  {
    value: 'address',
    name: 'Address',
    tooltip: 'Interpret a value as part of street address.'
  },
  {
    value: 'characters',
    name: 'Characters',
    tooltip: 'Spell out each letter.'
  },
  {
    value: 'creditcard',
    name: 'Credit Card',
    tooltip: 'Interpret a value as a credit card number.'
  },
  {
    value: 'currency',
    name: 'Currency ($)',
    tooltip: 'Interpret a value as an amount of currency.'
  },
  {
    value: 'date',
    name: 'Date',
    tooltip: 'Interpret the value as a date. Specify the format with the format attribute.'
  },
  {
    value: 'digits',
    name: 'Digits',
    tooltip: 'Spell each digit separately.'
  },
  {
    value: 'number',
    name: 'Number',
    tooltip: 'Interpret the value as a cardinal number (1, 37, 2000, etc.).'
  },
  {
    value: 'ordinal',
    name: 'Ordinal',
    tooltip: 'Interpret the value as an ordinal number (1st, 2nd, 3rd, etc.).'
  },
  {
    value: 'telephone',
    name: 'Telephone',
    tooltip: 'Interpret a value as a 7-digit or 10-digit telephone number. This can also handle extensions (for example, 2025551212x345).'
  },
  {
    value: 'text',
    name: 'Text',
    tooltip: 'Interpret as normal text (attempt to pronounce all words).'
  },
  {
    value: 'time',
    name: 'Time',
    tooltip: 'Interpret a value such as 1\'21" as duration in minutes and seconds.'
  },
  // {
  //   value: 'fraction',
  //   name: 'Fraction',
  //   tooltip: 'Interpret the value as a fraction. This works for both common fractions (such as 3/20) and mixed fractions (such as 1+1/2).'
  // },
  {
    value: 'unit',
    name: 'Unit',
    tooltip: 'Interpret a value as a measurement. The value should be either a number or fraction followed by a unit (with no space in between) or just a unit.'
  }
  // {
  //   value: 'interjection',
  //   name: 'Interjection',
  //   tooltip: 'Interpret the value as an interjection. Alexa speaks the text in a more expressive voice. For optimal results, only use the supported interjections and surround each speechcon with a pause. For example: <say-as interpret-as="interjection">Wow.</say-as>. Speechcons are supported for the languages listed below.'
  // },
  // {
  //   value: 'expletive',
  //   name: 'Expletive',
  //   tooltip: '"Bleep" out the content inside the tag.'
  // }
]

const tooltips = {
  logo: 'The logo image is used for both the website and the mobile app.',
  logoUpload: 'We recommend using an image that has a 4:1 aspect ratio (i.e. 1000 x 250 pixels).',
  mobileWallpaperUpload: 'Note: the mobile wallpaper image will have a light blue filter applied by the mobile app. We recommend using an image that is at least 1242 x 2208 pixels.'
}

const Datepick = Vue.component('Datepick', {
  props: ['field'],
  data () {
    return {
      model: this.getDateValue()
    }
  },
  methods: {
    input (data) {
      // date picker chose a date, so update the field
      this.field.value = this.dateFormatter(data)
    },
    getDateValue () {
      // get a Date object for the current field value
      return new Date(moment(this.field.value).toDate())
    },
    dateParser (date) {
      // return new Date(Date.parse(date))
      const parsedDate = new Date(moment(date).format('MMM DD, YYYY HH:MM'))
      console.log('parsedDate', parsedDate)
      return parsedDate
    },
    dateFormatter (date) {
      // return date.toLocaleDateString()
      return moment(date).format('DD MMM YYYY')
    }
  }
})

export default {
  components: {
    SelectIconModal,
    Datepick
    // TtsTypeSelector
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
    'user': {
      type: Object
    },
    'defaults': {
      type: Object,
      default () { return {} }
    }
  },

  directives: {
    uploader: {
      bind (el, binding, vnode) {
        el.addEventListener('change', e => {
          // validate that a file was selected
          if (!e.target.files || !e.target.files[0]) {
            return
          }
          // console.log('change uploader with ref', vnode.data.ref, e.target.files)
          console.log('change uploader with ref', vnode.context.uploadRef, vnode.context.uploadIndex, e.target.files)
          // vnode.context.uploadFile(vnode.data.ref, e.target.files[0])
          vnode.context.uploadFile(vnode.context.uploadRef, vnode.context.uploadIndex, e.target.files[0])
          // vnode.context.chosenFiles = e.target.files
        })
      }
    }
  },

  data () {
    return {
      showIconModal: false,
      iconModalContext: {},
      active: {},
      ttsTypes,
      tooltips,
      files: [],
      images: [],
      uploadRef: null,
      uploadIndex: null
    }
  },

  methods: {
    launchFilePicker (ref, index) {
      console.log('launching file picker for', ref, index)
      // set ref
      this.uploadRef = ref
      // set index
      this.uploadIndex = index
      // launch native file picker
      this.$refs.file.click()
    },
    uploadFile (node, index, file) {
      console.log('vertical-config.vue - uploading file', node, index, file)
      // init file reader
      const reader = new window.FileReader()
      reader.onload = (e) => {
        const data = e.currentTarget.result
        const name = file.name.substring(0, file.name.lastIndexOf('.'))
        // set up callback for when the file is done uploading
        const callback = (url) => {
          // map out the node names to model data references
          const map = {
            'logoFile': (url) => { this.model.logo.rasterised = url },
            'mobileWallpaper': (url) => { this.model.mobileWallpaper = url },
            'slider': (url, index) => { this.model.sliders[index].image = url },
            'blogItem': (url, index) => { this.model.blogItems[index].image = url },
            'authors': (url, index) => { this.model.authors[index].image = url },
            'services': (url, index) => { this.model.services[index].image = url },
            'servicesThumbnail': (url, index) => { this.model.services[index].thumbnail = url },
            'timelinePosts': (url, index) => { this.model.timelinePosts[index].image = url }
          }
          // update our model with the new file URL
          try {
            map[node](url, index)
          } catch (e) {
            // continue
          }
        }
        // determine node name - if node has index, suffix node name with it
        let nodeName = node
        if (index) {
          nodeName += index
        }
        // actually upload the file now
        this.$emit('upload', {name, node: nodeName, vertical: this.model.id, data, callback})
        // reset the file input
        this.$refs.file.value = ''
      }
      // read the file data
      reader.readAsDataURL(file)
    },
    getTooltip (type) {
      try {
        return this.tooltips[type]
      } catch (e) {
        return ''
      }
    },
    getTtsTooltip (type) {
      try {
        return this.ttsTypes.find(v => v.value === type).tooltip
      } catch (e) {
        return ''
      }
    },
    selectIcon ({icon, context}) {
      console.log('selectIcon', icon)
      // close modal
      this.showIconModal = false
      // set value
      context.mobileOption.icon = icon
    },
    isRecent (date) {
      try {
        // items are updated if updated property is less than 14 days old
        return moment().diff(moment(date), 'days') < 14
      } catch (e) {
        // if anything fails, use false
        return false
      }
    },
    pushChanges (data) {
      this.$emit('update:data', JSON.stringify(data, null, 2))
    },
    submit () {
      console.log('vertical config form submitted')
      this.$emit('save', this.model)
    }
  },

  watch: {
    model (val, oldVal) {
      // console.log('branding config form model changed', val)
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
