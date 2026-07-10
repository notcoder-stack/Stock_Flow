<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;

Route::get("/", [HomePageController::class, "index"]);

Route::get("/register", [RegisterController::class, "index"]);
Route::post("/register", [RegisterController::class, "store"])->name("register");

Route::get("/login", [LoginController::class, "index"])->name("login");
Route::post("/login", [LoginController::class, "store"]);
Route::post("/logout", [LoginController::class, "destroy"])->name("logout");

Route::get("/forgot-password", [PasswordResetController::class, "create"])->name("password.request");
Route::post("/forgot-password", [PasswordResetController::class, "store"])->name("password.email");
Route::get("/reset-password/{token}", [PasswordResetController::class, "edit"])->name("password.reset");
Route::post("/reset-password", [PasswordResetController::class, "update"])->name("password.update");

Route::middleware("auth")->group(function () {
    Route::get("/dashboard", [DashboardController::class, "index"])->name(
        "dashboard"
    );

    Route::resource("products", ProductController::class);
    Route::resource("sales", SaleController::class);
    Route::resource("suppliers", SupplierController::class);
    Route::resource("employees", EmployeeController::class);

    Route::put("/settings/password", [SettingsController::class, "updatePassword"])->name("settings.password");
    Route::delete("/settings/account", [SettingsController::class, "destroyAccount"])->name("settings.account.destroy");
    Route::get("/settings", [SettingsController::class, "index"])->name(
        "settings.index"
    );
});
