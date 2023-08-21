// Redux 要求我们通过创建数据副本和更新数据副本，来实现不可变地写入所有状态更新。
// 不过 Redux Toolkit createSlice 和 createReducer 在内部使用 Immer 允许我们编写“可变”的更新逻辑，变成正确的不可变更新。
import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    value: false,
  },
  reducers: {
    openLoading: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它并不是真正的改变状态值，
      // 因为它使用了 Immer 库可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的不可变的状态
      state.value = true;
    },
    closeLoading: state => {
      state.value = false;
    },
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { openLoading, closeLoading } = loadingSlice.actions

export default loadingSlice.reducer

