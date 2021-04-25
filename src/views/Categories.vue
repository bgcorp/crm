<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <CategoryCreate @createdCategoty="addNewCategory" />
        <CategoryEdit
          v-if="categories.length"
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategory"
        />
        <p v-else>Категории пока нет</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'

export default {
  data: () => ({
    categories: [],
    updateCount: 0,
    loading: true
  }),
  components: {
    CategoryCreate,
    CategoryEdit
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategory(category) {
      const index = this.categories.findIndex((c) => (c.id === category.id))
      this.categories[index].title = category.title
      this.categories[index].limit = category.limit
      this.updateCount++
    }
  }
}
</script>
