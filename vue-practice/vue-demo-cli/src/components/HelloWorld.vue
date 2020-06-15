<template>
  <div >
    <h1 :class="{pageTop:top>10}">文档已经滑过的位置 {{top}}</h1>
    <div class="hello" >{{text}}</div>
    <div class="my-list">
      <div class="input">
        <input type="text" v-model="newTodo" @keyup.enter="addTodo" name id /><button @click="addTodo" style="margin-left:10px;">添加</button>
      </div>
     
      <ul>
        <li :class="{done:item.completed}" @click="toggle(index)" v-for="(item,index) in todos" :key="index">{{item.title}}</li>
      </ul>
      <span>我的待办事项还剩{{remaining}}</span>
    </div>

  </div>
</template>

<script>
import { reactive, onMounted, toRefs,computed } from "vue";
// 把函数单独拆分出去 达到复用函数的目的
import addTodoFunc from './addTodo';
import useScroll from '../useScroll'
console.log(addTodoFunc)
export default {
  name: "HelloWorld",
  setup() {
    onMounted(() => {
      console.log("onMounted:hello world!");
    });
    const state = reactive({
      text: "vue3.0初体验!",
      newTodo: "",
      todos: [
        { id: "1", title: "学习", completed: true },
        { id: "2", title: "看书", completed: false },
        { id: "3", title: "看电影", completed: false }
      ]
    });
    // function addTodo() {
    //   state.todos.push({
    //     id: Math.random(),
    //     title: state.newTodo,
    //     completed: false
    //   });
    // }
    const {addTodo} = addTodoFunc(state)
    const {top} = useScroll()
    console.log(top,"top")
    function toggle(index) {
      state.todos[index].completed= !state.todos[index].completed
    }
    const remaining = computed(()=>
      state.todos.filter(item=> !item.completed).length
    )
    return { ...toRefs(state), addTodo ,remaining,toggle,top};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.done {
  text-decoration: line-through;
}
.my-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 800px;
  
}
.my-list ul {
  width: 50%;
  margin: 0 auto;
}
.my-list .input {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.my-list .input input {
  flex-grow: 6;
  
}
.my-list .input button {
  flex-grow: 1;
}
h3 {
  margin: 40px 0 0;
}

li {
  margin: 10px 0;
}
a {
  color: #42b983;
}
.pageTop {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
