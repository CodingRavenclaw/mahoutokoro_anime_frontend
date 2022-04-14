<template>
  <div id="mainframe" class="container-fluid vh-100">
    <div class="row h-100">
      <div class="col-12 my-auto text-red" v-if="this.boolFatalError">
        <h1 class="text-center fw-bolder calibri-light">🙇 Gomen-nasai! 🙇</h1>
        <p class="text-center fw-bold">The application is currently offline or in maintenance. If the error still occurs after a while, please contact the
          <a href="mailto:samara.cheung@mahoutokoro.jp">database administrator</a>.</p>
      </div>
      <div class="col-12 my-auto text-white" v-if="!this.boolFatalError">
        <h1 class="text-center mb-3 calibri-light">Mahoutokoro Anime Checker</h1>
        <p class="text-center"> Do you want to bring your favorite anime to Mahoutokoro? Some anime are allowed and some not.
          You can find it out quickly by searching for your anime in the text box below. There are currently {{ this.intTotalNumberOfAnimeInDatabase }} anime in the database. <br>
          If your anime is not found, please contact the <a href="mailto:samara.cheung@mahoutokoro.jp">database administrator</a>.</p>
        <form class="my-3">
          <div class="row">
            <div class="col-4"></div>
            <div class="col-4">
              <div class="input-group">
                <div class="input-group-text">🔎</div>
                <input type="search" class="form-control" id="searchAnime" v-model="strSearch" v-on:input="getAnime" name="qryAnime" maxlength="32" placeholder="Type the name of the anime here...">
              </div>
            </div>
            <div class="col-4"></div>
          </div>
        </form>
        <table class="table table-light table-striped" :class="{'d-none': !arrAnime.length || !strSearch.length}">
          <thead>
            <tr>
              <th scope="col" :class="{
                'bg-primary': this.strOrderBy === 'anime_name',
                'order-by-asc': this.strOrderBy === 'anime_name' && this.strOrder === 'ASC',
                'order-by-desc': this.strOrderBy === 'anime_name' && this.strOrder === 'DESC'
              }" @click="orderByName">Name</th>
              <th scope="col" :class="{
                'bg-primary' : this.strOrderBy === 'studio_name',
                'order-by-asc': this.strOrderBy === 'studio_name' && this.strOrder === 'ASC',
                'order-by-desc': this.strOrderBy === 'studio_name' && this.strOrder === 'DESC'
              }" @click="orderByStudio">Studio</th>
              <th scope="col" :class="{
                'bg-primary': this.strOrderBy === 'author_last_name',
                'order-by-asc': this.strOrderBy === 'author_last_name' && this.strOrder === 'ASC',
                'order-by-desc': this.strOrderBy === 'author_last_name' && this.strOrder === 'DESC'
              }" @click="orderByAuthor">Author</th>
              <th scope="col" :class="{
                'bg-primary': this.strOrderBy === 'year',
                'order-by-asc': this.strOrderBy === 'year' && this.strOrder === 'ASC',
                'order-by-desc': this.strOrderBy === 'year' && this.strOrder === 'DESC'
              }" @click="orderByYear">Year</th>
              <th scope="col" class="text-center" :class="{
                'bg-primary': this.strOrderBy === 'country_id',
                'order-by-asc': this.strOrderBy === 'country_id' && this.strOrder === 'ASC',
                'order-by-desc': this.strOrderBy === 'country_id' && this.strOrder === 'DESC'
              }" @click="orderByCountry">Country</th>
              <th scope="col" class="text-center" :class="{
                'bg-primary': this.strOrderBy === 'is_allowed',
                'order-by-asc': this.strOrderBy === 'is_allowed' && this.strOrder === 'ASC',
                'order-by-desc': this.strOrderBy === 'is_allowed' && this.strOrder === 'DESC'
              }" @click="orderByIsAllowed">Allowed?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="anime in arrAnime" :key="anime.anime_id">
              <td> {{ anime.anime_name }}</td>
              <td> {{ anime.studio_name }}</td>
              <td> {{ anime.author_first_name + ' ' + anime.author_last_name }}</td>
              <td> {{ anime.year }}</td>
              <td class="text-center"> {{ anime.country_flag }}</td>
              <td class="text-center"> {{ anime.is_allowed ? '✅' : '❌' }}</td>
            </tr>
          </tbody>
        </table>
        <Pagination ref="pagination" @pageDown="changeDataSet($event)" @changePage="changeDataSet($event)" @pageUp="changeDataSet($event)" :class="{'d-none': !arrAnime.length || !strSearch.length}"
                    :int-data-per-page="this.intDataPerPage" :int-total-number-of-data="this.intTotalNumberOfAnime" :int-pages-to-display="this.intPagesToDisplay"></Pagination>
        <div class="alert alert-danger" v-if="this.boolAnimeNotFound" role="alert">
          Anime not found!
        </div>
      </div>
      <footer class="position-absolute w-100 bottom-0 text-white fst-italic text-center py-2">(c) Ravenclaw Programming and Hardware Group Corp.</footer>
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
      // URLs to the routes of the backend
      strUrlToGetAnime: 'http://localhost:3000/anime/getanime',
      strUrlToGetTotalNumberOfAnime: 'http://localhost:3000/anime/gettotalnumberofanime',
      strUrlToGetTotalNumberOfAnimeInDatabase: 'http://localhost:3000/anime/gettotalnumberofanimeindatabase',
      // Data array
      arrAnime: [],
      // Pagination
      intDataSet: 0,
      intDataPerPage: 10,
      intTotalNumberOfAnime: 0,
      intPagesToDisplay: 5,
      // Ordering
      strOrderBy: 'anime_id',
      strOrder: 'ASC',
      intOrderCounter: 0,
      // Search criterions
      strSearch: '',
      strAnimeSearch: '',
      // Error vars
      boolAnimeNotFound: false,
      boolFatalError: false,
      // Misc
      intTotalNumberOfAnimeInDatabase: 0
    }
  },
  methods: {
    /**
     *  Gets the total number of anime and returns a promise with the result.
     */
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
        this.boolFatalError = true
      })
    },
    /**
     *  Gets the total number of anime stored in the database.
     */
    getTotalNumberOfAnimeInDatabase () {
      this.$http.get(
        this.strUrlToGetTotalNumberOfAnimeInDatabase
      ).then(res => {
        this.intTotalNumberOfAnimeInDatabase = res.data.data[0].total_number_of_anime_in_database
      }).catch(err => {
        console.error(err)
        this.boolFatalError = true
      })
    },
    /**
     *  Gets an anime by posting the following data to the backend:
     *
     *  intDataSet: The dataset of the pagination
     *  intDataLimit: The datalimit of the shown data per page
     *  strOrder: The sort column of the data
     *  strOrderBy: The sort direction of the data (ASC or DESC)
     *  strSearch: The search criterion to get a specific anime
     *
     */
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
          this.boolAnimeNotFound = false
          this.arrAnime = res.data.data
          const pagination: any = this.$refs.pagination
          pagination.calculatePages()
          pagination.checkDeactivationLogic()
          if (!this.arrAnime.length) {
            this.boolAnimeNotFound = true
          }
        }).catch(err => {
          console.error(err)
          this.boolFatalError = true
        })
      })
    },
    /**
     *  Changes the sort order to the anime name.
     */
    orderByName () {
      this.strOrderBy = 'anime_name'
      this.changeOrder()
    },
    /**
     *  Changes the sort order to the studio name.
     */
    orderByStudio () {
      this.strOrderBy = 'studio_name'
      this.changeOrder()
    },
    /**
     *  Changes the sort order to the author's last name.
     */
    orderByAuthor () {
      this.strOrderBy = 'author_last_name'
      this.changeOrder()
    },
    /**
     *  Changes the sort order to the release year.
     */
    orderByYear () {
      this.strOrderBy = 'year'
      this.changeOrder()
    },
    /**
     *  Changes the sort order to the country.
     */
    orderByCountry () {
      this.strOrderBy = 'country_id'
      this.changeOrder()
    },
    /**
     *  Changes the sort order to the allowance.
     */
    orderByIsAllowed () {
      this.strOrderBy = 'is_allowed'
      this.changeOrder()
    },
    /**
     *  Changes the sort order to ASC or DESC or the default sorting.
     */
    changeOrder () {
      this.intOrderCounter++
      if (this.intOrderCounter === 1) {
        this.strOrder = 'ASC'
        this.getAnime()
      } else if (this.intOrderCounter === 2) {
        this.strOrder = 'DESC'
        this.getAnime()
      } else {
        this.strOrder = 'ASC'
        this.strOrderBy = 'anime_id'
        this.intOrderCounter = 0
        this.getAnime()
      }
    },
    /**
     *  Changes the current dataset for the pagination.
     *
     * @param intADataSet The dataset as a number.
     */
    changeDataSet (intADataSet: number) {
      this.intDataSet = intADataSet
      this.getAnime()
    }
  },
  beforeMount () {
    this.getTotalNumberOfAnimeInDatabase()
  }
})
</script>

<style lang="scss" scoped>
  .calibri-light {
    font-family: "Calibri Light", sans-serif;
  }
  th:hover {
    background-color: #0d6efd;
    color: white;
    cursor: pointer;
  }
  .order-by-asc {
    color: white;
  }
  .order-by-asc::after {
    content: ' ⬆️';
  }
  .order-by-desc {
    color: white;
  }
  .order-by-desc::after {
    content: ' ⬇️';
  }
  .text-red {
    color: red;
  }
</style>
