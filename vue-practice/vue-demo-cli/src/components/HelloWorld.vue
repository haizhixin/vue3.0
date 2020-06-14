<template>
  <div>
    <div class="hello">{{state.text}}</div>
    <div class="my-list">
      <input type="text" v-model="state.newTodo" @click="addTodo" name id />
      <ul>
        <li v-for="(item,index) in state.todos" :key="index">{{item.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
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
    function addTodo() {
      state.todos.push({
        id: Math.random(),
        title: state.newTodo,
        completed: false
      });
    }

    return { state, addTodo };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.my-list {
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
