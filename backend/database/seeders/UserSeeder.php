<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::Create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => '$2y$10$Z8H3LrAh9hKotAvk5gsTXuZPRggklyNvguk2T/YV6pje5bdr4gkeC',
            'state' => 1,
        ])->assignRole('admin');

        User::factory()->count(3)->create();
    }
}
