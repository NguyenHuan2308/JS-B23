const showError = (elementId, message) => {
  const errorDiv = document.querySelector(`#${elementId}`);
  if (errorDiv) {
    errorDiv.innerHTML = message;
    errorDiv.classList.remove('d-none');
    errorDiv.classList.add('d-block');
  }
};

const hideError = (elementId) => {
  const errorDiv = document.querySelector(`#${elementId}`);
  if (errorDiv) {
    errorDiv.innerHTML = '';
    errorDiv.classList.remove('d-block');
    errorDiv.classList.add('d-none');
  }
};

export const validateId = (id, elementId, message) => {
  if (!id.trim()) {
    showError(elementId, message);
    return false;
  }
  hideError(elementId);
  return true;
}

export const validateName = (name, elementId, message) => {
  if (!name.trim()) {
    showError(elementId, message);
    return false;
  }
  hideError(elementId);
  return true;
}

export const validatePrice = (price, elementId, message) => {
  if (!Number(price)) {
    showError(elementId, message);
    return false;
  }
  hideError(elementId);
  return true;
}

export const validateType = (type, elementId, message) => {
  if (!type.trim()) {
    showError(elementId, message);
    return false;
  }
  hideError(elementId);
  return true;
}

export const validateDesc = (desc, elementId, message) => {
  if (!desc.trim()) {
    showError(elementId, message);
    return false;
  }
  hideError(elementId);
  return true;
}

export const validateImg = (img, elementId, message) => {
  if (!img.trim()) {
    showError(elementId, message);
    return false;
  }
  hideError(elementId);
  return true;
}

