<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ $filters.currencyFilter(info.bill) }}</h4>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length">
      Категорий пока нет
      <router-link to="/categories">Добавить категорию</router-link>
    </p>
    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ $filters.currencyFilter(cat.spend) }} из
          {{ $filters.currencyFilter(cat.limit) }}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.color]"
            :style="{ width: cat.progressPersent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
    ...mapActions(['fetchCategories', 'fetchRecords'])
  },
  async mounted() {
    const categories = await this.fetchCategories()
    const records = await this.fetchRecords()
    this.loading = false

    this.categories = categories.map((c) => {
      const spend = records
        .filter((r) => r.categoryId === c.id)
        .filter((r) => r.type === 'outcome')
        .reduce((total, r) => (total += +r.amount), 0)
      const persent = (spend * 100) / c.limit
      const progressPersent = persent > 100 ? 100 : persent
      const color = persent < 60 ? 'green' : persent < 100 ? 'yellow' : 'red'

      const tooltipValue = c.limit - spend
      const tooltip = `${
        tooltipValue < 0 ? 'Превышение на' : 'Осталось'
      } ${this.$filters.currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...c,
        progressPersent,
        color,
        spend,
        tooltip
      }
    })
  }
}
</script>
