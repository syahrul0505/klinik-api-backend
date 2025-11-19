<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\AddUserRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\View;
use Yajra\DataTables\Facades\DataTables;
use Spatie\Permission\Models\Role;
use Intervention\Image\Facades\Image;

class UserController extends Controller
{
    function __construct()
    {
        // $this->middleware('permission:user-list', ['only' => ['index', 'getUsers']]);
        // $this->middleware('permission:user-create', ['only' => ['getModalAdd','store']]);
        // $this->middleware('permission:user-edit', ['only' => ['getModalEdit','update']]);
        // $this->middleware('permission:user-delete', ['only' => ['getModalDelete','destroy']]);
    }

    public function index()
    {
        $data['page_title'] = 'User List';
        return view('admin.user.index', $data);
    }

    public function getUsers(Request $request)
    {
        if ($request->ajax()) {
            return DataTables::of(User::query())
            ->addIndexColumn()
            ->addColumn('action', function ($row) {
                $btn = '<button type="button" class="btn btn-sm btn-warning editUser users-edit-table" data-bs-target="#tabs-'.$row->id.'-edit-user">Edit</button>';
                $btn = $btn . ' <button type="button" class="btn btn-sm btn-danger users-delete-table"  data-bs-target="#tabs-'.$row->id.'-delete-user">Delete</button>';
                return $btn;
            })
            ->rawColumns(['action'])
            ->make(true);
        }
    }

    public function getModalAdd()
    {
        $roles = Role::orderby('id', 'asc')->get();
        return View::make('admin.user.modal-add')->with([
            'roles' => $roles
        ]);
    }

    public function store(AddUserRequest $request)
    {
        $dataUser = $request->validated();
        try {
            $user = new User();
            $user->fullname = $dataUser['fullname'];
            $user->username = $dataUser['username'];
            $user->email = $dataUser['email'];
            $user->password = bcrypt($dataUser['password']);
            $user->phone = $dataUser['phone'];
            $user->address = $dataUser['address'];

            if ($request->hasFile('avatar')) {
                $image = $request->file('avatar');
                $imageName = uniqid() . '' . time() . '.webp';

                // Resize and compres image
                // $resizedImage = Image::make($image)
                //     ->resize(300, null, function ($constraint) {
                //         $constraint->aspectRatio();
                //     })
                //     ->encode('webp', 80); // Kompresi kualitas 80%

                // Resize fit center and compres image
                $resizedImage = Image::make($image)
                ->fit(400, 400)
                ->encode('webp', 80);

                // Save iamge after resize, compres, and change format to webp format
                $resizedImage->save(public_path('images/users/' . $imageName));
                $user->avatar = $imageName;
            }
            $user->assignRole([$dataUser['role_id']]);
            $user->save();

            $request->session()->flash('success', "Create data user successfully!");
            return redirect(route('users.index'));
        } catch (\Throwable $th) {
            $request->session()->flash('failed', "Failed to create data user!");
            return redirect(route('users.index'));
        }
    }

    public function getModalEdit($userId)
    {
        $user = User::findOrFail($userId);
        $roles = Role::orderby('id', 'asc')->get();
        return View::make('admin.user.modal-edit')->with([
            'user'  => $user,
            'roles' => $roles
        ]);
    }


    public function update(UpdateUserRequest $request, $userId)
    {
        $dataUser = $request->validated();
        try {
            $user = User::find($userId);

            // Check if user doesn't exists
            if (!$user) {
                $request->session()->flash('failed', "User not found!");
                return redirect()->back();
            }

            $user->fullname = $dataUser['fullname'];
            $user->username = $dataUser['username'];
            $user->email = $dataUser['email'];
            $user->phone = $dataUser['phone'];
            $user->address = $dataUser['address'];

            // Check if old password matches
            if ($dataUser['old_password'] && $dataUser['new_password']) {
                if (Hash::check($dataUser['old_password'], $user->password)) {
                    $user->password = bcrypt($dataUser['new_password']);
                } else {
                    // Old password doesn't match, handle the error
                    $request->session()->flash('failed', "Old password doesn't match!");
                    return redirect()->back();
                }
            }

            if ($request->hasFile('avatar')) {
                $image = $request->file('avatar');
                $imageName = uniqid() . '' . time() . '.webp';

                // Resize fit center and compres image
                $resizedImage = Image::make($image)
                ->fit(400, 400)
                ->encode('webp', 80);

                // Save iamge after resize, compres, and change format to webp format
                $resizedImage->save(public_path('images/users/' . $imageName));
                $user->avatar = $imageName;
            }
            $user->syncRoles($dataUser['role_id']);
            $user->save();

            $request->session()->flash('success', "Update data user successfully!");
            return redirect(route('users.index'));
        } catch (\Throwable $th) {
            $request->session()->flash('failed', "Failed to update data user!");
            return redirect(route('users.index'));
        }
    }

    public function getModalDelete($userId)
    {
        $user = User::findOrFail($userId);
        return View::make('admin.user.modal-delete')->with('user', $user);
    }

    public function destroy(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $user->delete();

            $request->session()->flash('success', "Delete data user successfully!");
        } catch (ModelNotFoundException $e) {
            $request->session()->flash('failed', "User not found!");
        } catch (QueryException $e) {
            $request->session()->flash('failed', "Failed to delete data user!");
        }

        return redirect(route('users.index'));
    }
}
