import { MantineProvider } from "@mantine/core";
import DashboardWrapper from "../dashboardWrapper";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

export default function Layout({ children }) {
    return (
        <MantineProvider>
            <DashboardWrapper>{children}</DashboardWrapper>
        </MantineProvider>
    );
}
