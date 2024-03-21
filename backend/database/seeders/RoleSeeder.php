<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = Role::create(['name' => 'admin']);
        $moderator = Role::create(['name' => 'moderator']);
        $editor = Role::create(['name' => 'editor']);

        Permission::create(['name' => 'add_product'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_product'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_product'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_product'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_category'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_category'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_category'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_category'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_brand'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_brand'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_brand'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_brand'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_discount'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_discount'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_discount'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_discount'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_sale'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_sale'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_sale'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_sale'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_user'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_user'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_user'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_user'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_collection'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_collection'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_collection'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_collection'])->syncRoles([$admin, $moderator, $editor ]);

        Permission::create(['name' => 'add_setting'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'edit_setting'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'show_setting'])->syncRoles([$admin, $moderator, $editor ]);
        Permission::create(['name' => 'delete_setting'])->syncRoles([$admin, $moderator, $editor ]);
    }
}
