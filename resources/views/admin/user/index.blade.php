@extends('admin.layouts.app')

@push('style-link')
<link href="{{ asset('src/assets/css/light/components/modal.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('src/assets/css/light/components/tabs.css') }}" rel="stylesheet" type="text/css">

<link href="{{ asset('src/assets/css/dark/components/modal.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('src/assets/css/dark/components/tabs.css') }}" rel="stylesheet" type="text/css">
@endpush

@section('breadcumbs')
<nav class="breadcrumb-style-one" aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">{{ $page_title }}</li>
    </ol>
</nav>
@endsection

@section('content')
<div class="col-xl-12 col-lg-12 col-sm-12  layout-spacing">
    @include('admin.components.alert')
    <div class="widget-content widget-content-area br-8">
        <table id="users-table" class="table dt-table-hover" style="width:100%">
            <thead>
                <tr>
                    <th width="7%">No</th>
                    <th>Nama Lengkap</th>
                    <th>Email</th>
                    <th class="no-content" width="10%">Action</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

<div id="modalContainer"></div>
@endsection

@push('js')
<script>
    $(document).ready(function() {
        // getData
        $('#users-table').DataTable({
            processing: true,
            serverSide:true,
            ajax: {
            url: "{{ route('users.get-data') }}",
                error: function(xhr, textStatus, errorThrown) {
                    $('#users-table').DataTable().clear().draw(); // Bersihkan tabel
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
                {data: 'fullname', name:'fullname'},
                {data: 'email', name:'email'},
                {data: 'action', name:'action'},
            ],
            "dom": "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3'f<'toolbar align-self-center'>>>>" +
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

        $("div.toolbar").html('<button class="ms-2 btn btn-primary users-add" type="button" data-bs-target="#tabs-add-user">'+
                                '<span>Create User</span>'+
                                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'+
                            '</button>');

        // Event create by Modal
        $(document).on('click', '.users-add', function() {
            var getTarget = $(this).data('bs-target');

            $.get("{{ route('users.modal-add') }}", function(data) {
                $('#modalContainer').html(data);
                $(`${getTarget}`).modal('show');
            });
        });

        // Event Edit by Modal
        $(document).on('click', '.users-edit-table', function() {
            var userId = $(this).data('bs-target');
            var parts = userId.split("-");
            var id = parseInt(parts[1]);

            $.get("{{ url('users/modal-edit') }}/" + id, function(data) {
                $('#modalContainer').html(data);
                $(`${userId}`).modal('show');
            });
        });

        // Event Delete by Modal
        $(document).on('click', '.users-delete-table', function() {
            var userId = $(this).data('bs-target');
            var parts = userId.split("-");
            var id = parseInt(parts[1]);

            $.get("{{ url('users/modal-delete') }}/" + id, function(data) {
                $('#modalContainer').html(data);
                $(`${userId}`).modal('show');
            });
        });
    });
</script>
@endpush
