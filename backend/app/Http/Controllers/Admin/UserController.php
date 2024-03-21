<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $pageSize = $request->limit ?? 50;
        $page = $request->page ?? 1;
        $orderBy = $request->order_by ?? 'id';
        $sort = $request->sort ?? 'desc';

        $users = User::with('roles')->where(
                            function($query) use ($request) {
                                if($request->search){
                                    $query->where('name', 'LIKE', "%{$request->search}%")
                                    ->orWhere('email', 'LIKE', "%{$request->search}%");
                                }
                            })
                            ->whereNull('deleted_at')
                            ->orderBy($orderBy, $sort)
                            ->paginate($pageSize, page: $page);

        foreach($users as &$user) {
            if (isset($user['roles']) && count($user['roles']) > 0) {
                [$role] = $user['roles'];
                $user['role'] = $role;
              } else {
                $user['role'] = new \stdClass();
              }
              unset($user['roles']);
        }
        return response()->json( [
        'status' => 1,
          'users' => $users->items(),
          'meta' => [
            'page' => $users->currentPage(),
            'pages' => $users->lastPage(),
            'limit' => $users->perPage(),
            'total' => $users->total(),
          ]
        ], Response::HTTP_OK);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'state' => $request->state,
        ]);

        if(isset($request->role['name'])) {
            $user->roles()->detach();
            $user->assignRole($request->role['name']);
        }

        return response()->json(['status' => 1, 'message' => 'Usuario actualizado correctamente'], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {

    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if(!$user)  return response()->json(['status' => 0, 'message' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id, 'id')],
        ]);

        if(isset($request->role['name'])) {
            $user->roles()->detach();
            $user->assignRole($request->role['name']);
        }

        $user->fill($request->only('name', 'email', 'state'))->save();

        return response()->json(['status' => 1, 'message' => 'Usuario actualizado correctamente'], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        //
    }
}
