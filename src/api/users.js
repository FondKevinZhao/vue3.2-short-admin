import request from './request'

/**
 *
 * @param {*} params
 * @returns
 * 获取数据的接口
 */
export const getUser = (params) => {
  return request({
    url: '/users',
    params
  })
}

/**
 * 改变状态的接口
 */
export const changeUserState = (uid, type) => {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

/**
 * 添加用户接口
 */
export const addUser = (data) => {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

/**
 * 编辑用户接口，这个接口的内容没有实现
 */
export const editUser = (data) => {
  return request({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户接口
 */
export const deleteUser = (id) => {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}
