<template>
  <div>
    <div class="page-title">
      <h3>{{ $filters.localize('Profile_title') }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="name"
          :class="{ invalid: v.name.$dirty && v.name.required.$invalid }"
        />
        <label for="description" :class="{ active: name.length }">{{
          $filters.localize('Name')
        }}</label>
        <span
          v-if="v.name.$dirty && v.name.required.$invalid"
          class="helper-text invalid"
        >
          {{ $filters.localize('Message_enterName') }}</span
        >
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $filters.localize('Update') }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import localize from '../filters/localize.filter'

export default {
  data: () => ({
    name: '',
    isRuLocale: true
  }),
  setup: () => ({ v: useVuelidate() }),
  validations: () => ({
    name: { required }
  }),
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
    async submitHandler() {
      if (this.v.$invalid) {
        this.v.$touch()
        return
      }
      try {
        await this.$store.dispatch('updateInfo', {
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
        this.$message(localize('Profile_success_updated'))
      } catch (e) {
        undefined
      }
    }
  },
  mounted() {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU' ? true : false
  }
}
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
