import { getList, UpdateProduct, AddProduct, DeleteProduct } from "../../services/callAPIs.js";
import { validateDesc, validateId, validateImg, validateName, validatePrice, validateType } from "../../validation/validation.js";

let productList = [];

const renderProducts = (products) => {
  let ele = document.querySelector('#tableProduct');
  let content = products.map((item, index) => {
    return (`
        <tr class="text-center align-middle">
        <th class="fw-bold">${index + 1}</th>
        <td style="width: 80px;">
          <img src="${item.img}" alt="${item.name}" class="img-fluid rounded" style="max-height: 60px; object-fit: contain;">
        </td>
        <td class="fw-semibold">${item.name}</td>
        <td class="text-start text-truncate" style="max-width: 200px;" row='2'>${item.description || 'Không có mô tả'}</td>
        <td class="text-danger fw-bold">${Number(item.price).toLocaleString('vi-VN')}đ</td>
        <td><span class="badge bg-success">${item.type}</span></td>
        <td>
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-sm btn-warning text-white" data-bs-toggle="modal" data-bs-target="#productDetailModal" onclick="handleShowProduct('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn btn-sm btn-danger" title="Xóa" onclick="handleDelete('${item.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
      `);
  }).join('');

  ele.innerHTML = content;
}

let currentProduct = null;

// Show
const handleShowProduct = (id) => {
  const product = productList.find((item) => item.id === id);
  if (!product) return;

  console.log(product);


  currentProduct = product;

  document.querySelector('#modalProductName').value = product.name;
  document.querySelector('#modalProductImg').src = product.img;
  document.querySelector('#modalProductImgLink').value = product.img;
  document.querySelector('#modalProductPrice').value = product.price;
  document.querySelector('#modalProductType').value = product.type;
  document.querySelector('#modalProductDesc').value = product.description;
};

// Update
const handleUpdateProduct = async () => {

  const img = document.querySelector('#modalProductImgLink').value;
  const name = document.querySelector('#modalProductName').value;
  const price = document.querySelector('#modalProductPrice').value;
  const type = document.querySelector('#modalProductType').value;
  const desc = document.querySelector('#modalProductDesc').value;


  const checkName = validateName(name, 'modalProductNameValidate', "Tên không được để trống");
  const checkImg = validateImg(img, 'modalProductImgValidate', "Hình ảnh không được để trống!");
  const checkType = validateType(type, 'modalProductTypeValidate', "Thể loại không được để trống!");
  const checkPrice = validatePrice(price, 'modalProductPriceValidate', "Giá phải là số và không được để trống!");
  const checkDesc = validateDesc(desc, 'modalProductDescValidate', "Mô tả không được để trống!");

  const isValid = checkName && checkImg && checkType && checkPrice && checkDesc;

  if (isValid) {
    const dataProduct = {
      id: currentProduct.id,
      name: name,
      price: price,
      img: img,
      description: desc,
      type: type,
    }
    console.log(dataProduct);

    try {
      const res = await UpdateProduct(currentProduct.id, dataProduct);
      getDataAPI();
      document.querySelector('#productDetailModal .btn-close').click();
      showAlert("Cập nhật thành công!!")
    } catch (error) {
      console.log("Lỗi Update!!", error);
    }
    getDataAPI();
  }
}

document.querySelector('#btnUpdate').addEventListener('click', () => {
  handleUpdateProduct();
})

// Tìm kiếm và sắp xếp
const filterProduct = () => {
  const keyword = document.querySelector('#searchName').value.trim().toLowerCase();
  const sortType = document.querySelector('#dropdownType').value;

  let resultList = productList.filter((product) => {
    return product.name.toLowerCase().includes(keyword);
  });

  if (sortType === 'tang') {
    resultList.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortType === 'giam') {
    resultList.sort((a, b) => Number(b.price) - Number(a.price));
  }

  renderProducts(resultList);
}

document.querySelector('#searchName').addEventListener('input', filterProduct);
document.querySelector('#dropdownType').addEventListener('change', filterProduct);

// Hàm show thông báo
let alertTimeout;
const showAlert = (message, type = 'success') => {
  const alertMes = document.getElementById("alert");
  if (!alertMes) return;
  alertMes.innerHTML = message;

  clearTimeout(alertTimeout);

  alertMes.className = `alert alert-${type} position-fixed end-0 mt-5 shadow`;
  alertMes.innerHTML = `${message}`;

  alertTimeout = setTimeout(() => {
    alertMes.classList.add("d-none");
    alertMes.innerHTML = '';
  }, 3000);
};

// Reset form add
function resetModalForm() {
  document.getElementById('addProductID').value = '';
  document.getElementById('addProductName').value = '';
  document.getElementById('addProductImg').value = '';
  document.getElementById('addProductType').value = '';
  document.getElementById('addProductPrice').value = '';
  document.getElementById('addProductDesc').value = '';
}

// Reset form khi thoát ra ngoài form add
const addModalElement = document.getElementById('addProductModal');
addModalElement.addEventListener('hidden.bs.modal', function () {
  resetModalForm();
});

// Add product
const handleAdd = async () => {
  const id = document.querySelector('#addProductID').value;
  const name = document.querySelector('#addProductName').value;
  const price = document.querySelector('#addProductPrice').value;
  const img = document.querySelector('#addProductImg').value;
  const description = document.querySelector('#addProductDesc').value;
  const type = document.querySelector('#addProductType').value;

  const checkId = validateId(id, 'addProductIDValidate', 'Mã sản phẩm không được để trống');
  const checkName = validateName(name, 'addProductNameValidate', "Tên không được để trống");
  const checkImg = validateImg(img, 'addProductImgValidate', "Hình ảnh không được để trống!");
  const checkType = validateType(type, 'addProductTypeValidate', "Thể loại không được để trống!");
  const checkPrice = validatePrice(price, 'addProductPriceValidate', "Giá phải là số và không được để trống!");
  const checkDesc = validateDesc(description, 'addProductDescValidate', "Mô tả không được để trống!");

  const isValid = checkId && checkName && checkImg && checkType && checkPrice && checkDesc;
  
  if (isValid) {
    const data = {
      id: id,
      name: name,
      price: price,
      img: img,
      description: description,
      type: type,
      deleted: false
    }

    try {
      await AddProduct(data);
      await getDataAPI();
      showAlert("Thêm sản phẩm mới thành công");

      resetModalForm();
      const modalEl = document.getElementById('addProductModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();

    } catch (error) {
      console.log("Lỗi Add!!", error);
    }
  }
}

// Hàm xóa sp
const handleDelete = async (id) => {
  const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
  if (!isConfirm) return;
  const productToDelete = productList.find((item) => item.id === id);
  if (!productToDelete) {
    showAlert("Không tìm thấy sản phẩm cần xóa!", "danger");
    return;
  }

  productToDelete.deleted = true;

  try {
    await DeleteProduct(id, productToDelete);
    await getDataAPI();
    console.log(productToDelete);
    showAlert("Xóa sản phẩm thành công!", "success");
  } catch (error) {
    console.log("Lỗi Delete!!", error);
    showAlert("Xóa sản phẩm thất bại!", "danger");
  }
}

document.querySelector('#btnAdd').addEventListener('click', handleAdd);

window.handleDelete = handleDelete;
window.handleShowProduct = handleShowProduct;

const getDataAPI = async () => {
  try {
    const result = await getList();
    productList = result.data;
    renderProducts(result.data);
  } catch (error) {
    console.log('Lỗi lấy dữ liệu API', error);
  }
};
getDataAPI();


