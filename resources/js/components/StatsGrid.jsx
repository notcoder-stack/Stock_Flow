import {
    IconArrowDownRight,
    IconArrowUpRight,
    IconCoin,
    IconDiscount2,
    IconReceipt2,
    IconUserPlus,
} from "@tabler/icons-react";
import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import classes from "../../css/StatsGrid.module.css";

const icons = {
    user: IconUserPlus,
    discount: IconDiscount2,
    receipt: IconReceipt2,
    coin: IconCoin,
};

const labels = [
    { title: "Revenue", icon: "receipt" },
    { title: "Sales", icon: "coin" },
    { title: "Products", icon: "discount" },
    { title: "Employees", icon: "user" },
];

export function StatsGrid({ sums = [] }) {
    const stats = labels.map((stat, index) => {
        const Icon = icons[stat.icon];
        const value = sums[index] ?? 0;

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                    <Text size="xs" c="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon className={classes.icon} size={22} stroke={1.5} />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text className={classes.value}>{value}</Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    Total count
                </Text>
            </Paper>
        );
    });
    return (
        <div className={classes.root}>
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
        </div>
    );
}
