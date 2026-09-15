
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
    data: product
  })
}

export let AddProduct = (product) => {
  return axios({
    method: 'POST',
    url: `https://svcy.myclass.vn/api/ProductApi/create`,
    data: product
  })
}

export let DeleteProduct = (id, product) => {
  return axios({
    method: 'DELETE',
    url: `https://svcy.myclass.vn/api/ProductApi/delete/${id}`,
    data: product
  })
}



