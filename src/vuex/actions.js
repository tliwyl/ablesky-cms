// 组件分发 import { mapActions } from 'vuex'
// ...mapActions({
//     add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
//   })



export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}
