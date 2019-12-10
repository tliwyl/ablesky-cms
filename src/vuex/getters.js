
export const getCount = state => {
    return state.count
}


// import { mapGetters } from 'vuex'
// 使用对象展开运算符将 getter 混入 computed 对象中
// ...mapGetters([
//     'doneTodosCount',
//     'anotherGetter'  
//   ])