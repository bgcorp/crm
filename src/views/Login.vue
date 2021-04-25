<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model="email"
          :class="{
            invalid:
              (v.email.$dirty && v.email.required.$invalid) ||
              (v.email.$dirty && v.email.email.$invalid)
          }"
        />
        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="v.email.$dirty && v.email.required.$invalid"
          >Поле не должно быть пустым</small
        >
        <small
          class="helper-text invalid"
          v-else-if="v.email.$dirty && v.email.email.$invalid"
          >Введите корректный email</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model="password"
          :class="{
            invalid:
              (v.password.$dirty && v.password.required.$invalid) ||
              (v.password.$dirty && v.password.minLength.$invalid)
          }"
        />
        <label for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="v.password.$dirty && v.password.required.$invalid"
          >Поле не должно быть пустым</small
        >
        <small
          class="helper-text invalid"
          v-else-if="v.password.$dirty && v.password.minLength.$invalid"
          >Пароль не должен быть меньше
          {{ v.password.minLength.$params.min }} символов. Сейчас
          {{ password.length }}</small
        >
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import messages from '../utils/messages'

export default {
  data: () => ({
    email: '',
    password: ''
  }),
  setup: () => ({ v: useVuelidate() }),
  validations: () => ({
    email: { required, email },
    password: { required, minLength: minLength(3) }
  }),
  methods: {
    async submitHandler() {
      if (this.v.$invalid) {
        this.v.$touch()
        return
      }
      let formData = {
        email: this.email,
        password: this.password
      }
      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
      } catch (e) {
        undefined
      }
    }
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  }
}
</script>
