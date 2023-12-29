<script setup>
import dayjs from 'dayjs'
import Header from '@/components/header.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getWBNewsList } from '@/api/wb'
import { getDBNewsList } from '@/api/db'
import { getNewsContent } from '@/api/common'
import { ElNotification } from 'element-plus'
import { MENU_TYPE } from '@/constants/enum'

const block = '🔒'
const router = useRouter()
const route = useRoute()

let currentPage = ref(1)
let pageTotal = ref(0)
let menuIndex = ref('1')
let listRow = ref([])
let loading = ref(true)

/**
 * 获取豆瓣分页列表
 * @param { string | number } category 豆瓣分类
 * @param { number } page 分页页数
 */
const renderDBNewsList = (category, page) => {
  loading.value = true
  listRow.value = []

  getDBNewsList({ page: page, category, pageSize: 50 })
    .then(res => {
      if (res.data) {
        const { pagination, data } = res.data
        currentPage.value = pagination.currentPage - 0
        pageTotal.value = pagination.lastPage
        listRow.value = data
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * 获取微博线报列表
 * @param { number } page 
 */
const renderWBNewsList = (page) => {
  loading.value = true
  listRow.value = []

  getWBNewsList({ page: page })
    .then(res => {
      if (res.data) {
        const { pagination, data } = res.data
        currentPage.value = pagination.currentPage - 0
        pageTotal.value = pagination.lastPage
        listRow.value = data
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}


/**
 * 获取菜单列表
 * @param { number | string } key 
 */
const onSelectMenu = (key) => {
  menuIndex.value = String(key)
  pageTotal.value = 0
  currentPage.value = 1

  if (String(key) === MENU_TYPE.WEIBO) {
    renderWBNewsList(currentPage.value)
  }
  else {
    renderDBNewsList(key, currentPage.value)
  }
}

/**
 * 分页更改
 * @param { number } page 
 */
const onPageChange = (page) => {
  if (page === currentPage.value) return

  if (route.query.q) {
    onSearch(route.query.q, page)
  }
  else if (menuIndex.value === MENU_TYPE.WEIBO) {
    renderWBNewsList(page)
  }
  else {
    renderDBNewsList(menuIndex.value, page)
  }
}

/**
 * 搜索功能
 */
const onSearch = (keyWords, page = 1) => {
  loading.value = true
  listRow.value = []

  getSearchNewsList({ pageSize: page, keyWords })
    .then(res => {
      if (res.data) {
        const { totalPage, pageList } = res.data
        currentPage.value = page
        pageTotal.value = totalPage
        listRow.value = pageList
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * 查看详情
 * @param { Object } goods 商品详情
 */
const onViewDetail = (goods) => {
  router.push({
    name: 'Detail',
    query: {
      id: goods.id,
      title: goods.title
    }
  })
}

onMounted(() => {
  listRow.value = []
  const query = route.query

  if (query.q) {
    menuIndex.value = '0'
    onSearch(query.q, currentPage.value)
  }
  else {
    menuIndex.value = String(query.menuIndex || '1')
    router.replace({ query: {} })
    onSelectMenu(menuIndex.value)
  }
})
</script>

<template>
  <div class="shareContainer">
    <el-container class="shareContainer__container">

      <Header :loading="loading" :menu-index="menuIndex" @render-db-news="onSelectMenu" @render-wb-news="onSelectMenu"
        @render-index-news="onSelectMenu" @on-search="onSearch" />

      <el-main class="shareContainer__list" v-loading="loading" element-loading-text="加载中...">
        <div class="shareContainer__list__item" v-for="(goods, index) in listRow" :key="index">
          <div class="shareContainer__list__content">
            <div>
              <img v-if="goods.source === 'wb'" src="@/assets/informationSource/wb.png" alt=""
                class="shareContainer__list__content__badge">
              <img v-if="goods.source === 'db' && goods.category === '2'" src="@/assets/informationSource/dbmai.png"
                alt="" class="shareContainer__list__content__badge">
              <img v-if="goods.source === 'db' && goods.category === '3'" src="@/assets/informationSource/dbpin.png"
                alt="" class="shareContainer__list__content__badge">
              <img v-if="goods.source === 'db' && goods.category === '4'" src="@/assets/informationSource/dbfa.png" alt=""
                class="shareContainer__list__content__badge">
              <img v-if="goods.source === 'db' && goods.category === '5'" src="@/assets/informationSource/dbdog.png" alt=""
                class="shareContainer__list__content__badge">
              <el-link @click="onViewDetail(goods)">{{ goods.title }}</el-link>
            </div>

            <div class="shareContainer__list__content__info">
              <el-tag class="shareContainer__list__content__comment" type="danger">{{ goods.comments }} 评论</el-tag>
              <el-text type="danger" class="shareContainer__list__content__time">{{
                dayjs(goods.catch_date).format('YYYY-MM-DD HH:mm:ss') }}</el-text>
            </div>

          </div>
          <el-divider border-style="dashed"></el-divider>
        </div>
      </el-main>

      <el-footer class="shareContainer__footer">
        <el-pagination :disabled="loading" background layout="prev, pager, next" :page-count="pageTotal"
          @current-change="onPageChange" />
      </el-footer>
    </el-container>

    <footer class="beian-footer">
      <el-link href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">闽ICP备2022002029号-2</el-link>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.shareContainer {
  width: 100%;
  height: 100%;
  background: #eee;

  .beian-footer {
    position: absolute;
    left: 50%;
    bottom: 5px;
    transform: translateX(-50%);
    font-size: 12px;
  }

  ::v-deep .el-divider--horizontal {
    margin-bottom: 8px;
    margin-top: 8px;
  }

  &__container {
    background: #eee;
    padding-bottom: 20px;

    &__searchIcon {
      margin: auto;
      margin-right: 16px;
      cursor: pointer;

      &:hover {
        color: #409eff;
      }
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__list {
    width: 95%;
    margin: 0 auto;
    margin-top: 16px;
    background: #fff;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 160px);
    overflow-y: scroll;

    &__content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__comment {
        margin-right: 8px;
      }

      &__time {
        white-space: nowrap;
      }

      &__info {
        display: flex;
        align-items: center;
      }

      &__badge {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        margin-right: 8px;
      }
    }
  }
}
</style>
