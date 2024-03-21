# E-Commerce Backend y Admin

Este proyecto consta de dos partes principales: un backend API construido con Laravel 9 y un panel de administración construido con Next.js y la librería Sakai de React con typeScript.

## Backend

El backend es una API RESTful construida con Laravel 9. Se encarga de manejar toda la lógica de negocio, incluyendo la autenticación, gestión de productos, categorías, marcas y demás funcionalidades necesarias para un e-commerce.

### Requisitos

- PHP >= 8.0
- Composer
- MySQL o PostgreSQL

### Instalación

1. Clona el repositorio: `git clone https://github.com/Carrillo-Jesus/ecommerce-react-laravel`
2. Navega al directorio del proyecto: `cd ecommerce-react-laravel`
3. Instala las dependencias del backend: `cd backend y composer install`
4. Copia el archivo `.env.example` a `.env` y configura las variables de entorno según tus necesidades.
5. Genera la clave de aplicación: `php artisan key:generate`
6. Ejecuta las migraciones y seeders: `php artisan migrate --seed`
7. Inicia el servidor de desarrollo: `php artisan serve`

El backend estará disponible en `http://localhost:8000`.

## Admin

El panel de administración está construido con Next.js y la librería Sakai de React. Permite gestionar todos los aspectos del e-commerce, como productos, categorías, marcas, pedidos, usuarios, etc.

### Requisitos

- Node.js >= 18.0.0
- npm

### Instalación

1. Navega al directorio del proyecto: `cd admin`
2. Instala las dependencias: `npm install`
3. Copia y configura las variables de entorno según tus necesidades.
4. Inicia el servidor de desarrollo: `npm run dev`
5. sakai te da muchos componentes y puedes personalizar este proyeycto como quieras

El panel de administración estará disponible en `http://localhost:3000`.

## Autenticación

Tanto el backend como el admin utilizan el sistema de autenticación incluido en Laravel (sanctum).

## Licencia

Este proyecto está bajo la Licencia MIT.