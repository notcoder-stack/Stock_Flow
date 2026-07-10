import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import ProductModal from "../components/ProductModal.jsx";
import Rating from "../components/Rating.jsx";
import { Link, router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCirclePlus, IconEdit, IconTrash, IconSearch,
    IconPackage, IconStar, IconAlertTriangle,
} from "@tabler/icons-react";

function StockBadge({ qty }) {
    if (qty === 0) return (
        <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
            <IconAlertTriangle size={10} stroke={2} /> Out of stock
        </span>
    );
    if (qty < 10) return (
        <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
            <IconAlertTriangle size={10} stroke={2} /> Low stock
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
            In stock
        </span>
    );
}

export default function Products({ products, filters }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState(filters?.search || "");
    const [minRating, setMinRating] = useState(filters?.min_rating || "");
    const [maxPrice, setMaxPrice] = useState(filters?.max_price || "");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const isInitialRender = useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                "/products",
                { search, min_rating: minRating, max_price: maxPrice },
                { preserveState: true, preserveScroll: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, minRating, maxPrice]);

    if (!products) return (
        <div className="text-center text-red-500 py-10">Failed to fetch products</div>
    );



    const openModal = (product = null) => {
        setSelectedProduct(product);
        open();
    };

    const handleDelete = (id) => {
        if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
        router.delete(`/products/${id}`, {
            onSuccess: () => { setDeleteConfirm(null); router.reload(); },
            onError: () => console.log("failed to delete product"),
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Header name="Products" subtitle={`${products.data.length} products in inventory`} />
                <button
                    onClick={() => openModal(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
                               text-white text-sm font-medium rounded-xl shadow-sm transition-colors shrink-0"
                >
                    <IconCirclePlus size={18} stroke={2} />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
                                   text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2
                                   focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    />
                </div>
                
                <select
                    value={minRating}
                    onChange={e => setMinRating(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                </select>

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-32 pl-7 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
                                   text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2
                                   focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    />
                </div>
                
                {(search || minRating || maxPrice) && (
                    <button
                        onClick={() => { setSearch(""); setMinRating(""); setMaxPrice(""); }}
                        className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Product grid */}
            {products.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <IconPackage size={48} stroke={1} />
                    <p className="text-base font-medium mt-3">No products found</p>
                    <p className="text-sm mt-1">Try different filters or add a new product</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.data.map((product) => (
                        <div key={product.id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
                                       hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <div className="h-40 bg-slate-50 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name}
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <IconPackage size={48} stroke={1} className="text-slate-300" />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</h3>
                                    <span className="text-sm font-bold text-indigo-600 shrink-0">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <StockBadge qty={product.stockQuantity} />
                                    <span className="text-xs text-slate-400">{product.stockQuantity} units</span>
                                </div>
                                {product.rating > 0 && (
                                    <div className="flex gap-0.5 mb-3">
                                        <Rating rating={product.rating} />
                                    </div>
                                )}
                                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50
                                                   hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                                    >
                                        <IconEdit size={13} stroke={2} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-colors
                                            ${deleteConfirm === product.id
                                                ? "bg-red-500 text-white"
                                                : "bg-slate-50 hover:bg-red-50 text-red-500"}`}
                                    >
                                        <IconTrash size={13} stroke={2} />
                                        {deleteConfirm === product.id ? "Confirm?" : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center gap-1 pt-2">
                {products.links.map((link) =>
                    link.url ? (
                        <Link
                            key={link.label}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${link.active
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"}`}
                        />
                    ) : (
                        <span
                            key={link.label}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="px-3 py-1.5 text-sm text-slate-300"
                        />
                    )
                )}
            </div>

            <ProductModal isOpen={opened} onClose={close} product={selectedProduct} />
        </div>
    );
}
