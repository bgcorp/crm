<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length">
      Категорий пока нет
      <router-link to="/categories">Добавить категорию</router-link>
    </p>
    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: v.amount.$dirty && v.amount.minValue.$invalid }"
        />
        <label for="amount">Сумма</label>
        <span
          v-if="v.amount.$dirty && v.amount.minValue.$invalid"
          class="helper-text invalid"
          >Минимальная величина {{ v.amount.minValue.$params.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: v.description.$dirty && v.description.required.$invalid
          }"
        />
        <label for="description">Описание</label>
        <span
          v-if="v.description.$dirty && v.description.required.$invalid"
          class="helper-text invalid"
          >Введите описание</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import M from 'materialize-css'
import { required, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  setup: () => ({ v: useVuelidate() }),
  validations: () => ({
    amount: { minValue: minValue(1) },
    description: { required }
  }),
  computed: {
    ...mapGetters(['info']),
    bill() {
      return this.info.bill
    },
    canCreateRecord() {
      if (this.type == 'income') {
        return true
      }
      return this.bill >= this.amount
    }
  },
  methods: {
    async submitHandler() {
      if (this.v.$invalid) {
        this.v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            type: this.type,
            amount: this.amount,
            description: this.description,
            date: new Date().toJSON()
          })
          const bill =
            this.type == 'income'
              ? this.bill + this.amount
              : this.bill - this.amount
          await this.$store.dispatch('updateInfo', { bill })
          this.$message('Запись успешно добавилась')
        } catch (e) {
          undefined
        }
      } else {
        this.$message(`Недостаточно средств (${this.amount - this.info.bill})`)
      }
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.category = this.categories[0].id
    this.loading = false

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select)
      M.updateTextFields()
    }, 0)
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
