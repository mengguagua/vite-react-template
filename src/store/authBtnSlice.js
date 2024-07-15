// Redux 要求我们通过创建数据副本和更新数据副本，来实现不可变地写入所有状态更新。
// 不过 Redux Toolkit createSlice 和 createReducer 在内部使用 Immer 允许我们编写“可变”的更新逻辑，变成正确的不可变更新。
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import {buttonList} from '../service/interface';

// 调用远程接口，返回Promise,async默认返回Promise。在需要使用的组件里触发。如这个组件/src/pages/carTeam/index.jsx
export const fetchAuthBtn = createAsyncThunk('uct/buttonList', async () => {
  const resp = await buttonList()
  // debugger;
  return resp;
})

// 创建切片，name用于组件通过useSelector获取state
export const authBtnSlice = createSlice({
  name: 'authBtn',
  // state数据，可以通过extraReducers远程赋值。也可以通过reducers，会自带生成action，修改state
  initialState: {
    btnCodeList: [],
    status: 'idle',
  },
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuthBtn.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchAuthBtn.fulfilled, (state, action) => {
        let btnCodeList = []
        // debugger
        action.payload?.data.forEach((item) => {
          btnCodeList.push(item.code);
        });
        state.btnCodeList = btnCodeList;
        state.status = 'idle'
      })
  }

})


export default authBtnSlice.reducer

