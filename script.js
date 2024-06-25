const apiUrl = "https://fakestoreapi.com/products"; // Replace with your API URL
let currentPage = 1;
let productsPerPage = 4;
let sortOption = "asc";
let category = null;
let searchQueryString = "";

const fetchProducts = (page = 1, sort = "asc", category = null) => {
  renderLoader(true);
  let url = `${apiUrl}?page=${page}&limit=${productsPerPage}&sort=${sort}&search=${searchQueryString}`;
  if (category !== null) {
    url = `${apiUrl}/category/${category}?sort=${sort}&search=${searchQueryString}`;
  }
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderLoader(false);
      displayProducts(data);
      setupPagination(data.length);
    })
    .catch((e) => {
      renderLoader(false);
      displayProducts([]);
    });
};

const displayProducts = (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  if (products && products.length > 0) {
    products.forEach((product) => {
      const productElement = document.createElement("article");
      productElement.classList.add("product");
      productElement.innerHTML = `
                  <img src="${product.image}" width="312px" height="382px" alt="${product.title}">
                  <h2>${product.title}</h2>
                  <p>$${product.price}</p>
                  <button>Add to Cart</button>
              `;
      productList.appendChild(productElement);
    });
  } else {
    productList.innerHTML = `<h1>No Data Found</h1>`;
  }
};

const renderLoader = (displayLoader) => {
  const loader = document.getElementsByClassName("loader")[0];
  const productList = document.getElementById("product-list");
  loader.style.display = displayLoader === true ? "block" : "none";
  productList.style.display = displayLoader === true ? "none" : "flex";
};

const setupPagination = (totalPages) => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const pageButton = document.createElement("button");
  pageButton.textContent = "Load More";
  pageButton.style.cursor = "pointer";
  pageButton.addEventListener("click", () => {
    currentPage++;
    productsPerPage = productsPerPage + 3;
    fetchProducts(currentPage, sortOption, category);
  });
  pagination.appendChild(pageButton);
};

document.getElementById("sort").addEventListener("change", (e) => {
  sortOption = e.target.value;
  fetchProducts(currentPage, sortOption, category);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(currentPage, sortOption);
});

const handleCheckbox = (e) => {
  if (e.checked) {
    fetchProducts(0, "asc", e.id);
    category = e.id;
  } else {
    category = null;
    fetchProducts(0, "asc", null);
  }
  Array.from(document.querySelectorAll(".filters input[type='checkbox']"))
    .filter((x) => x.id !== e.id)
    .forEach((x) => (x.checked = false));
};

const toggleMenu = (x) => {
  x.classList.toggle("change");
};

const searchProductsHandler = (e) => {
  searchQueryString = e?.value ?? "";

  // TODO : add a throttle/debouncer to control api calls
  fetchProducts(0, "asc", category);
};
