<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\AppPasswordController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\ViewController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/settings.php';

Route::middleware(['auth', 'web'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('system', [SystemController::class, 'index'])->name('system.index');
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    Route::get('api-keys', [ApiKeyController::class, 'index'])->name('api-keys.index');
    Route::post('api-keys', [ApiKeyController::class, 'store'])->name('api-keys.store');
    Route::post('api-keys/{id}/revoke', [ApiKeyController::class, 'revoke'])->name('api-keys.revoke');
    Route::delete('api-keys/{id}', [ApiKeyController::class, 'destroy'])->name('api-keys.destroy');

    Route::get('app-password/status', [AppPasswordController::class, 'status'])->name('app-password.status');
    Route::post('app-password/confirm', [AppPasswordController::class, 'confirm'])->name('app-password.confirm');

    // * Admins
    Route::get('admins', [AdminController::class, 'index'])->name('admins.index');
    Route::get('admins/create', [AdminController::class, 'create'])->name('admins.create');
    Route::post('admins', [AdminController::class, 'store'])->name('admins.store');
    Route::post('admins/bulk-destroy', [AdminController::class, 'bulkDestroy'])->name('admins.bulk-destroy');
    Route::post('admins/bulk-duplicate', [AdminController::class, 'bulkDuplicate'])->name('admins.bulk-duplicate');
    Route::get('admins/export', [AdminController::class, 'export'])->name('admins.export');
    Route::post('admins/import', [AdminController::class, 'import'])->name('admins.import');
    Route::get('admins/trash', [AdminController::class, 'trash'])->name('admins.trash');
    Route::post('admins/trash/{admin}/restore', [AdminController::class, 'restore'])->name('admins.trash.restore');
    Route::delete('admins/trash/{admin}', [AdminController::class, 'forceDelete'])->name('admins.trash.forceDelete');
    Route::get('admins/{admin}', [AdminController::class, 'edit'])->name('admins.edit');
    Route::put('admins/{admin}', [AdminController::class, 'update'])->name('admins.update');
    Route::delete('admins/{admin}', [AdminController::class, 'destroy'])->name('admins.destroy');

    // * Roles & permissions
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('roles/permissions-catalog', [RoleController::class, 'permissionsCatalog'])->name('roles.permissions-catalog');
    Route::get('roles/{role}/permissions-data', [RoleController::class, 'permissionsData'])->name('roles.permissions-data');
    Route::put('roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('roles.permissions.update');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    // * File manager
    Route::get('file-manager', [FileController::class, 'index'])->name('files.index');
    Route::get('file-manager/trash', [FileController::class, 'trash'])->name('files.trash');
    Route::get('file-manager/picker', [FileController::class, 'picker'])->name('files.picker');
    Route::delete('file-manager/cache', [FileController::class, 'clearCache'])->name('files.cache.clear');
    Route::post('file-manager', [FileController::class, 'store'])->name('files.store');
    Route::post('file-manager/folders', [FileController::class, 'storeFolder'])->name('files.folders.store');
    Route::get('file-manager/{id}/thumbnail', [FileController::class, 'thumbnail'])->name('files.thumbnail');
    Route::get('file-manager/{id}/download', [FileController::class, 'download'])->name('files.download');
    Route::get('file-manager/download-zip', [FileController::class, 'downloadZip'])->name('files.download-zip');
    Route::get('file-manager/tree', [FileController::class, 'folderTree'])->name('files.tree');
    Route::get('file-manager/{id}/permissions', [FileController::class, 'permissions'])->name('files.permissions');
    Route::post('file-manager/{id}/permissions', [FileController::class, 'updatePermissions'])->name('files.permissions.update');
    Route::post('file-manager/move', [FileController::class, 'move'])->name('files.move');
    Route::post('file-manager/duplicate', [FileController::class, 'duplicate'])->name('files.duplicate');
    Route::post('file-manager/compress', [FileController::class, 'compress'])->name('files.compress');
    Route::post('file-manager/{id}/extract', [FileController::class, 'extract'])->name('files.extract');
    Route::post('file-manager/{id}/restore', [FileController::class, 'restore'])->name('files.restore');
    Route::patch('file-manager/{file}', [FileController::class, 'update'])->name('files.update');
    Route::delete('file-manager/{file}', [FileController::class, 'destroy'])->name('files.destroy');
    Route::post('file-manager/bulk-destroy', [FileController::class, 'bulkDestroy'])->name('files.bulk-destroy');
    Route::delete('file-manager/{id}/force', [FileController::class, 'forceDestroy'])->name('files.force-destroy');
});

// * Generic headless content API — any App\Models\* model using the QueryBuilder concern is addressable here.
Route::middleware(['web', 'auth'])->get('source/{resource}/{field?}', [ItemController::class, 'source'])->name('items.source');

Route::middleware(['web', 'auth'])->prefix('items')->group(function () {
    Route::get('{resource}/export', [ItemController::class, 'export'])->name('items.export');
    Route::post('{resource}/import', [ItemController::class, 'import'])->name('items.import');
    Route::post('{resource}/dashboards', [ItemController::class, 'dashboards'])->name('items.dashboards');
    Route::get('{resource}/options/{field}', [ItemController::class, 'options'])->name('items.options');

    Route::get('{resource}/{id}/frontend-url', [ItemController::class, 'frontendUrl'])->name('items.frontend-url');
    Route::get('{resource}/{id}/index-status', [ItemController::class, 'indexStatus'])->name('items.index-status');
    Route::post('{resource}/{id}/restore', [ItemController::class, 'restore'])->name('items.restore');
    Route::delete('{resource}/{id}/force', [ItemController::class, 'forceDestroy'])->name('items.force-destroy');

    Route::get('{resource}', [ItemController::class, 'index'])->name('items.index');
    Route::post('{resource}', [ItemController::class, 'store'])->name('items.store');
    Route::get('{resource}/{idOrSlug}', [ItemController::class, 'show'])->name('items.show');
    Route::put('{resource}/{id}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('{resource}/{id}', [ItemController::class, 'destroy'])->name('items.destroy');
});

Route::middleware(['api'])->prefix('api/items')->group(function () {
    Route::get('{resource}', [ItemController::class, 'index'])->name('api.items.index');
    Route::post('{resource}', [ItemController::class, 'store'])->name('api.items.store');
    Route::get('{resource}/{idOrSlug}', [ItemController::class, 'show'])->name('api.items.show');
    Route::put('{resource}/{id}', [ItemController::class, 'update'])->name('api.items.update');
    Route::delete('{resource}/{id}', [ItemController::class, 'destroy'])->name('api.items.destroy');
});

// * Catch-all last: any App\Models\* resource gets a generic admin page without extra routing.
Route::middleware(['auth', 'web'])->get('{collection}/{slug?}', [ViewController::class, 'handler'])
    ->where('collection', '[^/]+')
    ->name('view.page');
