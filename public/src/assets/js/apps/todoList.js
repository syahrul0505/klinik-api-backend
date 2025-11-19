const globalURL = 'https://vtruck-pos.vmond.co.id/';
var dataRole = [];
$('.input-search').on('keyup', function() {
  var rex = new RegExp($(this).val(), 'i');
    $('.todo-box .search-active').hide();
    $('.todo-box .search-active').filter(function() {
        return rex.test($(this).text());
    }).show();
});

/*
  ====================
    Quill Editor
  ====================
*/
$('.mail-menu').on('click', function(event) {
  $('.tab-title').addClass('mail-menu-show');
  $('.mail-overlay').addClass('mail-overlay-show');
})
$('.mail-overlay').on('click', function(event) {
  $('.tab-title').removeClass('mail-menu-show');
  $('.mail-overlay').removeClass('mail-overlay-show');
})

const ps = new PerfectScrollbar('.todo-box-scroll', {
    suppressScrollX : true
});

const todoListScroll = new PerfectScrollbar('.todoList-sidebar-scroll', {
    suppressScrollX : true
});

// Handler untuk checkbox individual
$(document).on('change', '.inbox-chkbox', function() {
    var roleId = $(this).closest('.todo-item').data('role-id');
    var permissionId = $(this).closest('.todo-item').data('permission-id');
    var isChecked = $(this).is(':checked');

    $.ajax({
        url: '/roles/update-permission',
        type: 'POST',
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            _method: 'POST',
            roleId: roleId,
            permissionId: permissionId,
            isChecked: isChecked
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
});

// Handler untuk checkbox "allChecked"
$(document).on('change', '.allChecked', function() {
    var isChecked = $(this).prop('checked');
    var roleId = $(this).closest('.headerRole').data('role-id');

    if (isChecked) {
        $('.search-active .inbox-chkbox').prop('checked', true);
    } else {
        $('.search-active .inbox-chkbox').prop('checked', false);
    }

    // Panggil fungsi untuk update data permission ke controller
    updateAllPermission(roleId, isChecked);
});


function updateAllPermission(roleId, status) {
    // Kirim status checkbox ke controller menggunakan Ajax
    $.ajax({
        url: '/roles/update-all-permissions',
        type: 'POST',
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            roleId: roleId,
            status: status // Kirim status checkbox
        },
        success: function(response) {
            console.log('Response: ',response);
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}


function buttonClick() {
    $btns = $('.list-actions').click(function() {
        var id = $(this).attr('id');
        console.log('test', id);
        if (dataRole.includes(id)) {
            var $el = $('.' + id).fadeIn();
            var $searchAct = $('.' + id).addClass('search-active');
            $('#ct > div').not($el).hide();
            $('#ct > div').not($searchAct).removeClass('search-active');
        }
        $btns.removeClass('active');
        $(this).addClass('active');
    });
}

getDataRole();
// Fungsi untuk mengambil data peran
function getDataRole() {
    $.ajax({
        url: '/roles/get-data',
        method: 'GET',
        dataType: 'JSON',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            handleRoleData(response);
            buttonClick();
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

// Fungsi untuk menangani data peran
function handleRoleData(response) {
    var allPermission = response.permissions;
    response.roles.forEach((role, index) => {
        dataRole.push(role.name);
        var replaceRoleName = role.name.replace(/\s+/g, function(match) {
            return (match.length > 1) ? '-' : match;
        });

        appendRoleList(replaceRoleName, index);
        appendRolePermissions(role, replaceRoleName, index, allPermission);
    });

    $('.todo-content').on('click', 'h5', function() {
        togglePermissionCheckbox($(this));
    });

}

// Fungsi untuk menambahkan daftar peran
function appendRoleList(replaceRoleName, index) {
    $('.roleList').append(`<li class="nav-item">
        <a class="nav-link list-actions ${(index == 0) ? 'active' : ''}" id="${replaceRoleName}" data-toggle="pill" href="#${replaceRoleName}" role="tab" aria-selected="${(index == 0) ? 'true' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            ${replaceRoleName}
            <span class="todo-badge badge"></span>
        </a>
    </li>`);
}

// Fungsi untuk menambahkan izin peran
function appendRolePermissions(role, replaceRoleName, index, permissions) {
    $('#ct').append(`<div class="todo-item headerRole ${replaceRoleName}" style="${(index != 0) ? 'display: none;' : ''}" data-role-id="${role.id}">
        <div class="todo-item-inner justify-content-end">
            <div class="n-chk text-center">
                <div class="form-check form-check-primary form-check-inline mt-1 me-0" data-bs-toggle="collapse" data-bs-target>
                    <input class="form-check-input inbox-chkbox allChecked" type="checkbox">
                </div>
            </div>
            <div class="todo-content">
                <h5 class="todo-heading" data-todoHeading="${role.name}">Role : ${role.name}</h5>
            </div>
            <div class="action-dropdown custom-dropdown-icon">
                <div class="dropdown">
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-6" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </a>
                    <div class="dropdown-menu left" aria-labelledby="dropdownMenuLink-6">
                        <a class="edit dropdown-item roles-edit-table" data-bs-target="#tabs-${role.id}-edit-role" href="#!">Edit</a>
                        <a class="dropdown-item delete roles-delete-table"  data-bs-target="#tabs-${role.id}-delete-role" href="#!">Delete</a>
                    </div>
                </div>
            </div>

        </div>
    </div>`);

    permissions.forEach(permission => {
        $('#ct').append(`<div class="todo-item ${(index == 0) ? 'search-active' : ''} ${replaceRoleName}" style="${(index != 0) ? 'display: none;' : ''}" data-permission-id="${permission.id}" data-role-id="${role.id}">
            <div class="todo-item-inner">
                <div class="n-chk text-center">
                    <div class="form-check form-check-primary form-check-inline mt-1 me-0" data-bs-toggle="collapse" data-bs-target>
                        <input class="form-check-input inbox-chkbox" type="checkbox" ${role.permissions.some(permissionObj => permissionObj.id === permission.id) ? 'checked' : ''}>
                    </div>
                </div>

                <div class="todo-content">
                    <h5 class="todo-heading" data-todoHeading="${permission.name}">${permission.name}</h5>
                </div>
            </div>
        </div>`);
    });
}

// Fungsi untuk menangani klik pada checkbox izin
function togglePermissionCheckbox(element) {
    var checkbox = element.closest('.todo-item').find('.inbox-chkbox');
    var roleId = element.closest('.todo-item').data('role-id');
    var permissionId = element.closest('.todo-item').data('permission-id');
    var isChecked = !checkbox.prop('checked');

    checkbox.prop('checked', isChecked);

    $.ajax({
        url: '/roles/update-permission',
        type: 'POST',
        dataType: 'json',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            _method: 'POST',
            roleId: roleId,
            permissionId: permissionId,
            isChecked: isChecked
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

$('.tab-title .nav-pills a.nav-link').on('click', function(event) {
  $(this).parents('.mail-box-container').find('.tab-title').removeClass('mail-menu-show')
  $(this).parents('.mail-box-container').find('.mail-overlay').removeClass('mail-overlay-show')
})
