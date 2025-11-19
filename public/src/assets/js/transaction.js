$(document).ready(function() {
    loadTags();
});

$('#down_payment').on('keyup', function() {
    handleInput('down_payment');
});

$(document).ready(function () {
    // Pertama, inisialisasi TomSelect
    var productSelect = new TomSelect("#no_invoice", {
        maxItems: 1,
        create: false,
        persist: false,
        placeholder: "Pilih Order",
    });

    // Langsung disable setelah inisialisasi
    productSelect.disable();

    function toggleInvoice() {
        const status = $('#status_order').val();
        
        if (status === 'Order Tambahan') {
            $('#invoice-container').show();
            productSelect.enable(); // aktifkan select
        } else {
            $('#invoice-container').hide();
            productSelect.clear(); // hapus isi pilihan
            productSelect.disable(); // disable lagi
        }
    }

    // Jalankan saat halaman dimuat
    toggleInvoice();

    // Jalankan saat dropdown berubah
    $('#status_order').on('change', toggleInvoice);
});



function loadTags(url = '/get-tag') {
    $('#productContainer').html('<p class="text-center">Waiting...</p>');
    $('#tagNavigation').empty();

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            renderTags(response);
        },
        error: function(xhr, status, error) {
            console.error('Failed to load tags: ', error);
        }
    });
}

