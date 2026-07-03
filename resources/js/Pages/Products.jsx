import { useState } from "react";
import Header from "../components/Header.jsx";
import { IconCirclePlus } from "@tabler/icons-react";
import Rating from "../components/Rating.jsx";
import ProductModal from "../components/ProductModal.jsx";
import { Link, router } from "@inertiajs/react";
import { Card, Image, Text, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
export default function Products({ products }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const openModal = (product = null) => {
        setSelectedProduct(product);
        open();
    };
    if (!products) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to fetch products
            </div>
        );
    }
    const handleDelete = (id) => {
        router.delete(`/products/${id}`, {
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                console.log("failed to delete product");
            },
        });
    };
    return (
        <div className="mx-auto pb-5 w-full">
            {/* Header Bar */}
            <div className="flex justify-between items-center mb-6">
                <Header name="Products" />
                <Button
                    variant="default"
                    onClick={() => {
                        setSelectedProduct(null);
                        open();
                    }}
                >
                    <IconCirclePlus className="w-5 h-5 mr-2 !text-gray-200" />
                    Create Product
                </Button>
            </div>
            {/* Products List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
                {products.data.map((product) => (
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        key={product.id}
                    >
                        <Card.Section>
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    height={160}
                                    alt={product.name}
                                />
                            ) : (
                                "No Image"
                            )}
                        </Card.Section>

                        <div className="flex flex-col items-center">
                            <Text fw={500}>{product.name}</Text>
                            <Text size="sm" c="dimmed">
                                ${product.price.toFixed(2)}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Stock: {product.stockQuantity}
                            </Text>
                            {product.rating && (
                                <div className="flex items-center mt-2">
                                    <Rating rating={product.rating} />
                                </div>
                            )}
                        </div>

                        <div className="items-inline mt-6 flex justify-between gap-4">
                            <Button
                                variant="filled"
                                onClick={() => openModal(product)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="danger"
                                onClick={() => handleDelete(product.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
            {/* Pagination */}
            <div className="py-12 px-4">
                {products.links.map((link) =>
                    link.url ? (
                        <Link
                            key={link.label}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`p-1 mx-1 ${link.active ? "text-blue-500 font-bold" : ""}`}
                        />
                    ) : (
                        <span
                            key={link.label}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="p-1 mx-1 text-slate-300"
                        ></span>
                    ),
                )}
            </div>
            {/* Modal */}
            <ProductModal
                isOpen={opened}
                onClose={close}
                product={selectedProduct}
            />
        </div>
    );
}
