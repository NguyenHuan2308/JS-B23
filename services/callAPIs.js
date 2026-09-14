
export let getList = () => {
  return axios({
    method: 'GET',
    url: 'https://svcy.myclass.vn/api/ProductApi/getall'
  })
}