import { getList, UpdateProduct } from "../../services/callAPIs.js";

let productList = [];

const renderProducts = () => {
  let ele = document.querySelector('#tableProduct');
  let content = productList.map((item, index) => {
    return (`
        <tr class="text-center align-middle">
        <th class="fw-bold">${index + 1}</th>
        <td style="width: 80px;">
          <img src="${item.img}" alt="${item.name}" class="img-fluid rounded" style="max-height: 60px; object-fit: contain;">
        </td>
        <td class="fw-semibold">${item.name}</td>
        <td class="text-start small text-truncate" style="max-width: 200px;">${item.description || 'Không có mô tả'}</td>
        <td class="text-danger fw-bold">${Number(item.price).toLocaleString('vi-VN')}đ</td>
        <td><span class="badge bg-secondary">${item.type}</span></td>
        <td>
          ${item.deleted
        ? '<span class="badge bg-danger">Đã xóa</span>'
        : '<span class="badge bg-success">Hoạt động</span>'}
        </td>
        <td>
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-sm btn-warning text-white" data-bs-toggle="modal" data-bs-target="#productDetailModal" onclick="handleShowProduct('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn btn-sm btn-danger" title="Xóa"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
      `);
  }).join('');

  ele.innerHTML = content;
}

let currentProduct = null;

const handleShowProduct = (id) => {
  const product = productList.find((item) => item.id === id);
  if (!product) return;

  currentProduct = product;

  document.querySelector('#modalProductName').value = product.name;
  document.querySelector('#modalProductImg').src = product.img;
  document.querySelector('#modalProductPrice').value = product.price;
  document.querySelector('#modalProductType').value = product.type || 'Chưa phân loại';
  document.querySelector('#modalProductDesc').value = product.description || 'Không có mô tả';

  const element = document.querySelector('#modalProductDeleted');
  element.value = product.deleted ? "0" : "1";
};

const handleUpdateProduct = async () => {

  const name = document.querySelector('#modalProductName').value;
  const price = document.querySelector('#modalProductPrice').value;
  const type = document.querySelector('#modalProductType').value;
  const desc = document.querySelector('#modalProductDesc').value;
  const deleted = document.querySelector('#modalProductDeleted').value == "1" ? false : true;

  const dataProduct = {
    id: currentProduct.id,
    name: name,
    price: price,
    img: currentProduct.img,
    description: desc,
    type: type,
    deleted: deleted,
  }
  try {
    await UpdateProduct(currentProduct.id, dataProduct);
    getDataAPI();
    document.querySelector('.btn-close').click();
  } catch (error) {
    console.log("Lỗi Update!!", error);
  }
}

document.querySelector('#btnUpdate').addEventListener('click', () => {
  handleUpdateProduct();
})

window.handleShowProduct = handleShowProduct;

const getDataAPI = async () => {
  try {
    const result = await getList();
    productList = result.data;
    renderProducts();
  } catch (error) {
    console.log('Lỗi lấy dữ liệu API', error);
  }
};
getDataAPI();


