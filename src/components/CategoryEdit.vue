<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label>Выберите категорию</label>
        </div>

        <div class="input-field">
          <input
            id="nameEdit"
            type="text"
            v-model="title"
            :class="{ invalid: v.title.$dirty && v.title.required.$invalid }"
          />
          <label for="nameEdit">Название</label>
          <span
            v-if="v.title.$dirty && v.title.required.$invalid"
            class="helper-text invalid"
            >Введите название</span
          >
        </div>

        <div class="input-field">
          <input
            id="limitEdit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: v.limit.$dirty && v.limit.minValue.$invalid }"
          />
          <label for="limitEdit">Лимит</label>
          <span
            v-if="v.limit.$dirty && v.limit.minValue.$invalid"
            class="helper-text invalid"
            >Минимальная величина {{ v.limit.minValue.$params.min }}</span
          >
        </div>
        <button class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import M from 'materialize-css'

export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    limit: 100,
    current: null
  }),
  setup: () => ({ v: useVuelidate() }),
  validations: () => ({
    title: { required },
    limit: { minValue: minValue(100) }
  }),
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find((c) => c.id === catId)
      this.title = title
      this.limit = limit
    }
  },
  methods: {
    async submitHandler() {
      if (this.v.$invalid) {
        this.v.$touch()
        return
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message('Категория упешно обновлена')
        this.$emit('updated', categoryData)
        console.log(this.categories);
      } catch (e) {
        undefined
      }
    }
  },
  created() {
    const { title, limit, id } = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
