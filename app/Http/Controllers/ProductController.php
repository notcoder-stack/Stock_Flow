<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'min_rating', 'max_price']);

        $products = Product::latest()
            ->filter($filters)
            ->paginate(6)
            ->withQueryString();

        return Inertia::render("Products", [
            "products" => $products,
            "filters" => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     * @param ProductRequest $request
     * @return \Illuminate\Http\RedirectResponce
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "price" => "required|integer|min:0",
            "stockQuantity" => "required|integer|min:1",
            "rating" => "required|integer|min:1",
            "image" => "nullable|image|max:2048",
        ]);

        $data = $request->only(["name", "price", "stockQuantity", "rating"]);

        if ($request->hasFile("image")) {
            $file = $request->file("image");
            $filename = time() . "_" . $file->getClientOriginalName();
            $path = $file->storeAs("uploads", $filename, "public");
            $data["image"] = "/storage/" . $path;
        }

        Product::create($data);
        return to_route("products.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "price" => "required|integer|min:0",
            "stockQuantity" => "required|integer|min:1",
            "rating" => "required|integer|min:1",
            "image" => "nullable|image|max:2048",
        ]);

        $data = $request->only(["name", "price", "stockQuantity", "rating"]);

        if ($request->hasFile("image")) {
            $file = $request->file("image");
            $filename = time() . "_" . $file->getClientOriginalName();
            $path = $file->storeAs("uploads", $filename, "public");
            $data["image"] = "/storage/" . $path;
        }

        $product->update($data);
        return to_route("products.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return to_route("products.index");
    }
}
