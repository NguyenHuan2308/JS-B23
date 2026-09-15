import { getList } from "../../services/callAPIs.js";

let productList = [];
let cartList = [];
let typeProduct = [];

const getCart = () => {
  const data = localStorage.getItem('cart');
  if (data) {
    cartList = JSON.parse(data);
  }
}

const setCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartList));
}

let currentPro = null;

const handleShowDetail = (id) => {
  const product = productList.find((item) => item.id === id);
  if (!product) return;

  currentPro = product;

  document.getElementById('modalProductName').innerText = product.name;
  document.getElementById('modalProductImg').src = product.img;
  document.getElementById('modalProductPrice').innerText = `${Number(product.price).toLocaleString('vi-VN')}đ`;
  document.getElementById('modalProductType').innerText = product.type || 'Chưa phân loại';
  document.getElementById('modalProductDesc').innerText = product.description || 'Không có mô tả';

  const element = document.getElementById('modalProductDeleted');
  if (product.deleted) {
    element.innerText = "Hết hàng";
    element.className = 'fw-medium text-danger';
  } else {
    element.innerText = "Còn hàng";
    element.className = 'fw-medium text-success';
  }
};

const addToCart = (id) => {
  const product = productList.find((item) => item.id === id);
  if (!product) return;


  const existItem = cartList.find((item) => item.product.id === id);

  if (existItem) {
    existItem.quantity += 1;
  } else {
    cartList.push({ product: product, quantity: 1 });
  }
  showAlert('Thêm vào giỏ hàng thành công!');
  setCart();
  renderCart();
};

document.querySelector('#addInModal').addEventListener('click', () => {
  addToCart(currentPro.id);
  document.querySelector('#productDetailModal btn-close').click();
});



