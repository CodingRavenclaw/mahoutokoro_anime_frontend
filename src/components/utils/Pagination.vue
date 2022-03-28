<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: isPageFirstDisabled}"><a class="page-link" href="#">«</a></li>
      <li class="page-item" :class="{ disabled: isPageDownDisabled }"><a class="page-link" @click="pageDown" href="#">‹</a></li>
      <li v-for="n in this.intPagesToRender" :key="n" class="page-item" :class="{active: n + intOffset === intCurrentPage, disabled: n + intOffset > intPages}"><a class="page-link" href="#"
        @click="changeCurrentPage(n, n + intOffset)">{{n + intOffset}}</a></li>
      <li class="page-item" :class="{ disabled: isPageUpDisabled }"><a class="page-link" @click="pageUp" href="#">›</a></li>
      <li class="page-item" :class="{ disabled: isPageLastDisabled }"><a class="page-link" href="#">»</a></li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    intTotalNumberOfData: Number,
    intPagesToDisplay: Number,
    intDataPerPage: Number
  },
  data () {
    return {
      intCurrentPage: 1,
      intPages: 0,
      intPagesToRender: 0,
      intCurrentKey: 0,
      intOffset: 0,
      intZoneCounter: 1,
      isPageDownDisabled: true,
      isPageUpDisabled: true,
      isPageFirstDisabled: true,
      isPageLastDisabled: true
    }
  },
  methods: {
    checkDeactivationLogic () {
      if (!this.intPagesToDisplay || !this.intDataPerPage || !this.intTotalNumberOfData) return 0
      let intEndZone = 0
      if (this.intPages % this.intPagesToRender !== 0) {
        intEndZone = Math.trunc(this.intPages / this.intPagesToRender) * this.intPagesToRender + 1
      } else {
        intEndZone = this.intPages - (this.intPagesToRender - 1)
      }
      // Case 1: calculated pages are smaller than the pages to display
      if (this.intPages <= this.intPagesToDisplay) {
        this.intPagesToRender = this.intPages
        this.isPageDownDisabled = true
        this.isPageUpDisabled = true
        this.isPageFirstDisabled = true
        this.isPageLastDisabled = true
        // Case 3: the current page is in the start zone
      } else if (this.intCurrentPage <= this.intPagesToRender) {
        this.intPagesToRender = this.intPagesToDisplay
        this.isPageDownDisabled = true
        this.isPageUpDisabled = false
        this.isPageFirstDisabled = false
        this.isPageLastDisabled = false
        // Case 2: the current page is in the end zone
      } else if (this.intCurrentPage >= intEndZone) {
        if (this.intCurrentPage > this.intPages) {
          this.intCurrentPage = this.intPages
        }
        this.isPageDownDisabled = false
        this.isPageUpDisabled = true
        this.isPageFirstDisabled = false
        this.isPageLastDisabled = false
        // Case 4: normal pagination possible
      } else {
        this.isPageDownDisabled = false
        this.isPageUpDisabled = false
        this.isPageFirstDisabled = false
        this.isPageLastDisabled = false
      }
    },
    calculatePages () {
      if (!this.intTotalNumberOfData || !this.intPagesToDisplay || !this.intDataPerPage) return 0
      this.intPagesToRender = this.intPagesToDisplay
      if (this.intTotalNumberOfData % this.intDataPerPage !== 0) {
        this.intPages = Math.trunc(this.intTotalNumberOfData / this.intDataPerPage) + 1
      } else {
        this.intPages = this.intTotalNumberOfData / this.intDataPerPage
      }
    },
    changeCurrentPage (intKey: number, intAPage: number) {
      if (!this.intDataPerPage) return 0
      this.calculatePages()
      this.intCurrentPage = intAPage
      this.intCurrentKey = intKey
      this.checkDeactivationLogic()
      if (this.intCurrentPage === 1) {
        this.$emit('changePage', 0)
      } else {
        this.$emit('changePage', this.intCurrentPage * this.intDataPerPage - this.intDataPerPage)
      }
    },
    pageToFirstPage () {
      this.intCurrentPage = 1
      this.intOffset = 0
      this.intZoneCounter = 1
    },
    pageUp () {
      if (!this.intPagesToDisplay || !this.intDataPerPage) return 0
      this.calculatePages()
      this.intPagesToRender = this.intPagesToDisplay
      this.intCurrentPage += this.intPagesToRender
      this.intOffset += this.intPagesToRender
      this.intZoneCounter++
      this.checkDeactivationLogic()
      if (this.intCurrentPage === 1) {
        this.$emit('pageUp', 0)
      } else {
        this.$emit('pageUp', this.intCurrentPage * this.intDataPerPage - this.intDataPerPage)
      }
    },
    pageDown () {
      if (!this.intPagesToDisplay || !this.intDataPerPage) return 0
      this.calculatePages()
      this.intPagesToRender = this.intPagesToDisplay
      this.intCurrentPage -= this.intPagesToRender
      this.intOffset -= this.intPagesToRender
      this.intZoneCounter--
      this.checkDeactivationLogic()
      if (this.intCurrentPage === 1) {
        this.$emit('pageDown', 0)
      } else {
        this.$emit('pageDown', this.intCurrentPage * this.intDataPerPage - this.intDataPerPage)
      }
    },
    adjustPageAfterDeletion () {
      if (!this.intPagesToDisplay || !this.intDataPerPage) return 0
      const intFirstZonePage = this.intZoneCounter * this.intPagesToRender - (this.intPagesToRender - 1)
      if (this.intCurrentPage === intFirstZonePage) {
        this.pageDown()
        this.intCurrentPage += this.intPagesToRender - 1
      } else {
        this.intCurrentPage--
      }
      this.$emit('changePage', this.intCurrentPage * this.intDataPerPage - this.intDataPerPage)
    }
  },
  mounted () {
    this.calculatePages()
    this.checkDeactivationLogic()
  }
})
</script>

<style scoped>
  .w-10 {
    width: 4% !important;
  }
</style>
