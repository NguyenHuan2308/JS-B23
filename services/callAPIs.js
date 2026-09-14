
export let getList = () => {
  return axios({
    method: 'GET',
    url: 'https://svcy.myclass.vn/api/ProductApi/getall'
  })
}

export let UpdateProduct = (id, product) => {
  return axios({
    method: 'PUT',
    url: `https://svcy.myclass.vn/api/ProductApi/update/${id}`,
    data:product
  })
}

