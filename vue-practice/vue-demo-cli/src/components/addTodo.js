export default function(state) {
    function addTodo() {
        state.todos.push({
          id: Math.random(),
          title: state.newTodo,
          completed: false
        });
      }
    return {addTodo}
}