import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as state from './state'

Vue.use(Vuex)
// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
})