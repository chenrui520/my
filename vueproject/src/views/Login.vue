<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import { bingBg } from '@/api/api.ts'

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  // 所有的组件选项都可以放在这里
  components: {
    HelloWorld
  }
})
export default class App extends Vue {
  // initial data
  msg = 12

  // use prop values for initial data
  helloMsg = 'Hello, '

  // lifecycle hook
  mounted () {
    this.greet(1)
  }

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet (num: number) {
    console.log('greeting: ' + num)
  }

  bgAxios () {
    console.log('背景图片')
  }
}
</script>
