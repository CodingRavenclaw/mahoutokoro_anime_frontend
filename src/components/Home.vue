<template>
  <div id="mainframe" class="container-fluid vh-100">
    <div class="row h-100">
      <div class="col-12 my-auto text-white">
        <h1 class="text-center mb-3 calibri-light">Mahoutokoro Anime Checker</h1>
        <p class="text-center"> Do you want to bring your favorite anime to Mahoutokoro? Some anime are allowed some not. You can find it out quickly by searching for your anime in the text box below. If your anime is
        not found, please contact the database administrator.</p>
        <form class="my-3">
          <div class="row">
            <div class="col-4"></div>
            <div class="col-4">
              <div class="text-end">
              <input type="search" class="form-control" id="searchAnime" v-model="strSearch" v-on:input="getAnime" name="qryAnime" maxlength="32" placeholder="Type the name of the anime here...">
            </div>
            </div>
            <div class="col-4"></div>
          </div>
        </form>
        <table class="table table-light table-striped" :class="{'d-none': !arrAnime.length || !strSearch.length}">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Studio</th>
              <th scope="col">Author</th>
              <th scope="col">Year</th>
              <th scope="col">Country</th>
              <th scope="col">Allowed?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="anime in arrAnime" :key="anime.anime_id">
              <td> {{ anime.anime_name }}</td>
              <td> {{ anime.studio_name }}</td>
              <td> {{ anime.author_first_name + ' ' + anime.author_last_name }}</td>
              <td> {{ anime.year }}</td>
              <td> {{ anime.country_flag }}</td>
              <td> {{ anime.is_allowed ? '✅' : '❌' }}</td>
            </tr>
          </tbody>
        </table>
        <Pagination ref="pagination" @pageDown="changeDataSet($event)" @changePage="changeDataSet($event)" @pageUp="changeDataSet($event)" :class="{'d-none': !arrAnime.length || !strSearch.length}"
                    :int-data-per-page="this.intDataPerPage" :int-total-number-of-data="this.intTotalNumberOfAnime" :int-pages-to-display="this.intPagesToDisplay"></Pagination>
        <div class="alert alert-danger" v-if="this.boolAnimeNotFound" role="alert">
          Anime not found!
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Pagination from '@/components/utils/Pagination.vue'

export default defineComponent({
  name: 'Home',
  components: { Pagination },
  data () {
    return {
      strUrlToGetAnime: 'http://localhost:3000/anime/getanime',
      strUrlToGetTotalNumberOfAnime: 'http://localhost:3000/anime/gettotalnumberofanime',
      arrAnime: [],
      intDataSet: 0,
      strOrderBy: 'anime_id',
      strOrder: 'ASC',
      strSearch: '',
      strAnimeSearch: '',
      boolAnimeNotFound: 0,
      intDataPerPage: 10,
      intTotalNumberOfAnime: 0,
      intPagesToDisplay: 5
    }
  },
  methods: {
    async getTotalNumberOfAnime () {
      if (this.strSearch === 'ALL') {
        this.strAnimeSearch = ''
      } else {
        this.strAnimeSearch = this.strSearch
      }
      return this.$http.post(
        this.strUrlToGetTotalNumberOfAnime,
        { strSearch: this.strAnimeSearch }
      ).then(res => {
        this.intTotalNumberOfAnime = Number(res.data.data[0].total_number_of_anime)
      }).catch(err => {
        console.error(err)
      })
    },
    getAnime () {
      if (this.strSearch === 'ALL') {
        this.strAnimeSearch = ''
      } else {
        this.strAnimeSearch = this.strSearch
      }
      this.getTotalNumberOfAnime().then(() => {
        this.$http.post(
          this.strUrlToGetAnime,
          { intDataSet: this.intDataSet, intDataLimit: this.intDataPerPage, strOrder: this.strOrder, strOrderBy: this.strOrderBy, strSearch: this.strAnimeSearch }
        ).then(res => {
          this.boolAnimeNotFound = 0
          this.arrAnime = res.data.data
          const pagination: any = this.$refs.pagination
          pagination.calculatePages()
          pagination.checkDeactivationLogic()
          if (!this.arrAnime.length) {
            this.boolAnimeNotFound = 1
          }
        }).catch(err => {
          console.error(err)
        })
      })
    },
    changeDataSet (intADataSet: number) {
      this.intDataSet = intADataSet
      this.getAnime()
    }
  }
})
</script>

<style lang="scss" scoped>
  .calibri-light {
    font-family: "Calibri Light", sans-serif;
  }
</style>
