<script setup>
import { MENU_TYPE } from '@/constants/enum'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const props = defineProps({ menuIndex: String, loading: Boolean })
const emits = defineEmits(['render-wb-news', 'render-db-news', 'render-index-news'])

const onSearch = () => {
  const name = route.name

  ElMessageBox.prompt('请输入搜索关键字', '搜索好物', {
    confirmButtonText: '搜索',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      if (name === 'Home') {
        emits('on-search', value)
      }
      router.replace({ name: 'Home', query: { q: value } })
    })
    .catch(() => {
    })
}

const onSelectMenu = (key, keyPath) => {
  const category = String(key)
  if (category === '0') return
  const name = route.name

  if (name === 'Home') {
    if (category === MENU_TYPE.WEIBO) {
      emits('render-wb-news', category, keyPath)
    }
    else {
      emits('render-db-news', category, keyPath)
    }

    router.replace({ name: 'Home', query: {} })
  }
  else {
    router.push({ name: 'Home', query: { menuIndex: key } })
  }
}
</script>

<template>
  <el-header class="shareContainer__header">
    <el-menu mode="horizontal" :default-active="menuIndex" :ellipsis="false" @select="onSelectMenu">
      <el-menu-item index="0">
        <img src="@/assets/badge.png" class="shareContainer__badge" alt="">
        <span>线报测试站</span>
      </el-menu-item>
      <div class="shareContainer__menu"></div>
      <el-menu-item index="1" :disabled="loading">微博线报</el-menu-item>
      <el-menu-item index="2" :disabled="loading">豆瓣发组</el-menu-item>
      <el-menu-item index="3" :disabled="loading">豆瓣拼组</el-menu-item>
      <el-menu-item index="4" :disabled="loading">豆瓣买组</el-menu-item>
      <el-menu-item index="5" :disabled="loading">豆瓣狗组</el-menu-item>
      <el-icon class="shareContainer__searchIcon" size="20" @click="onSearch">
        <Search />
      </el-icon>
    </el-menu>
  </el-header>
</template>

<style lang="scss" scoped>
.shareContainer {

  &__menu {
    flex-grow: 1;
  }

  &__badge {
    width: 32px;
    margin-right: 8px;
  }

  &__searchIcon {
    margin: auto;
    margin-right: 16px;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}
</style>

<style lang='scss'>
.el-header {
  padding: 0 !important;
}
</style>