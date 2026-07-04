import { StatsGrid } from "../components/StatsGrid";
import Header from "../components/Header";
import RevenueChart from "../components/RevenueChart";
import RecentSales from "../components/RecentSales";

export default function Dashboard({ employees, sales, products, revenue, recentSales, monthlySales }) {
    return (
        <div className="space-y-6">
            <Header
                name="Dashboard"
                subtitle={`Welcome back! Here's what's happening today.`}
            />

            {/* Stats */}
            <StatsGrid sums={[revenue, sales, products, employees]} />

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                    <RevenueChart data={monthlySales || []} />
                </div>
                <div>
                    <RecentSales sales={recentSales || []} />
                </div>
            </div>
        </div>
    );
}
