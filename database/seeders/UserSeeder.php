<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
           User::updateOrCreate(
                    ['email' => encrypt('superadmin@gmail.com')],
                    [
                        'name'      => 'super admin',
                        'password'  => Hash::make('superadmin'),
                        'role'      => 'admin'
                    ]
                );
            echo 'Admin user created' . PHP_EOL;

        } catch (\Throwable $th) {
            // Create message with echo
            echo 'Error : ' . $th->getMessage();
        }
    }
}
