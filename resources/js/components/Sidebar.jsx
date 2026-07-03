import {
    IconForklift,
    IconClipboard,
    IconUser,
    IconCoins,
    IconAdjustmentsHorizontal,
    IconLayoutDashboard,
    IconLogout,
} from "@tabler/icons-react";
import { Group } from "@mantine/core";
import classes from "../../css/Sidebar.module.css";
import { Link, usePage, router } from "@inertiajs/react";

const data = [
    { link: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
    { link: "/products", label: "Products", icon: IconClipboard },
    { link: "/sales", label: "Sales", icon: IconCoins },
    { link: "/suppliers", label: "Suppliers", icon: IconForklift },
    { link: "/employees", label: "Employees", icon: IconUser },
    { link: "/settings", label: "Settings", icon: IconAdjustmentsHorizontal },
];

export default function Sidebar() {
    const { url } = usePage();

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const links = data.map((item) => (
        <Link
            className={classes.link}
            href={item.link}
            key={item.label}
            data-active={url.startsWith(item.link) || undefined}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header}>
                    <h1>STOCKFLOW</h1>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <Link
                    className={classes.link}
                    href="/logout"
                    onClick={handleLogout}
                    as="button"
                    method="post"
                >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </Link>
                <span>&copy; 2025 STOCKFLOW</span>
            </div>
        </nav>
    );
}
