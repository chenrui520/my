import request from '@/utils/request'

export function bingBg(params: string) {
  return request({
    url: 'https://cn.bing.com/api/bing',
    method: 'get',
    params
  })
}

