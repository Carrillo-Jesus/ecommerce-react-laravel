<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Brand;
use App\Models\Collection;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->words(3, true),
            'handle' => $this->faker->unique()->slug(2),
            'sku' => $this->faker->unique()->numberBetween(100000, 999999),
            'description' => $this->faker->paragraphs(3, true),
            'cost' => $this->faker->randomFloat(2, 0, 100),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'stock' => $this->faker->numberBetween(5, 1000),
            'brand_id' => Brand::factory(),
            'featured' => $this->faker->randomElement([true, false]),
            'tax_rate' => $this->faker->randomFloat(2, 0, 30),
            'shipping_required' => $this->faker->randomElement([true, false]),
            'free_shipping' => $this->faker->randomElement([true, false]),
            'images' => implode(',', $this->faker->randomElements(['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'], $this->faker->numberBetween(1,5))),
            'collection_id' => Collection::factory(),
            'is_active' => $this->faker->randomElement([true, false]),
            'is_giftcard' => $this->faker->randomElement([true, false]),
        ];
    }
}
