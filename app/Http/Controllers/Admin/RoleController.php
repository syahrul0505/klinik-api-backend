<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\AddRoleRequest;
use App\Http\Requests\Admin\Role\UpdateRoleRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\View;
use Spatie\Permission\Models\Permission;
use Yajra\DataTables\Facades\DataTables;

class RoleController extends Controller
{
    function __construct()
    {
        $this->middleware('permission:role-list', ['only' => ['index', 'getRoles', 'updatePermissionByID', 'updateAllPermissions']]);
        $this->middleware('permission:role-create', ['only' => ['getModalAdd','store']]);
        $this->middleware('permission:role-edit', ['only' => ['getModalEdit','update']]);
        $this->middleware('permission:role-delete', ['only' => ['getModalDelete','destroy']]);
    }

    public function index()
    {
        $data['page_title'] = 'Role List';
        $data['roles'] = Role::orderby('id', 'asc')->get();
        return view('admin.role.index', $data);
    }

    public function getRoles(Request $request)
    {
        // if ($request->ajax()) {
        //     // return DataTables::of(Role::query())
        //     // ->addIndexColumn()
        //     // ->addColumn('action', function ($row) {
        //     //     $btn = '<button type="button" class="btn btn-sm btn-warning roles-edit-table" data-bs-target="#tabs-'.$row->id.'-edit-role">Edit</button>';
        //     //     $btn = $btn . ' <button type="button" class="btn btn-sm btn-danger roles-delete-table"  data-bs-target="#tabs-'.$row->id.'-delete-role">Delete</button>';
        //     //     return $btn;
        //     // })
        //     // ->rawColumns(['action'])
        //     // ->make(true);
        // }

        try {
            $data['roles'] = Role::with('permissions:id,name')->orderBy('id', 'asc')->select('id', 'name')->get();
            $data['permissions'] = Permission::orderBy('id', 'asc')->select('id', 'name')->get();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getModalAdd()
    {
        return View::make('admin.role.modal-add');
    }

    public function store(AddRoleRequest $request)
    {
        $dataRole = $request->validated();

        try {
            $role = new Role();
            $role->name = $dataRole['name'];
            $role->guard_name = 'web';
            $role->save();

            $request->session()->flash('success', "Create data role successfully!");
            return redirect(route('roles.index'));
        } catch (\Throwable $th) {
            $request->session()->flash('failed', "Failed to create data role!");
            return redirect(route('roles.index'));
        }
    }

    public function getModalEdit($roleId)
    {
        $role = Role::findOrFail($roleId);
        return View::make('admin.role.modal-edit')->with('role', $role);
    }

    public function update(UpdateRoleRequest $request, $roleId)
    {
        $dataRole = $request->validated();
        try {
            $role = Role::find($roleId);

            // Check if role doesn't exists
            if (!$role) {
                $request->session()->flash('failed', "Role not found!");
                return redirect()->back();
            }

            $role->name = $dataRole['name'];
            $role->save();

            $request->session()->flash('success', "Update data role successfully!");
            return redirect(route('roles.index'));
        } catch (\Throwable $th) {
            $request->session()->flash('failed', "Failed to update data role!");
            return redirect(route('roles.index'));
        }
    }

    public function getModalDelete($roleId)
    {
        $role = Role::findOrFail($roleId);
        return View::make('admin.role.modal-delete')->with('role', $role);
    }

    public function destroy(Request $request, $roleId)
    {
        try {
            $role = Role::findOrFail($roleId);
            $role->delete();

            $request->session()->flash('success', "Delete data role successfully!");
        } catch (ModelNotFoundException $e) {
            $request->session()->flash('failed', "Role not found!");
        } catch (QueryException $e) {
            $request->session()->flash('failed', "Failed to delete data role!");
        }

        return redirect(route('roles.index'));
    }

    public function updatePermissionByID(Request $request)
    {
        try {
            // Get data from AJAX Post
            $roleId = $request->input('roleId');
            $permissionId = $request->input('permissionId');
            $isChecked = $request->input('isChecked');

            // Find role and permission by Id
            $role = Role::findOrFail($roleId);
            $permission = Permission::findOrFail($permissionId);

            // Update relation role and permission by checkbox
            if ($isChecked == "true") {
                $role->permissions()->attach($permission);
            } else {
                $role->permissions()->detach($permission);
            }

            // Kirim respons ke klien (jika diperlukan)
            return response()->json(['message' => 'Permission updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Permission updated failed', 'error' => $th->getMessage()]);
        }
    }

    public function updateAllPermissions(Request $request)
    {
        // Validation Data
        $request->validate([
            'roleId' => 'required|exists:roles,id',
            'status' => 'required',
        ]);

        try {
            // Get Role By ID
            $role = Role::findOrFail($request->roleId);

            if ($request->status == 'true') {
                // Check status True add all permission
                $role->givePermissionTo(Permission::all());
            } else {
                // Check status False delete all permission
                $role->revokePermissionTo(Permission::all());
            }

            return response()->json(['message' => 'Permissions updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update permissions'], 500);
        }
    }

}
