import { createAction, createReducer, current, nanoid } from '@reduxjs/toolkit'
import { initialPostList } from 'constants/blog'
import { Post } from 'types/blog.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}
const initalState: BlogState = {
  postList: initialPostList,
  editingPost: null
}

export const addPost = createAction('blog/addPost', function (post: Omit<Post, 'id'>) {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  }
})
export const deletePost = createAction<string>('blog/deletePost')
export const startEditingPost = createAction<string>('blog/startEditingPost')
export const cancelEditingPost = createAction('blog/cancelEditingPost')
export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

const blogReducer = createReducer(initalState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      // immerjs giúp chúng ta mutate 1 state an toàn
      const post = action.payload
      state.postList.push(post)
    })
    .addCase(deletePost, (state, action) => {
      console.log('start', current(state))
      const postId = action.payload
      const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
      console.log('finish', current(state))
    })
    .addCase(startEditingPost, (state, action) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
      const postId = action.payload.id
      // Phương thức some() được sử dụng để kiểm tra xem có phần tử nào trong
      //mảng thỏa mãn một điều kiện nào đó hay không.
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    })
    .addMatcher(
      (action) => action.type.includes('cancel'),
      (state, action) => {
        console.log(current(state))
      }
    )
})

// const blogReducer = createReducer(initalState, {
//   [addPost.type]: (state : any, action: PayloadAction<Post>) => {
//     const post = action.payload
//     state.postList.push(post)
//   },
//   [deletePost.type]: (state : any, action: any) => {
//     console.log('start', current(state))
//     const postId = action.payload
//     const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
//     if (foundPostIndex !== -1) {
//       state.postList.splice(foundPostIndex, 1)
//     }
//     console.log('finish', current(state))
//   },
//   [startEditingPost.type]: (state: any, action: any) => {
//     const postId = action.payload
//     const foundPost = state.postList.find((post) => post.id === postId) || null
//     state.editingPost = foundPost
//   },
//   [cancelEditingPost.type]: (state: any) => {
//     state.editingPost = null
//   },
//   [finishEditingPost.type]: (state: any, action: PayloadAction<Post>) => {
//     const postId = action.payload.id
//     state.postList.some((post, index) => {
//       if (post.id === postId) {
//         state.postList[index] = action.payload
//         return true
//       }
//       return false
//     })
//     state.editingPost = null
//   }
// })

export default blogReducer
