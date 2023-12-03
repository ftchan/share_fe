<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/header.vue'
import { getNewsContent } from '@/api/common'
import { useRoute, useRouter } from 'vue-router'

const link = ref('')
const route = useRoute()
const loading = ref(false)

const item = ref({
  title: '',
  time: '',
  originUrl: '',
  content: '',
  comments: []
})


const renderNewsContent = () => {
  loading.value = true
  getNewsContent({ link: link.value })
    .then(res => {
      item.value.time = res.data.time
      item.value.title = res.data.title
      item.value.originUrl = res.data.originUrl
      item.value.content = res.data.content
      item.value.comments = res.data.comments
    })
    .catch(err => {

    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  if (route?.query?.link) {
    link.value = route.query.link
    renderNewsContent(link.value)
  }
})
</script>

<template>
  <div class="pageDetailContainer">
    <el-container class="pageDetailContainer__body">
      <Header :menu-index="'0'" :loading="false" />

      <div class="pageDetailContainer__detail" v-loading="loading">
        <el-card class="pageDetailContainer__content">

          <template #header>
            <h2>{{ item.title }}</h2>
          </template>
          <div class="pageDetailContainer__content__time">{{ item.time }}</div>
          <div class="pageDetailContainer__content__text" v-html="item.content"></div>
        </el-card>

        <el-card class="pageDetailContainer__comments">
          <template #header>
            <div class="pageDetailContainer__comments__header">
              <h2>原文评论</h2>
              <el-link :href="item.originUrl" type="primary" target="_blank">{{ item.originUrl }}</el-link>
            </div>
          </template>

          <div v-if="item.comments.length">
            <div v-for="comment in item.comments" :key="comment.uid" class="pageDetailContainer__comments__list">
              <div class="pageDetailContainer__comments__info">
                <span class="pageDetailContainer__comments__author">{{ comment.author }}</span>
                <span class="pageDetailContainer__comments__time">{{ comment.time }}</span>
              </div>
              <div class="pageDetailContainer__comments__content">{{ comment.content }}</div>
              <el-divider />
            </div>
          </div>

          <div v-else>
            <el-empty description="暂无评论" />
          </div>
        </el-card>


      </div>
    </el-container>
  </div>

  <footer class="beian-footer">
    <el-link href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">闽ICP备2022002029号-2</el-link>
  </footer>
</template>

<style lang="scss" scoped>
.beian-footer {
  position: absolute;
  left: 50%;
  z-index: 1;
  transform: translateX(-50%);
  font-size: 12px;
  width: 100%;
  background: #eee;
  text-align: center;
}

.pageDetailContainer {
  ::v-deep .el-card__header {
    padding-left: 0;
    padding-right: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
  }

  &__badge {
    width: 32px;
    margin-right: 8px;
  }

  &__menu {
    flex-grow: 1;
  }

  &__detail {
    background: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__footer {
    width: 60%;
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;

    &__link {
      word-break: break-all;
    }
  }

  &__comments {
    width: 60%;
    background: #fff;
    margin: 20px 0 0 0;
    padding: 20px;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__list {
      margin-bottom: 16px;
    }

    &__info {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
    }

    &__author {
      margin-right: 8px;
      color: #999999;
      font-size: 14px;
    }

    &__time {
      color: #999999;
      font-size: 14px;
    }
  }

  &__content {
    width: 60%;
    background: #fff;
    margin: 20px 0 0 0;
    padding: 20px;
    min-height: calc(100vh - 150px);

    &__time {
      margin: 6px 0 6px 0;
      color: #999999;
    }

    &__text ::v-deep {
      margin-top: 20px;


      .share-images {
        width: 50%;
      }

      .divide {
        padding: 6px 0 6px 0;
      }

      p {
        text-align: left;
        padding: 12px 0 12px 0;
      }

      .guanlian {
        width: 90%;
        margin: 20px 0 20px 0;
        padding: 12px 15px 15px;
        font-size: 14px;
        color: #888;
        line-height: 22px;
        border: 1px solid rgba(68, 68, 68, .1);
        background: rgba(143, 143, 143, .1);
        border-radius: 3px;
        overflow: hidden;
      }
    }
  }
}
</style>