function loadProducts(categoryId, categoryName, url = '/get-product') {
    $('#productContainer').html('<p class="text-center">Waiting...</p>');
    $('#tagNavigation').append(`${categoryName}`);

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category'); // Dynamically get the 'category' parameter from the URL

    if (!category) {
        console.error('Category parameter is missing in the URL');
        return;
    }

    const requestUrl = `${url}/${categoryId}?category=${category}`;

    $.ajax({
        url: requestUrl,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            renderProducts(response);
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}


function renderTags(tags) {
    const productContainer = $('#productContainer');

    productContainer.empty();
    // console.log(tags);
    if (tags.length > 0) {
        $.each(tags, function(index, tag) {
            const tagDiv = $('<div class="col-12 col-md-3 text-center"></div>');

            const tagLink = $(`<a href="#!" onclick="loadProducts(${tag.id}, '${tag.name}');" class="cursor-pointer text-dark"></a>`);

            const tagImg = $('<img class="card-img-top" alt="">').attr('src',  'https://ui-avatars.com/api/?name=' + tag.name.replace(' ', '+'));

            const tagName = $('<p class="mb-0 fw-bold mt-1"></p>').text(tag.name);

            tagLink.append(tagImg, tagName);
            tagDiv.append(tagLink);
            productContainer.append(tagDiv);
        });
    } else {
        const noTagDiv = $('<div class="col-12 text-center"></div>');
        const noTagHeader = $('<h3>No Tag Added</h3>');

        noTagDiv.append(noTagHeader);
        productContainer.append(noTagDiv);
    }
}

function renderProducts(products) {
    const productContainer = $('#productContainer');
    productContainer.empty();

    if (products.length > 0) {
        $.each(products, function(index, product) {
            const productDiv = $('<div class="col-12 col-md-3 text-center"></div>');

            const productLink = $(`<a href="#!" onclick="ModalAddToCart(${product.id})" class="cursor-pointer text-dark" data-bs-target="#modal-add-to-cart-${product.id}"></a>`);

            const imgSrc = product.picture 
                ? 'images/products/' + product.picture 
                : 'https://ui-avatars.com/api/?name=' + product.name.replace(' ', '+');

            // Tambahkan style jika stok habis
            const imgStyle = (product.current_stock <= 0) 
                ? 'filter: grayscale(100%) brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(6);' 
                : '';

            const productImg = $('<img class="card-img-top" alt="">')
                .attr('src', imgSrc)
                .attr('style', imgStyle);

            const productName = $('<p class="mb-0 fw-bold mt-1"></p>').text(product.name);

            productLink.append(productImg, productName);
            productDiv.append(productLink);
            productContainer.append(productDiv);
        });
    } else {
        const noProductDiv = $('<div class="col-12 text-center"></div>');
        const noProductHeader = $('<h3>No Product Added</h3>');

        noProductDiv.append(noProductHeader);
        productContainer.append(noProductDiv);
    }
}

function onHoldOrder(url, token) {
    $.confirm({
        title: `Onhold Order`,
        content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Customer Name</label>' +
            '<input type="text" placeholder="Enter costomer name..." class="name form-control" />' +
            '</div>' +
            '</form>',
        autoClose: 'cancel',
        theme: 'dark',
        buttons: {
            cancel: {
                text: 'CANCEL',
                btnClass: 'btn-danger'
            },
            formSubmit: {
                text: 'Submit',
                btnClass: 'btn-blue',
                action: function () {
                    var name = this.$content.find('.name').val();
                    $.ajax({
                        url: url,
                        type: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        data: {
                            "_token": token,
                            "name" : name
                        },
                        success: function(response) {
                            console.log(response);
                            // Clear cart in table
                            $('#cart-product').empty();

                            // Add list in table after clear
                            var addlist = `<tr class="table-cart">`+
                                            `<td colspan="3" class="text-center">No products added</td>`+
                                        `</tr>`;
                            $('#cart-product').append(addlist);

                            $('#subtotal-cart').text(`Rp.0`);
                            $('#tax-cart').text(`Rp.0`);
                            $('#service-cart').text(`Rp.0`);
                            $('#total-cart').text(`Rp.0`);

                            // Discount
                            $('#type-discount').text("");
                            $('#discount-price').text(`Rp.0`);
                            $('input[name="discount_price"]').val(0);
                            $('input[name="discount_percent"]').val(0);
                            $('input[name="ongkir_price"]').val(0);

                            // Customer
                            $('input[name="customer_id"]').val(null);
                            $('#data-customer').text('No data');
                        },
                        error: function(xhr, status, error) {
                            console.error('Failed to load Product: ', error);
                        }
                    });
                }
            }
        }
    });
}

function openOnholdOrder(url, key, token) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "key": key,
        },
        success: function(response) {
            console.log(response);
            $('#cart-product').empty();
            $.each(response.data, function(index, cart) {
                var addList = `<tr class="table-cart text-white">`+
                                    `<td class="td-cart">`+
                                        `<div class="d-flex justify-content-between">`+
                                            `<div class="">`+
                                                `<p class="p-0 m-0 text-white">`+
                                                    `${cart.name}`+
                                                `</p>`+
                                            `</div>`+

                                            `<div>`+
                                                `<a href="/delete-item/${index}" class="" style="border-bottom: 1px dashed red;">`+
                                                    `<i class='bx bx-trash font-14 text-danger'></i>`+
                                                `</a>`+
                                            `</div>`+
                                        `</div>`+
                                    `</td>`+
                                    `<td class="td-cart">${cart.quantity}</td>`+
                                    `<input type="hidden" name="qty[]" id="quantityInput" class="form-control qty" min="0"  value="${cart.quantity}">`+
                                    `<td class="td-cart">Rp.${numberFormat(cart.price)}</td>`+
                                `</tr>`;

                $('#cart-product').append(addList);
            });

            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`);
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`);
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`);
            $('#modal-my-order').modal('hide');
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function openBillOrder(url, id, token) {
    console.log('tes');
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "id": id,
        },
        success: function(response) {
            console.log(response);
            $('#cart-product').empty();
            $.each(response.data, function(index, cart) {
                var addList = `<tr class="table-cart text-white">`+
                                    `<td class="td-cart">`+
                                        `<div class="d-flex justify-content-between">`+
                                            `<div class="">`+
                                                `<p class="p-0 m-0 text-white">`+
                                                    `${cart.name}`+
                                                `</p>`+
                                            `</div>`+

                                            `<div>`+
                                                `<a href="/delete-item/${index}" class="" style="border-bottom: 1px dashed red;">`+
                                                    `<i class='bx bx-trash font-14 text-danger'></i>`+
                                                `</a>`+
                                            `</div>`+
                                        `</div>`+
                                    `</td>`+
                                    `<td class="td-cart">${cart.quantity}</td>`+
                                    `<input type="hidden" name="qty[]" id="quantityInput" class="form-control qty" min="0"  value="${cart.quantity}">`+
                                    `<td class="td-cart">Rp.${numberFormat(cart.price)}</td>`+
                                `</tr>`;

                $('#cart-product').append(addList);
            });

            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`);
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`);
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`);
            $('#modal-my-order').modal('hide');
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function ModalEditQtyCart(url = '/modal-edit-qty-cart', key, token) {
    var getTarget = `#modal-edit-qty-cart-${key}`;
    $.ajax({
        url: url, // Menggunakan key untuk URL
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(getTarget).modal('show');
            $(getTarget).on('shown.bs.modal', function () {
                // Fungsi untuk menangani penambahan nilai ketika tombol + ditekan
                $("#btn-add").on("click", function() {
                    var input = $(this).siblings("input[type='number']");
                    var value = parseInt(input.val());

                    input.val(value + 1);
                });

                // Fungsi untuk menangani pengurangan nilai ketika tombol - ditekan
                $("#btn-min").on("click", function() {
                    var input = $(this).siblings("input[type='number']");
                    var value = parseInt(input.val());
                    if (value > 0) {
                        input.val(value - 1);
                    }
                });

                // Memastikan nilai input tidak kurang dari 0
                $(".qty-add").on("change", function() {
                    if ($(this).val() < 0) {
                        $(this).val(0);
                    }
                });

                $('#updateQtyCartButton').on('click', function() {
                    const quantity = $('#qty-add').val();
                    const route = $(this).data('route');
                    const token = $(this).data('token');

                    updateCartQuantity(key, quantity, route, token, getTarget); // Memanggil fungsi update cart quantity
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function updateCartQuantity(key, quantity, url, token, modalSelector) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': token,
        },
        data: {
            "key": key,
            "quantity": quantity,
        },
        success: function(response) {
            $('#cart-product').empty();
            $.each(response.data, function(index, cart) {
                console.log(cart.price);
                var deleteButton = response.canDelete 
                    ? `<a href="/delete-item/${index}" class="" style="border-bottom: 1px dashed red;">`+
                      `<i class='bx bx-trash font-14 text-danger'></i></a>`
                    : '';

                var addList = `<tr class="table-cart text-white">`+
                                    `<td class="td-cart">`+
                                        `<div class="d-flex justify-content-between">`+
                                            `<div class="">`+
                                                `<p class="p-0 m-0 text-white">`+
                                                    `${cart.name}`+
                                                `</p>`+
                                            `</div>`+
                                            `<div>`+
                                                deleteButton +
                                            `</div>`+
                                        `</div>`+
                                    `</td>`+
                                    `<td class="td-cart">`+
                                        `<a href="#!" type="button" onclick="ModalEditQtyCart('/modal-edit-qty-cart/${index}', '${index}', '${$('meta[name="csrf-token"]').attr('content')}')" class="cursor-pointer" style="border-bottom: 1px dashed #bfbfbf; font-size:12px;">`+
                                            `<small id="data-qty" style="font-size: 12px;" class="text-white opacity-75">${cart.quantity}</small>`+
                                        `</a>`+
                                    `</td>`+
                                    `<input type="hidden" name="qty[]" id="quantityInput" class="form-control qty" min="0"  value="${cart.quantity}">`+
                                    `<td>Rp.${formatRupiah(cart.price)}</td>` +
                                `</tr>`;

                $('#cart-product').append(addList);
            });

            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`);
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`);
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`);
            // Close the modal
            $(modalSelector).modal('hide');
        },
        error: function(xhr, status, error) {
            console.error('Failed to update cart item: ', error);
        }
    });
}

function deleteOnholdOrder(url, key, token) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "key": key,
        },
        success: function(response) {
            console.log(response);
            $(`#onhold-${key}`).remove();
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function ModalSearch(urlModal, urlGetProduct, token) {
    var getTarget = `#modal-search-product`;
    $.ajax({
        url: urlModal ,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {
                $.ajax({
                    url: urlGetProduct,
                    type: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {
                        "_token": token,
                    },
                    success: function(response) {
                        initTypeahead(response, getTarget);
                    },
                    error: function(xhr, status, error) {
                        console.error('Gagal memuat Produk: ', error);
                    }
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function initTypeahead(products, target) {
    // Constructing the suggestion engine
    var productsEngine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: products
    });

    // Initializing the typeahead
    $('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'products',
        display: 'name',
        source: productsEngine,
        templates: {
            suggestion: function(data) {
                return '<div>' + data.name + '</div>';
            }
        }
    }).on('typeahead:selected', function(event, data) {
        $(`${target}`).modal('hide'); // Menutup modal
        ModalAddToCart(data.id);
    });
}

function updateDataList(products) {
    var dataList = $('#productList');
    dataList.empty();

    $.each(products, function(index, product) {
        dataList.append('<option value="' + product.name + '">');
    });
}

function ModalAddToCart(productId, url = '/modal-add-cart') {
    var getTarget = `#modal-add-to-cart-${productId}`;
    $.ajax({
        url: url + '/' +  productId,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {
                // Fungsi untuk menangani penambahan nilai ketika tombol + ditekan
                $("#btn-add").on("click", function() {
                    var input = $(this).siblings("input[type='number']");
                    var value = parseInt(input.val());
                    var currentStock = parseInt($("#current-stock-" + productId).text());

                    if (value < currentStock) {
                        input.val(value + 1);
                    } else {
                        alert("Stock tidak cukup");
                    }
                });

                // Fungsi untuk menangani pengurangan nilai ketika tombol - ditekan
                $("#btn-min").on("click", function() {
                    var input = $(this).siblings("input[type='number']");
                    var value = parseInt(input.val());
                    if (value > 0) {
                        input.val(value - 1);
                    }
                });

                // Memastikan nilai input tidak kurang dari 0
                $(".qty-add").on("change", function() {
                    if ($(this).val() < 0) {
                        $(this).val(0);
                    } else {
                        var currentStock = parseInt($("#current-stock-" + productId).text());
                        if (parseInt($(this).val()) > currentStock) {
                            alert("Stock tidak cukup");
                            $(this).val(currentStock);
                        }
                    }
                });

                $('.child-checkbox').each(function() {
                    const isOptional = $(this).data('status-optional');
                    const maxChoose = $(this).data('choose');
                    const parentId = $(this).data('parent-id');

                    if (!isOptional) {
                        // Wajib dipilih
                        const checkboxes = $(`.child-checkbox[data-parent-id="${parentId}"]`);
                        const checkedCount = checkboxes.filter(':checked').length;

                        if (checkedCount < maxChoose) {
                            checkboxes.slice(0, maxChoose).prop('checked', false);
                        } else {
                            checkboxes.slice(maxChoose).prop('checked', false);
                        }
                    }
                });

                // Event handler untuk mengontrol checkbox berdasarkan pilihan maksimal
                $('.child-checkbox').on('change', function() {
                    const parentId = $(this).data('parent-id');
                    const maxChoose = $(this).data('choose');
                    const checkboxes = $(`.child-checkbox[data-parent-id="${parentId}"]`);
                    const checkedCount = checkboxes.filter(':checked').length;

                    if (checkedCount > maxChoose) {
                        $(this).prop('checked', false);
                        alert(`Anda hanya dapat memilih maksimal ${maxChoose} addons.`);
                    }
                });

                $('#addToCartButton').on('click', function() {
                    let isValid = true;
                    let validationMessage = "";

                    // Loop through each parent addon to check if the selected addons are valid
                    $('.parent-addons').each(function() {
                        const parentId = $(this).data('parent-id');
                        const name = $(this).data('name');
                        const statusOptional = $(this).data('status-optional');
                        const maxChoose = $(this).data('choose');
                        const checkboxes = $(`.child-checkbox[data-parent-id="${parentId}"]`);
                        const checkedCount = checkboxes.filter(':checked').length;

                        if (!statusOptional && checkedCount !== maxChoose) {
                            isValid = false;
                            validationMessage += `Anda harus memilih ${maxChoose} addon ${name}.`;
                        }
                    });

                    if (!isValid) {
                        alert(validationMessage);
                        return;
                    }

                    // Ambil semua checkbox yang tercentang
                    const selectedAddons = $('.child-checkbox:checked').map(function() {
                        return {
                            id: $(this).val(),
                            parentId: $(this).data('parent-id'),
                            statusOptional: $(this).data('status-optional'),
                            choose: $(this).data('choose'),
                            price: $(this).data('price')
                        };
                    }).get();

                    const quantity = $('#qty-add').val();
                    const price = $('#price').val();
                    const route = $(this).data('route');
                    const token = $(this).data('token');

                    addToCart(productId, selectedAddons, quantity, route, token,price);
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function ModalAddCustomer(urlModal, urlGetDataCust, token) {
    var getTarget = `#modal-add-customer`;
    $.ajax({
        url: urlModal ,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {
                $.ajax({
                    url: urlGetDataCust,
                    type: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {
                        "_token": token,
                    },
                    success: function(response) {
                        initTypeaheadCustomer(response, getTarget);
                    },
                    error: function(xhr, status, error) {
                        console.error('Gagal memuat Produk: ', error);
                    }
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function initTypeaheadCustomer(customers, target) {
    // Constructing the suggestion engine
    var customersEngine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: customers
    });

    // Initializing the typeahead
    $('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'customers',
        display: 'name',
        source: customersEngine,
        templates: {
            suggestion: function(data) {
                return '<div>' + data.name + '</div>';
            }
        }
    }).on('typeahead:selected', function(event, data) {
        $('input[name="customer_id"]').val(data.id);
        $('#data-customer').text(data.name);
        $(`${target}`).modal('hide');
    });
}

function ModalAddCoupon(urlModal, urlUpdateCart, token) {
    var getTarget = `#modal-add-coupon`;
    $.ajax({
        url: urlModal,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {
                $('#save-coupon').on('click', function() {
                    var getCoupon = $('#select-coupon').val();
                    $('input[name="coupon_id"]').val(getCoupon);

                    updateCouponInCart(getCoupon, urlUpdateCart, token)
                    $(`${getTarget}`).modal('hide'); // Menutup modal
                })
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

// Coupon update
function updateCouponInCart(couponId, urlUpdateCart, token) {
    $.ajax({
        url: urlUpdateCart,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "coupon_id": couponId,
        },
        success: function(response) {
            console.log(response);
            $('#coupon-info').text(`Coupon (${response.info})`)
            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`)
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`)
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`)
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}


function ModalAddDiscount(url, urlUpdate, tokenUpdate) {
    var getTarget = `#modal-add-discount`;
    $.ajax({
        url: url ,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {
                $('#select-type-discount').on('change', function() {
                    var selectedValue = $(this).val();

                    if (selectedValue == 'price') {
                        $('#input-price').prop('disabled', false);
                        $('#input-percent').prop('disabled', true);
                    } else if (selectedValue == 'percent') {
                        $('#input-percent').prop('disabled', false);
                        $('#input-price').prop('disabled', true);
                    }
                })

                $('#input-price').on('keyup', function() {
                    handleInput('input-price');
                });

                $('#save-discount').on('click', function() {
                    var getValPrice = $('input[name="input-price"]').val();
                    var getValPercent = $('input[name="input-percent"]').val();
                    var getTypeDiscount = $('#select-type-discount').val();
                    var getValSewaPrice = $('input[name="sewa-price"]').val();

                    $('input[name="type_discount"]').val(getTypeDiscount);
                    if (getTypeDiscount == 'price') {
                        $('#type-discount').text(`(price)`);
                        $('#discount-price').text(`Rp.${formatRupiah(getValPrice)}`);
                        $('input[name="discount_price"]').val(getValPrice);
                    } else if(getTypeDiscount == 'percent') {
                        $('#type-discount').text(`(percent)`);
                        $('#discount-price').text(`${getValPercent}%`);
                        $('input[name="discount_percent"]').val(getValPercent);
                    }
                    $('input[name="sewa-price"]').val(getValSewaPrice);

                    let subtotal = document.getElementById("subtotal-cart").innerText;
                    let total = document.getElementById("total-cart").innerText;
                    let sewa = document.getElementById("sewa-price").innerText;
                    console.log(subtotal);
                    
                    updateDiscountInCart(getValSewaPrice,getTypeDiscount, getValPrice, getValPercent, urlUpdate, tokenUpdate,subtotal,total,sewa)

                    $(`${getTarget}`).modal('hide'); // Menutup modal
                })
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

// Modal Sewa
function ModalAddSewa(url, urlUpdate, tokenUpdate) {
    var getTarget = `#modal-add-sewa`;
    $.ajax({
        url: url ,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {

                $('#input-price').on('keyup', function() {
                    handleInput('input-price');
                });

                $('#save-sewa').on('click', function() {
                    var getValPrice = $('input[name="input-price"]').val();
                    var getValPercent = $('input[name="input-percent"]').val();
                    var getTypeDiscount = $('#select-type-discount').val();
                    var getValSewaPrice = $('input[name="input-sewa"]').val();

                    $('input[name="sewa_price"]').val(getValSewaPrice);
                    $('#sewa-price').text(`${formatRupiah(getValSewaPrice)} Malam`);

                    let subtotal = document.getElementById("subtotal-cart").innerText;

                    updateSewaInCart(getValSewaPrice,getTypeDiscount, getValPrice, getValPercent, urlUpdate, tokenUpdate,subtotal)

                    $(`${getTarget}`).modal('hide'); // Menutup modal
                })
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

function numberFormat(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Add Product To Cart
function addToCart(productId, addons, quantity, url, token,price) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "product_id":productId,
            "addons":addons,
            "quantity":quantity,
            "price":price,
        },
        success: function(response) {
            console.log(response);
            $('#cart-product').empty();
            console.log(response);
            $.each(response.data, function(index, cart) {
                var addList = `<tr class="table-cart text-white">`+
                                    `<td class="td-cart">`+
                                        `<div class="d-flex justify-content-between">`+
                                            `<div class="">`+
                                                `<p class="p-0 m-0 text-white">`+
                                                    `${cart.name}`+
                                                `</p>`+
                                            `</div>`+

                                            `<div>`+
                                                `<a href="/delete-item/${index}" class="" style="border-bottom: 1px dashed red;">`+
                                                    `<i class='bx bx-trash font-14 text-danger'></i>`+
                                                `</a>`+
                                            `</div>`+
                                        `</div>`+
                                    `</td>`+
                                    `<td class="td-cart">`+
                                        `<a href="#!" type="button" onclick="ModalEditQtyCart('/modal-edit-qty-cart/${index}', '${index}', '${$('meta[name="csrf-token"]').attr('content')}')" class="cursor-pointer" style="border-bottom: 1px dashed #bfbfbf; font-size:12px;">`+
                                            `<small id="data-qty" style="font-size: 12px;" class="text-white opacity-75">${cart.quantity}</small>`+
                                        `</a>`+
                                    `</td>`+
                                    `<input type="hidden" name="qty[]" id="quantityInput" class="form-control qty" min="0"  value="${cart.quantity}">`+
                                    `<td class="td-cart">Rp.${numberFormat(cart.price)}</td>`+
                                `</tr>`;

                $('#cart-product').append(addList);
            });

            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`)
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`)
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`)
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

// Void cart
function voidCart(url, token) {
    $.confirm({
        title: `Void Cart?`,
        content: `Are you sure want to void cart`,
        theme: 'dark',
        autoClose: 'cancel|8000',
        buttons: {
            cancel: {
                text: 'CANCEL',
                btnClass: 'btn-danger'
            },
            delete: {
                text: 'yes',
                btnClass: 'btn-primary',
                action: function () {
                    $.ajax({
                        url: url,
                        type: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        data: {
                            "_token": token,
                        },
                        success: function(response) {
                            $('#cart-product').empty();

                            var addList = `<tr class="table-cart">`+
                                                `<td colspan="3" class="text-center">No products added</td>`+
                                            `</tr>`;

                            $('#cart-product').append(addList);

                            $('#subtotal-cart').text(`Rp.0`);
                            $('#tax-cart').text(`Rp.0`);
                            $('#service-cart').text(`Rp.0`);
                            $('#total-cart').text(`Rp.0`);

                            // Discount
                            $('#type-discount').text("");
                            $('#discount-price').text(`Rp.0`);
                            $('input[name="discount_price"]').val(0);
                            $('input[name="discount_percent"]').val(0);
                            $('input[name="ongkir_price"]').val(0);

                            // Customer
                            $('input[name="customer_id"]').val(null);
                            $('#data-customer').text('No data');
                        },
                        error: function(xhr, status, error) {
                            console.error('Failed to load Product: ', error);
                        }
                    });
                }
            }
        }
    });
}

$(document).ready(function() {
    var typingTimer;
    var doneTypingInterval = 1000;

    $('.barcode').on('keydown', function() {
        clearTimeout(typingTimer);
    });

    $('.barcode').keyup(function(event) {
        var barcode = $(this).val().trim();

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function() {
            addToCartBarcode(barcode); // Panggil addToCartBarcode setelah selesai mengetik dan sebelum menghapus
            clearBarcodeInput()
        }, doneTypingInterval);
    });

    function clearBarcodeInput() {
        $('.barcode').val('');
    }
});


function addToCartBarcode(barcode) {
    console.log(barcode);
    $.ajax({
        url: "{{ route('add-item-barcode') }}",
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": "{{ csrf_token() }}",
            "barcode":barcode,
            "sku":barcode,
            "quantity":1,
        },
        success: function(response) {
            $('#cart-product').empty();

            $.each(response.data, function(index, cart) {
                var addList = `<tr class="table-cart">`+
                                    `<td>`+
                                        `<div class="d-flex justify-content-between">`+
                                            `<div class="">`+
                                                `<p class="p-0 m-0">`+
                                                    `${cart.name}`+
                                                `</p>`+
                                                `<small>Unit: ${cart.conditions}</small>`+
                                            `</div>`+

                                            `<div>`+
                                                `<a href="/delete-item/${index}" class="" style="border-bottom: 1px dashed red;">`+
                                                    `<i class='bx bx-trash font-14 text-danger'></i>`+
                                                `</a>`+
                                            `</div>`+
                                        `</div>`+
                                    `</td>`+
                                    `<td>${cart.quantity}</td>`+
                                    `<input type="hidden" name="qty[]" id="quantityInput" class="form-control qty" min="0" value="${cart.quantity}">`+
                                    `<td>Rp.${numberFormat(cart.attributes['product_unit']['sale_price'])}</td>`+
                                `</tr>`;

                $('#cart-product').append(addList);
            });

            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`)
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`)
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`)
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

// Input Rupiah
function formatRupiah(angka) {
    var numberString = angka.toString().replace(/\D/g, '');
    var ribuan = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return ribuan;
}

function handleInput(inputId) {
    var inputField = $('#' + inputId);
    var input = inputField.val().replace(/\D/g, '');
    var formattedInput = formatRupiah(input);
    inputField.val(formattedInput);
}

function extractNumericValue(id) {
    var currencyText = $(`${id}`).text();
    // Menghapus karakter 'Rp.' dan titik dari teks subtotal
    var valueWithoutCurrency = currencyText.replace('Rp.', '').replace('.', '');

    // Mengonversi teks ke angka
    var numericValue = parseInt(valueWithoutCurrency);

    return numericValue;
}

// Discount update
function updateDiscountInCart(sewaPrice,typeDiscount, discountPrice, discountPercent, url, token, subtotal,total,sewa) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "discount_price":discountPrice,
            "sewa_price":sewaPrice,
            "discount_percent":discountPercent,
            "discount_type":typeDiscount,
            "sub_total":subtotal,
            "total":total,
            "sewa":sewa,
        },
        success: function(response) {
            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`)
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`)
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`)
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

// Sewa update
function updateSewaInCart(sewaPrice,typeDiscount, discountPrice, discountPercent, url, token,subtotal) {
    $.ajax({
        url: url,
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            "_token": token,
            "discount_price":discountPrice,
            "sewa_price":sewaPrice,
            "discount_percent":discountPercent,
            "discount_type":typeDiscount,
            "sub_total":subtotal,
        },
        success: function(response) {
            $('#subtotal-cart').text(`Rp.${formatRupiah(response.subtotal)}`)
            $('#tax-cart').text(`Rp.${formatRupiah(response.tax)}`)
            $('#service-cart').text(`Rp.${formatRupiah(response.service)}`);
            $('#total-cart').text(`Rp.${formatRupiah(response.total)}`)
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}

// My Order
function modalMyOrder(url)
{
    var getTarget = `#modal-my-order`;
    $.ajax({
        url: url ,
        type: 'GET',
        success: function(data) {
            $('#modalContainer').html(data);
            $(`${getTarget}`).modal('show');
            $(`${getTarget}`).on('shown.bs.modal', function () {
                $(document).on('click', '.select-customer', function() {
                    // $('#modal-my-order').modal('hide');
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to load Product: ', error);
        }
    });
}
