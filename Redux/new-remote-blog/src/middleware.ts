import { AnyAction, Middleware, MiddlewareAPI, isRejected, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  /**
   * 'isRejectedWithValue' là một function giúp chúng ta kiểm tra những action có
   * rejectedWithValue = true từ createAsyncThunk
   * RTK Query sử dụng createAsyncThunk bên trong nên chúng ta có thể dùng 'isRejectedWithValue' để
   * kiểm tra lỗi
   */
  /**
   * Trong thực tế không cần check isRejected
   */
  if (isRejected(action)) {
    console.log(action)
    if (action.error.name === 'CustomError') {
      // Đây là những lỗi liên quan đến quá trình thực thi ngoại trừ 422
      toast.error(action.error.message)
    }
  }
  if (isRejectedWithValue(action)) {
    /**
     * Mỗi khi thực hiện query hoặc mutation mà bị lỗi thì nó sẽ chạy vào đây
     * Những lỗi từ SERVER thì action nó mới có RejectedWithValue = true
     * Còn những action liên quan đến việc caching mà bị rejected thì RejectedWithValue = false,
     * nên đừng lo lắng trường hợp này sẽ ko bắt vào đây được
     */
    if (isPayloadErrorMessage(action.payload)) {
      // Hiển thị lỗi reject từ server chỉ có messsage
      toast.error(action.payload.data.error)
    }
  }
  //console.log(action)

  return next(action)
}
