$(document).ready(function () {

  localStorage.removeItem("cart");

  loadProducts();

  // Handling form submission for new product
  $("#frm_new_prod").submit(function (e) {
    e.preventDefault();
    insertProduct();
  });

  // Handling form submission for editing product
  $("#frm_edit_prod").submit(function (e) {
    e.preventDefault();
    editProduct();
  });

  //Editing Product in Database
  $(document).on("click", ".edit-icon", function () {
    let id = $(this).attr("data-id");
    let product = $(this).attr("data-name");
    let desc = $(this).attr("data-desc");
    let image = $(this).attr("data-img");
    let price = $(this).attr("data-price");

    
    $("#product_id").val(id);
    $("#edit_prod_name").val(product);
    $("#edit_prod_desc").val(desc);
    $("#edit_prod_img").val(image);
    $("#edit_prod_price").val(price);

    $("#modal_edit_product").modal("show");
  });


  //Deleting a Product within the DataBase
  $(document).on("click", ".del-icon", function () {
    let id_product = $(this).attr("data-id");

    $.confirm({
      title: 'Are You sure?',
      content: 'Are you sure you want to remove this item from your grocery list? This action cannot be undone.',
      theme: 'supervan', 
      buttons: {
        Yes:  {
          text: "Yes I'm Sure!",
          btnClass: 'btn-blue',
          action: function () { deleteProduct(id_product); }
        },
        No: {
          text: 'Cancel!',
          action: function () {}
        }
      }
    });
  });



  // Deleting a product within the Cart List 
  $(document).on("click", ".delete-product-icon", function () {

    let index = $(this).data("index");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Validate index
    if (index >= 0 && index < cart.length) {
      // Remove the product from the cart
      cart.splice(index, 1);
  
      // Save the updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
  
      // Update the cart table
      
  
      // Show SweetAlert with confirm button
      Swal.fire({
        title: "Product Removed!",
        text: "The product has been successfully removed from your cart.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        timer: 2000,  // Optional: still shows it for 2 seconds before closing
      }).then(() => {
        updateCartTable();
        
      });
    } else {
      // If the index is invalid, show an error message
      Swal.fire({
        title: "Error",
        text: "An error occurred while removing the product.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  });
  




  // View Cart details and adding to cart
  let productPrice = 0;
  let quantity = 1;

  $(document).on("click", ".btn-quick-view", function () {
    let name = $(this).data("name");
    productPrice = $(this).data("price"); // Update productPrice with actual price
    let description = $(this).data("description");
    let image = $(this).data("image");

    // Populate modal with product details
    quantity = 1;
    $("#productName").text(name);
    $("#price").text(productPrice); // Display updated price
    $("#Description").text(description);
    $("#Img").attr("src", image);
    $("#quantity").text(quantity); // Reset quantity input
    updateTotalPrice(); // Ensure total price is updated when modal is opened

    $("#productModal").modal("show");
  });


  //Increment Quantity Button
  $("#increment").click(function () {
    console.log("Increment clicked");
    quantity++;
    updateTotalPrice();
  });

  // Decrement quantity Button
  $("#decrement").click(function () {
    console.log("Decrement clicked");
    if (quantity > 1) {
      quantity--;
      updateTotalPrice();
    }
  });


  // Updating the total Price in the Product View 
  function updateTotalPrice() {
    let totalPrice = productPrice * quantity;
    $("#quantity").text(quantity); 
    $("#totalPrice").text(`$${totalPrice.toFixed(2)}`);
  }


  //Adding Products to the Cart list Tab
  $("#addToCart").click(function () {
    try {
      let Img = $("#Img").attr("src");
      let Desc = $("#Description").text();
      let productName = $("#productName").text();
      let productPrice = parseFloat($("#price").text().replace("$", "").trim()).toFixed(2);
      let productQuantity = parseInt($("#quantity").text(), 10);
      let Total = $("#totalPrice").text();

      let product = {
        img: Img,
        desc: Desc,
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        total: Total,
        listedPrice: "-", // Default until edited
        totalListedPrice: "-", // Default until edited
        difference: "-", // Default until edited
      };

      // Get the existing cart from localStorage, or initialize as empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let productExists = false;
      cart.forEach(function (existingProduct) {
        if (existingProduct.name === product.name) {
          productExists = true;
          return false;
        }
      });

      // If the product doesn't exist in the cart, add it
      if (!productExists) {
        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));

        Swal.fire({
          title: "Success!",
          text: "Product has been added to the cart.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          $("#productModal").modal("hide");
          switchToCartTab();
        });
      } else {
        Swal.fire({
          title: "Product Already in Cart",
          text: "This product is already in your cart.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was a problem adding the product to the cart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error adding product to cart:", error);
    }
  });

  //Swicth to other Tab 
  function switchToCartTab() {
    $("#cart").tab("show");
  }



  // Updating the cart View
  let selectedProductIndex = null; 

  $(document).on("show.bs.tab", "#cart", function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    $("#mytable tbody").empty();

    let html = "";

    cart.forEach(function (product, index) {
      html += `
        <tr>
              <td><input type="checkbox" class="select-product" data-index="${index}"></td>
              <td><img src='${product.img}' width='50px'></td>
              <td>${product.name}</td>
              <td>${product.quantity}</td>
              <td>$${product.price}</td>
              <td class="fw-bold">${product.total}</td>
              <td class="listed-price" data-index="${index}">$${product.listedPrice || "-"}</td>
              <td class="total-listed-price fw-bold" data-index="${index}">$${product.totalListedPrice || "-"}</td>
              <td class="difference" data-index="${index}" style="color: ${parseFloat(product.difference) < 0 ? "red" : "green"}">$${product.difference || "-"}</td>
              <td class="text-center align-items-center">
                <i class="fas fa-edit text-primary edit-price-icon pe-3" data-index="${index}" style="cursor: pointer;"></i>
                <i class="fas fa-trash text-danger delete-product-icon" data-index="${index}" style="cursor: pointer;"></i>
              </td>
          </tr>
      `;
    });

    $("#mytable tbody").html(html);
    updateGrandTotal();
  });

  // Handle "Edit Price" icon click to open the modal
  $(document).on("click", ".edit-price-icon", function () {
    selectedProductIndex = $(this).data("index");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart[selectedProductIndex];
    $("#listedPriceInput").val(product.listedPrice || "");
    $("#editPriceModal").modal("show");
    
  });

  // Save Listed Price and Update Table
  $("#saveListedPrice").click(function () {
    let listedPrice = parseFloat($("#listedPriceInput").val());
  
    if (isNaN(listedPrice) || listedPrice <= 0) {
      Swal.fire("Invalid Input", "Please enter a valid listed price.", "error");
      return;
    }
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart[selectedProductIndex];
  
    let totalListedPrice = listedPrice * (product.quantity || 1); // Ensure quantity is valid
    let estimatedTotal = parseFloat(product.total.replace("$", "").trim()) || 0;
    let difference = estimatedTotal - totalListedPrice;
  
    product.listedPrice = listedPrice.toFixed(2);
    product.totalListedPrice = totalListedPrice.toFixed(2);
    product.difference = difference.toFixed(2);
  
    cart[selectedProductIndex] = product;
  
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // Update table
    $(`.listed-price[data-index="${selectedProductIndex}"]`).text(`$${product.listedPrice}`);
    $(`.total-listed-price[data-index="${selectedProductIndex}"]`).text(`$${product.totalListedPrice}`);
    $(`.difference[data-index="${selectedProductIndex}"]`)
      .text(`$${product.difference}`)
      .css("color", difference < 0 ? "red" : "green");
  
    Swal.fire("Price Updated", "The listed price and totals have been updated.", "success");
    $("#editPriceModal").modal("hide");
  
    updateGrandTotal();
  });

  // Update Grand Total based on selected products
  $(document).on("change", ".select-product", function () {
    updateGrandTotal();
  });

  //Generating PDF 
  $("#generateBudgetReport").click(function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let selectedProducts = [];
  
    $(".select-product:checked").each(function () {
      let index = $(this).data("index");
      let product = cart[index];
  
      selectedProducts.push({
        name: product.name,
        quantity: product.quantity,
        listedPrice: product.listedPrice,
        totalListedPrice: product.totalListedPrice,
      });
    });
  
    if (selectedProducts.length === 0) {
      Swal.fire("No Products Selected", "Please select products to generate the report.", "warning");
      return;
    }
  
    let grandTotal = $("#grandTotal").text();
  
    // Populate hidden form fields
    $("#productsInput").val(JSON.stringify(selectedProducts));
    $("#grandTotalInput").val(grandTotal);
  
    // Submit the form
    $("#budgetForm").submit();
  });



  // Updating Grand Total 
  function updateGrandTotal() {

    let grandTotal = 0;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    cart.forEach(function (product, index) {
      if ($(`.select-product[data-index="${index}"]:checked`).length) {
        let total = parseFloat(product.totalListedPrice.replace("$", "").trim()) || 0;
        grandTotal += total;
      }
    });
  
    $("#grandTotal").text(`$${grandTotal.toFixed(2)}`);
    
  }


  //Triggering button for the deletion on Data base
  $(document).on("click", ".btn-del", function () {
    let id_product = $(this).attr("data-id");

    $.confirm({
      title: "Are You sure?",
      content: "Once You delete there is no turning back",
      theme: "supervan",
      buttons: {
        Yes: {
          text: "Yes I'm Sure!",
          btnClass: "btn-blue",
          action: function () {
            deleteProduct(id_product);
          },
        },
        No: {
          text: "Cancel!",
          action: function () {},
        },
      },
    });
  });


  // Inserting Products in Data Base
  function insertProduct() {
    let data = $("#frm_new_prod").serialize();
    $.post("assets/php/insert.php", data, function (server_response) {
      if (server_response == 1) {
        loadProducts();
        Swal.fire({
          title: "Successful!",
          text: "Record has been Entered!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Insert was unsuccessful.",
          icon: "error",
        });
      }
    });
  }


  $(document).on("click", ".fa-star", function () {
    // Reset all stars in the current container
    $(this).siblings().css("color", "black");
  
    // Highlight the clicked star and all previous stars
    $(this).css("color", "yellow").prevAll().css("color", "yellow");
  });
  

});

// Load products and display them in cards
function loadProducts() {
  $.get("assets/php/get_products.php", {}, function (json) {
    let response = JSON.parse(json);
    let html =
      "<div class='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center'>";

      for (let i = 0; i < response.length; i++) {
        html += `
            <div class="col mb-4">
              <div class="card shadow" style="width: 18rem; height: auto;"> <!-- Adjust height dynamically -->
                  <!-- Image Section -->
                  <img src="${response[i].image}" alt="${response[i].name}" 
                       class="card-img-top img-fluid" 
                       style="height: 270px; object-fit: cover;">
      
                  <!-- Card Body Section -->
                  <div class="card-body text-center">
                    <h2 class="card-title text-center" style="font-size: 1.25rem; font-weight: bold;">
                      ${response[i].name}
                    </h2>
                    <span class="text-center h5" style="color: #333;">$${response[i].price}</span>
                    <div class="mt-1 text-center">
                      <!-- Star Rating -->
                      <i class="fa-solid fa-star" style="cursor:pointer;" ></i>
                      <i class="fa-solid fa-star" style="cursor:pointer;" ></i>
                      <i class="fa-solid fa-star" style="cursor:pointer;" ></i>
                      <i class="fa-solid fa-star" style="cursor:pointer;" ></i>
                      <i class="fa-solid fa-star" style="cursor:pointer;" ></i>
                   
                    </div>
                  </div>
      
                  <!-- Card Footer Section -->
                  <div class="card-footer d-flex align-items-center justify-content-center gap-3 flex-wrap p-3">
                    <button type="button" class="btn btn-outline-primary btn-quick-view" 
                            data-name="${response[i].name}" 
                            data-price="${response[i].price}" 
                            data-description="${response[i].desc}" 
                            data-image="${response[i].image}">
                      Quick View
                    </button>
                    <i class="fas fa-edit text-primary edit-icon" 
                       data-name="${response[i].name}" 
                       data-img="${response[i].image}" 
                       data-desc="${response[i].desc}" 
                       data-id="${response[i].id}" 
                       data-price="${response[i].price}" 
                       style="cursor: pointer;"></i>
                    <i class="fas fa-trash text-danger del-icon" 
                       data-id="${response[i].id}" 
                       style="cursor: pointer;"></i>
                  </div>
              </div>
            </div>`;
      }
      

    html += "</div>";
    $("#div_card_cont").html(html);


   

    $(document)
      .on("mouseenter", ".card-img-top", function () {
        $(this).attr("title", "View Image in Large");
      })
      .on("mouseleave", ".card-img-top", function () {
        $(this).attr("title", "");
      });

    $(document).on("click", ".card-img-top", function () {
      let imageSrc = $(this).attr("src");
      let productName = $(this).data("name");
      viewImage(imageSrc, productName);
    });
  });
}

// View product image in modal
function viewImage(imageSrc, productName) {
  $("#modalImage").attr("src", imageSrc);
  $("#imageModalLabel").text(productName);
  $("#imageModal").modal("show");
}

//Refresh Cart Table
function updateCartTable() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let html = "";
  cart.forEach(function (product, index) {
    html += `
      <tr>
        <td><input type="checkbox" class="select-product" data-index="${index}"></td>
        <td><img src='${product.img}' width='50px'></td>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>$${product.price}</td>
        <td class="fw-bold">${product.total}</td>
        <td class="listed-price" data-index="${index}">$${product.listedPrice || "-"}</td>
        <td class="total-listed-price fw-bold" data-index="${index}">$${product.totalListedPrice || "-"}</td>
        <td class="difference" data-index="${index}" style="color: ${parseFloat(product.difference) < 0 ? "red" : "green"}">$${product.difference || "-"}</td>
        <td>
          <i class="fas fa-edit text-primary edit-price-icon" data-index="${index}" style="cursor: pointer;"></i>
          <i class="fas fa-trash text-danger delete-product-icon" data-index="${index}" style="cursor: pointer;"></i>  <!-- Delete Icon -->
        </td>
      </tr>
    `;
  });
  $("#mytable tbody").html(html);
  updateGrandTotal();
}


function editProduct() {

  let data = $("#frm_edit_prod").serialize();

  $.post("assets/php/update.php", data, function (server_response) {
    if (server_response == 1) {
      loadProducts();
      Swal.fire({
        title: "Successful!",
        text: "Record has been Edited!",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Insert was unsuccessful.",
        icon: "error",
      });
    }
  });
}

  function deleteProduct(id_p) {
  $.post("assets/php/delete.php", { id: id_p }, function (server_response) {
    if (server_response == 1) {
      Swal.fire({
        title: "Successful!",
        text: "Product deleted!",
        icon: "success",
      });
      loadProducts();
    } else {
      Swal.fire({
        title: "Error!",
        text: "Deletion failed.",
        icon: "error",
      });
    }
  });
}