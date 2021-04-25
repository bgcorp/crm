<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />
    <p v-else-if="!records.length">
      Истории пока нет
      <router-link to="/categories">Добавить запись</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" />
    </section>
    <Paginate
      v-model="page"
      :page-count="pageCount"
      :click-handler="paginateHandler"
      :prev-text="'Назад'"
      :next-text="'Вперед'"
      :container-class="'pagination'"
      :page-class="'waves-effect'"
    />
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
import { mapActions } from 'vuex'
import paginateMixin from '@/mixins/paginate.mixin'

export default {
  components: {
    HistoryTable
  },
  mixins: [paginateMixin],
  data: () => ({
    loading: true,
    records: []
  }),

  async mounted() {
    this.records = await this.fetchRecords()
    const categories = await this.fetchCategories()

    this.setupPaginate(
      this.records.map((rec) => ({
        ...rec,
        categoryName: categories.find((c) => c.id === rec.categoryId).title,
        typeClass: rec.type === 'income' ? 'green' : 'red',
        typeText: rec.type === 'income' ? 'Доход' : 'Расход'
      }))
    )
    this.setup(categories)
    this.loading = false
  },
  methods: {
    ...mapActions(['fetchCategories', 'fetchRecords']),
    setup(categories) {
      this.setupPaginate(
        this.records.map((rec) => ({
          ...rec,
          categoryName: categories.find((c) => c.id === rec.categoryId).title,
          typeClass: rec.type === 'income' ? 'green' : 'red',
          typeText: rec.type === 'income' ? 'Доход' : 'Расход'
        }))
      )
    }
  }
}
</script>
