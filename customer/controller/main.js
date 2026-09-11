import { getList } from "./callAPIs.js";

let productList = [];

const handleShowDetail = (id) => {

  const product = productList.find((item) => item.id === id);
  console.log(product);

  if (!product) return;

  // Điền dữ liệu sản phẩm tương ứng vào Modal
  document.getElementById('modalProductName').innerText = product.name;
  document.getElementById('modalProductImg').src = product.img;
  document.getElementById('modalProductPrice').innerText = `${Number(product.price).toLocaleString('vi-VN')}đ`;
  document.getElementById('modalProductType').innerText = product.type;
  document.getElementById('modalProductDesc').innerText = product.description;
  const element = document.getElementById('modalProductDeleted');
  if (product.deleted) {
    element.innerHTML = "Hết hàng";
    element.classList.add('text-danger');
  } else {
    element.innerHTML = "Còn hàng";
    element.classList.add('text-success');
  }
};

// Gán hàm ra window
window.showDetail = handleShowDetail;

const renderProducts = (products) => {
  const content = products.map((product) =>
    `<div class="col-12 col-md-4">
          <div class="card">
            <img src="${product.img}" class="card-img-top productImg" alt="">
            <div class="card-body">
              <h3 class="card-title mt-2 productName">${product.name}</h3>
              <h4 class="card-subtitle mb-3 productPrice">${Number(product.price).toLocaleString('vi-VN')}đ</h4>
              <div class="d-flex justify-content-between">
              <a href="#" class="btn btn-outline-secondary btnAddToCart" data-bs-toggle="modal" data-bs-target="#productDetailModal" onclick="showDetail('${product.id}')">Xem chi tiết</a>
                <a href="#" class="btn btn-outline-primary btnAddToCart">Thêm vào giỏ hàng</a>
              </div>
            </div>
          </div>
    </div>`
  ).join("");
  document.querySelector('#productList').innerHTML = content;
}


const init = async () => {
  try {
    const result = await getList();
    renderProducts(result.data);
    productList = result.data;
  } catch (error) {
    console.log('Lỗi lấy dữ liệu API', error);
  }
}

init();