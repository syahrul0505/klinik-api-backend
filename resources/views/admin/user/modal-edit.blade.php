<div class="modal fade modal-notification" id="tabs-{{ $user->id }}-edit-user" tabindex="-1" role="dialog" aria-labelledby="tabsModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form class="mt-0 modal-content" action="{{ route('users.update', $user->id) }}" method="post" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="modal-body">
                <div class="d-flex justify-content-center">
                    <div class="icon-content m-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                </div>

                <div class="text-center mb-3 mt-3">
                    <h4 class="mb-0">EDIT USER</h4>
                </div>

                <div class="simple-pill">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="pills-profile-icon-tab" data-bs-toggle="pill" data-bs-target="#pills-profile-icon" type="button" role="tab" aria-controls="pills-profile-icon" aria-selected="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Profile
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-change-password-icon-tab" data-bs-toggle="pill" data-bs-target="#pills-change-password-icon" type="button" role="tab" aria-controls="pills-change-password-icon" aria-selected="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Change Password
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-profile-icon" role="tabpanel" aria-labelledby="pills-profile-icon-tab" tabindex="0">
                            <div class="row">
                                <div class="col-12 col-md-6">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group mb-3 text-left">
                                                <label for="fullname">Nama Lengkap <span class="text-danger">*</span></label>
                                                <input type="text" name="fullname" class="form-control form-control-sm" placeholder="Ex:franky" aria-label="fullname" id="fullname" value="{{ $user->fullname ?? old('fullname') }}">
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="form-group mb-3 text-left">
                                                <label for="username">Username <span class="text-danger">*</span></label>
                                                <input type="text" name="username" class="form-control form-control-sm" placeholder="Ex:franky" aria-label="username" id="username" value="{{ $user->username ?? old('username') }}">
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="form-group">
                                                <label for="email">Email <span class="text-danger">*</span></label>
                                                <input type="email" name="email" class="form-control form-control-sm" placeholder="Ex:example@gmail.com" aria-label="email" value="{{ $user->email ?? old('email') }}">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group mb-3 text-left">
                                                <label for="avatar">Avatar</label>
                                                <img src="{{ $user->avatar ? asset('images/users/'.$user->avatar) : 'https://ui-avatars.com/api/?name=No+Image' }}" alt="" class="d-block mx-auto p-2 bg-black mb-2" style="width: 73px !important; border-radius:50%;">
                                                <input type="file" class="form-control file-upload-input" name="avatar" aria-label="avatar" id="avatar">
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="form-group mb-3">
                                                <label for="phone">Phone</label>
                                                <input type="text" name="phone" id="phone" class="form-control form-control-sm" placeholder="Ex:089999999999" aria-label="phone" value="{{ $user->phone ?? old('phone') }}" pattern="[0-9]*" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-group mb-3">
                                        <label for="role_id">Role</label>
                                        <select class="form-control form-control-sm" name="role_id" id="role_id">
                                            @foreach($roles as $key => $role)
                                            <option value="{{ $role->id }}" {{ $role->name == ($user->getRoleNames()[0] ?? '') ? 'selected' : '' }}>{{ $role->name }}</option>
                                            @endforeach
                                        </select>

                                        @if($errors->has('role_id'))
                                            <p class="text-danger">{{ $errors->first('role_id') }}</p>
                                        @endif
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="address">Address</label>
                                        <textarea name="address" id="address" class="form-control" cols="30" rows="5">{{ $user->address ?? old('address') }}</textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-change-password-icon" role="tabpanel" aria-labelledby="pills-change-password-icon-tab" tabindex="0">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group mb-3">
                                        <label for="old_password">Old Password</label>
                                        <input type="password" name="old_password" id="old_password" class="form-control form-control-sm" placeholder="Ex:********" aria-label="old_password">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group mb-3">
                                        <label for="new_password">New Password</label>
                                        <input type="password" name="new_password" id="new_password" class="form-control form-control-sm" placeholder="Ex:********" aria-label="new_password">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-light-dark" type="button" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</div>

