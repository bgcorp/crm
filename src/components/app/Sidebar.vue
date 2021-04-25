<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      v-for="link in links"
      :key="link.url"
      :to="link.to"
      custom
      v-slot="{ href, navigate, isActive }"
    >
      <li :class="{ active: isActive }">
        <a
          class="waves-effect waves-orange pointer"
          :href="href"
          @click="navigate"
          >{{ link.title }}</a
        >
      </li>
    </router-link>
  </ul>
</template>

<script>
import localize from '../../filters/localize.filter'

export default {
  props: ['value'],
  data: () => ({
    links: [
      { title: localize('Menu_bill'), to: '/' },
      { title: localize('Menu_history'), to: '/history' },
      { title: localize('Menu_planning'), to: '/planning' },
      { title: localize('Menu_newRecord'), to: '/record' },
      { title: localize('Menu_categories'), to: '/categories' }
    ]
  })
}
</script>
