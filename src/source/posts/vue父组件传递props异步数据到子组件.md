---
title: vue传递异步数据
date: 2021/4/27
tags: Vue
categories: Web前端
introduction: vue父组件传递props异步数据到子组件遇到的问题
---

# vue父组件传递props异步数据到子组件遇到的问题
父组件<code>parent.vue</code>

```vue
// asyncData为异步获取的数据，想传递给子组件使用
<template>
 <div>
  父组件
  <child :child-data="asyncData"></child>
 </div>
</template>
 
<script>
 import child from '../demo/children.vue'
 export default {
  data: () => ({
   asyncData: ''
  }),
  components: {
   child
  },
  created () {
  },
  mounted () {
   // setTimeout模拟异步数据
   setTimeout(() => {
    this.asyncData = ' async data'
    console.log('parent 组件结束')
   }, 2000)
  }
 }
</script>
```

## 情况1

子组件<code>child.vue</code>

```vue
<template>
 <div>
  子组件{{childData}}
 </div>
</template>
 
<script>
 export default {
  props: ['childData'],
  data: () => ({
  }),
  created () {
   console.log("子组件created-----   "+this.childData) // 空值
  },
  methods: {
  }
 }
</script>
```

在这种情况下，子组件中<code>html</code>中的<code>{{childData}}</code>值会随着父组件传过来的值而改变，这是**数据的响应式变化**（数据的改变会引起界面变化)，但子组件<code>created</code>函数中是**拿不到父组件异步传过来的数据**的，这是生命周期问题。

## 情况2

子组件<code>child.vue</code>

```vue
<template>
 <div>
  子组件<!--这里很常见的一个问题，就是childData可以获取且没有报错，但是childData.items[0]不行，往往有个疑问为什么前面获取到值，后面获取不到呢？-->
  <p>{{childData.items[0]}}</p>
 </div>
</template>
 
<script>
 export default {
  props: ['childData'],
  data: () => ({
  }),
  created () {
   console.log(this.childData) // 空值
  },
  methods: {
  }
 }
</script>
```

<code>created</code>里面的仍然是空值， 子组件的<code>html</code>中的<code>{{childObject.items[0]}}</code>的值虽然会随着父组件的值而改变，但是过程中会报错。

是因为：**首先传过来的是空，然后再异步刷新值**，也就是开始时候<code>childObject.items[0]</code>等同于<code>''.item[0]</code>这样的操作，
 所以就会报下面的错：

![img](/images/artical-image/9441048-d1a7779ec4be1599)

## 解决办法

+ 使用<code>v-if</code>可以解决报错问题和<code>created</code>为空问题

  父组件<code>parent</code>

  ```vue
  <template>
   <div>
    父组件
    <child :child-object="asyncObject"  v-if="flag"></child>
    <!--没拿到数据前，不渲染子组件，这样子组件created生命周期就能拿到数据了-->
   </div>
  </template>
   
  <script>
  import child from '../demo1/children.vue'
   export default {
    data: () => ({
     asyncObject: '',
     flag:false
    }),
    components: {
     child
    },
    created () {
    },
    mounted () {
     // setTimeout模拟异步数据
     setTimeout(() => {
      this.asyncObject = {'items': [1, 2, 3]}
      this.flag= true
      console.log('parent 结束')
     }, 2000)
    }
   }
  </script>
  ```

  子页面 children

  ```vue
  <template>
   <div>
    子组件
    <p>{{childObject.items[0]}}</p>
   </div>
  </template>
   
  <script>
   export default {
    props: ['childObject'],
    data: () => ({
    }),
    created () {
      console.log("子组件create-----"+JSON.stringify(this.childObject)) //能拿到了
    },
    methods: {
    }
   }
  </script>
  ```

  ![img](../images/artical-image/9441048-47f9515b58d48759)

+ 子组件使用<code>watch</code>来监听父组件改变的<code>prop</code>，使用<code>methods</code>来代替<code>created</code>

  子组件 children

  ```vue
  <template>
   <div>
    <p>{{test}}</p>
   </div>
  </template>
   
  <script>
   export default {
    props: ['childObject'],
    data: () => ({
         test: ''
    }),
     watch: {
       'childObject.items': function (new, old) { // 直接监听childObject.item属性
        this.test = new[0]
        this.updata()
       }
      },
    methods: {
       updata () { // 既然created只会执行一次，但是又想监听改变的值做其他事情的话，只能搬到这里咯
        console.log(this.test)// 1
       }
      }
   }
  </script>
  ```

+ 子组件<code>watch computed data</code> 相结合(麻烦，不推荐)

  子组件children

  ```vue
  <template>
   <div>
     <p>{{test}}</p>
   </div>
  </template>
   
  <script>
   export default {
      props: ['childObject'],
      data: () => ({
       test: ''
      }),
      watch: {
       'childObject.items': function (n, o) {
        this._test = n[0]
       }
      },
   computed: {
      _test: {
       set (value) {
        this.update()
        this.test = value
       },
       get () {
        return this.test
       }
      }
     },
    methods: {
     update () {
        console.log(this.childObject) // {items: [1,2,3]}
       }
    }
   }
  </script>
  ```

+ 使用<code>prop default</code>来解决<code>{{childObject.items[0]}}</code>

  父组件：

  ```vue
  <template>
   <div>
    父组件
    <child :child-object="asyncObject"></child>
   </div>
  </template>
   
  <script>
   import child from  '../demo4/children.vue'
   export default {
    data: () => ({
     asyncObject: undefined // 这里使用null反而报0的错
    }),
    components: {
     child
    },
    created () {
    },
    mounted () {
     // setTimeout模拟异步数据
     setTimeout(() => {
      this.asyncObject = {'items': [1, 2, 3]}
      console.log('parent finish')
     }, 2000)
    }
   }
  </script>
  ```

  子组件：

  ```vue
  <template>
   <div>
    子组件<!--1-->
    <p>{{childObject.items[0]}}</p>
   </div>
  </template>
   
  <script>
   export default {
    props: {
     childObject: {
      type: Object,
      default () {
       return {
        items: ''
       }
      }
     }
    },
    data: () => ({
    }),
    created () {
     console.log(this.childObject) // {item: ''}
    }
   }
  </script>
  ```

