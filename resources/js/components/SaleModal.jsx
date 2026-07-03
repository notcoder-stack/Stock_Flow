import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Button, Input, Modal } from "@mantine/core";

export default function SaleModal({ isOpen, onClose, sale }) {
    const [formData, setFormData] = useState({
        productName: "",
        quantity: 0,
        price: 0,
        revenue: 0,
        date: "",
    });

    useEffect(() => {
        if (sale) {
            setFormData({
                productName: sale.productName,
                quantity: sale.quantity,
                price: sale.price,
                revenue: sale.revenue,
                date: sale.date,
            });
        } else {
            setFormData({
                productName: "",
                quantity: "",
                price: "",
                revenue: "",
                date: "",
            });
        }
    }, [sale]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("productName", formData.productName);
        data.append("quantity", formData.quantity);
        data.append("price", formData.price);
        data.append("revenue", formData.revenue);
        data.append("date", formData.date);
        if (sale?.id) {
            data.append("_method", "PUT");
            router.post(`/sales/${sale.id}`, data, {
                onSuccess: () => {
                    onClose();
                    router.reload();
                },
                onError: (errors) => {
                    console.error(errors.message || "Failed to submit sale");
                },
            });
        } else {
            router.post("/sales", data, {
                onSuccess: () => {
                    onClose();
                    router.reload();
                },
                onError: (errors) => {
                    console.error(errors.message || "Failed to submit sale");
                },
            });
        }
    };

    return (
        <Modal opened={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="mt-5">
                <label htmlFor="productName">Product Name</label>
                <Input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className="block w-full mb-2 p-2"
                    required
                />
                <label htmlFor="quantity">Quantity</label>
                <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="block w-full mb-2 p-2"
                    required
                />
                <label htmlFor="price">Price</label>
                <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="block w-full mb-2 p-2"
                    required
                />
                <label htmlFor="revenue">Revenue</label>
                <Input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleChange}
                    className="block w-full mb-2 p-2"
                    required
                />
                <label htmlFor="date">Date</label>
                <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full mb-2 p-2"
                    required
                />
                <Button
                    variant="default"
                    type="submit"
                    className="mt-4 px-4 py-2"
                >
                    Submit
                </Button>
            </form>
        </Modal>
    );
}
