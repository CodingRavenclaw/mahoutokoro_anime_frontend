<template>
  <div id="mainframe">
    <div class="row my-auto">
      <div class="col-12">
        <input class="form-control w-50" type="search" placeholder="Search for an anime...">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  methods: {
    getAnimes () {
      console.log('Not finished yet...')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