const changeQuantity = (id, amount) => {
  const item = cartList.find((item) => item.product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  setCart();
  renderCart();
};

const removeFromCart = (id) => {
  cartList = cartList.filter((item) => item.product.id !== id);
  setCart();
  renderCart();
};

// Render cart
const renderCart = () => {
  const cartBody = document.querySelector("#cartBody");
  if (!cartBody) return;

  if (cartList.length === 0) {
    cartBody.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="fa-solid fa-cart-flatbed fs-1 mb-3 opacity-50"></i>
        <p class="mb-0">Giỏ hàng của bạn đang trống</p>
      </div>`;

    const totalPriceEl = document.getElementById("cartTotalPrice");
    if (totalPriceEl) totalPriceEl.innerText = "0đ";
    return;
  }

  let totalPrice = 0;
  const content = cartList.map((item) => {
    const itemTotal = Number(item.product.price) * item.quantity;
    totalPrice += itemTotal;

    return `
      <div class="card mb-3 border-0 shadow-sm">
        <div class="card-body p-2">
          <div class="row align-items-center g-2">
            <!-- ẢNH -->
            <div class="col-3 text-center">
              <img src="${item.product.img}" class="img-fluid rounded" style=" object-fit: contain;" alt="${item.product.name}">
            </div>
            

            <!-- THÔNG TIN & TĂNG GIẢM -->
            <div class="col-8">
              <h6 class="mb-2 fw-bold" title="${item.product.name}">${item.product.name}</h6>
              <div class='text-center'>
                <div class="text-danger fw-bold small mb-2">${Number(item.product.price).toLocaleString('vi-VN')}đ</div>
                
                <!-- Nút tăng giảm số lượng -->
                <div class="d-inline-flex align-items-center border rounded">
                  <button class="btn btn-sm btn-light border-0 px-2 py-0" onclick="changeQuantity('${item.product.id}', -1)">-</button>
                  <span class="px-2 small fw-bold">${item.quantity}</span>
                  <button class="btn btn-sm btn-light border-0 px-2 py-0" onclick="changeQuantity('${item.product.id}', 1)">+</button>
                </div>
              </div>
              <div class="mt-3 d-flex justify-content-between"><span class='text-dark px-2'>Thành tiền:</span> <span class="fw-bold small text-primary">${itemTotal.toLocaleString('vi-VN')}đ</span></div>
            </div>

            <!-- THAO TÁC XÓA -->
            <div class="col-1 text-end">
              <button class="btn btn-sm text-muted p-0 mb-2" onclick="removeFromCart('${item.product.id}')">
                <i class="fa-solid fa-trash-can text-danger"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  cartBody.innerHTML = content;

  const totalPriceEl = document.getElementById("cartTotalPrice");
  if (totalPriceEl) totalPriceEl.innerText = `${totalPrice.toLocaleString('vi-VN')}đ`;
};

// Hủy giỏ hàng
const clearCart = () => {
  if (cartList.length == 0) {
    showAlert("Giỏ hàng hiện tại đã trống!", 'danger');
    return;
  }
  cartList = [];
  showAlert("Xóa giỏ hàng thành công!", 'warning');
  setCart();
  renderCart();
}

// Thanh toán
const purchaseCart = () => {
  if (cartList.length == 0) {
    showAlert("Giỏ hàng hiện tại đang trống! Không thể thanh toán", 'danger');
    return;
  }
  cartList = [];
  showAlert("Thanh toán thành công!", 'success');
  setCart();
  renderCart();
  const offcanvasEl = document.getElementById('myCart');
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
  offcanvasInstance.hide();
}

// Render sp ra UI
const renderProducts = (products) => {
  const content = products.map((product) =>
    `<div class="col-12 col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="${product.img}" class="card-img-top productImg" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h3 class="card-title mt-2 productName" title="${product.name}">${product.name}</h3>
          <h4 class="card-subtitle mb-3 productPrice">${Number(product.price).toLocaleString('vi-VN')}đ</h4>
          <div class="mt-auto d-flex justify-content-between gap-2">
            <button class="btn btn-outline-secondary btn-sm flex-grow-1" data-bs-toggle="modal" data-bs-target="#productDetailModal" onclick="showDetail('${product.id}')">Xem chi tiết</button>
            <button class="btn btn-outline-primary btn-sm flex-grow-1" onclick="addToCart('${product.id}')">Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>`
  ).join("");

  document.querySelector('#productList').innerHTML = content;
};

// Lấy type Product
const getTypeProduct = () => {
  typeProduct = [];
  const typeLower = productList.map(item => {
    return item.type.toLowerCase();
  });

  typeLower.forEach(item => {
    const formatType = item.charAt(0).toUpperCase() + item.slice(1);
    if (!typeProduct.includes(formatType)) {
      typeProduct.push(formatType);
    }
  })
}

// Hiện thị các Type
const renderType = () => {
  const ele = document.querySelector('#dropdownType');
  if (!ele) return;
  let content = `<option selected value="">Chọn Loại</option>`;
  typeProduct.forEach(item => {
    content += `<option value="${item}">${item}</option>`;
  });
  ele.innerHTML = content;
}

// Hàm lọc theo name và type
const filterProducts = () => {
  const keyword = document.querySelector('#searchName').value.trim().toLowerCase();
  const selectedType = document.querySelector('#dropdownType').value.toLowerCase();

  const filterList = productList.filter(product => {
    const productName = product.name.toLowerCase();
    const productType = product.type.toLowerCase();

    const matchesName = productName.includes(keyword);
    const matchesType = selectedType == "" || productType == selectedType;
    return matchesName && matchesType;
  });

  renderProducts(filterList);
}

document.querySelector('#searchName').addEventListener('input', () => {
  filterProducts();
});

document.querySelector('#dropdownType').addEventListener('change', () => {
  filterProducts();
});

window.showDetail = handleShowDetail;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.purchaseCart = purchaseCart;

// Thông báo
let alertTimeout;

const showAlert = (message, type = 'success') => {
  const alertMes = document.getElementById("alert");
  if (!alertMes) return;
  alertMes.innerHTML = message;

  clearTimeout(alertTimeout);

  alertMes.className = `alert alert-${type} position-fixed end-0 mt-5 shadow`;
  alertMes.innerHTML = `${message}`;

  // Tự động ẩn sau 3 giây (3000ms)
  alertTimeout = setTimeout(() => {
    alertMes.classList.add("d-none");
    alertMes.innerHTML = '';
  }, 3000);
};

// KHỞI CHẠY LẤY DỮ LIỆU BẮT ĐẦU
const getDataAPI = async () => {
  try {
    const result = await getList();
    productList = result.data;
    renderProducts(productList);
    renderCart();
    getTypeProduct();
    renderType();
  } catch (error) {
    console.log('Lỗi lấy dữ liệu API', error);
  }
};

getCart();
getDataAPI();