@extends('admin.layouts.app')

@push('style-link')
<!--  BEGIN CUSTOM STYLE FILE  -->
<link rel="stylesheet" type="text/css" href="{{ asset('src/plugins/css/light/editors/quill/quill.snow.css') }}">
<link href="{{ asset('src/assets/css/light/apps/todolist.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('src/assets/css/light/components/modal.css') }}" rel="stylesheet" type="text/css">

<link rel="stylesheet" type="text/css" href="{{ asset('src/plugins/css/dark/editors/quill/quill.snow.css') }}">
<link href="{{ asset('src/assets/css/dark/apps/todolist.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('src/assets/css/dark/components/modal.css') }}" rel="stylesheet" type="text/css">
@endpush

@section('breadcumbs')
<nav class="breadcrumb-style-one" aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">{{ $page_title }}</li>
    </ol>
</nav>
@endsection

@section('content')
<div class="col-xl-12 col-lg-12 col-md-12">

    <div class="mail-box-container">
        <div class="mail-overlay"></div>

        <div class="tab-title">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <h5 class="app-title mt-2">ROLE LIST</h5>
                </div>
                <div class="col-md-12 col-sm-12 col-12 ps-0">
                    <div class="todoList-sidebar-scroll mt-4">
                        <ul class="nav nav-pills d-block roleList" id="pills-tab" role="tablist">
                        </ul>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-12">
                    <button class="btn btn-primary roles-add" type="button" data-bs-target="#tabs-add-role" id="addTask"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> New Role</button>
                </div>
            </div>
        </div>

        <div id="todo-inbox" class="accordion todo-inbox">
            <div class="search">
                <input type="text" class="form-control input-search" placeholder="Search Task...">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu mail-menu d-lg-none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </div>

            <div class="todo-box">
                <div id="ct" class="todo-box-scroll">
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modalContainer"></div>
@endsection

@push('js-src')
<script src="{{ asset('src/plugins/src/editors/quill/quill.js') }}"></script>
<script src="{{ asset('src/assets/js/apps/todoList.js') }}"></script>
@endpush

@push('js')
<script>
    $(document).ready(function() {
        // getData
        $('#roles-table').DataTable({
            processing: true,
            serverSide:true,
            ajax: {
            url: "{{ route('roles.get-data') }}",
                error: function(xhr, textStatus, errorThrown) {
                    $('#roles-table').DataTable().clear().draw(); // Bersihkan tabel
                    console.log(xhr.responseText); // Tampilkan pesan kesalahan di konsol browser
                    alert('There was an error fetching data. Please try again later.'); // Tampilkan pesan kesalahan kepada pengguna
                }
            },
            columns: [
                {
                        "data": 'DT_RowIndex',
                        orderable: false,
                        searchable: false
                },
                {data: 'name', name:'name'},
                {data: 'action', name:'action'},
            ],
            "dom": "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f>>>" +
            "<'table-responsive'tr>" +
            "<'dt--bottom-section d-sm-flex justify-content-sm-between text-center'<'dt--pages-count  mb-sm-0 mb-3'i><'dt--pagination'p>>",
            "oLanguage": {
                "oPaginate": { "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
                "sInfo": "Showing page _PAGE_ of _PAGES_",
                "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                "sSearchPlaceholder": "Search...",
            "sLengthMenu": "Results :  _MENU_",
            },
            "stripeClasses": [],
            "lengthMenu": [10, 20, 50],
            "pageLength": 10
        });

        // Event create by Modal
        $(document).on('click', '.roles-add', function() {
            var getTarget = $(this).data('bs-target');
            $.get("{{ route('roles.modal-add') }}", function(data) {
                $('#modalContainer').html(data);
                $(`${getTarget}`).modal('show');
            });
        });

        // Event Edit by Modal
        $(document).on('click', '.roles-edit-table', function() {
            var roleId = $(this).data('bs-target');
            var parts = roleId.split("-");
            var id = parseInt(parts[1]);

            $.get("{{ url('roles/modal-edit') }}/" + id, function(data) {
                $('#modalContainer').html(data);
                $(`${roleId}`).modal('show');
            });
        });

        // Event Delete by Modal
        $(document).on('click', '.roles-delete-table', function() {
            var roleId = $(this).data('bs-target');
            var parts = roleId.split("-");
            var id = parseInt(parts[1]);

            $.get("{{ url('roles/modal-delete') }}/" + id, function(data) {
                $('#modalContainer').html(data);
                $(`${roleId}`).modal('show');
            });
        });
    });
</script>
@endpush
