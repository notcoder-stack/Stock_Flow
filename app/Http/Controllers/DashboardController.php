<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $products  = Product::count();
        $sales     = Sale::count();
        $employees = Employee::count();
        $revenue   = Sale::sum('revenue');

        // Recent 5 sales for the dashboard widget
        $recentSales = Sale::orderByDesc('created_at')
            ->limit(5)
            ->get(['productName', 'revenue', 'date']);

        // Monthly revenue for current year chart (DB-agnostic via Carbon)
        $year = now()->year;
        $allSales = Sale::whereYear('date', $year)->get(['revenue', 'date']);
        $monthlyRaw = $allSales->groupBy(fn ($s) => \Carbon\Carbon::parse($s->date)->format('m'))
            ->map(fn ($group) => $group->sum('revenue'));

        $months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        $monthlySales = collect(range(1, 12))->map(function ($m) use ($monthlyRaw, $months) {
            $key = str_pad($m, 2, '0', STR_PAD_LEFT);
            return [
                'month'   => $months[$m - 1],
                'revenue' => (int) ($monthlyRaw[$key] ?? 0),
            ];
        })->values();

        return Inertia::render('Dashboard', [
            'products'     => $products,
            'sales'        => $sales,
            'employees'    => $employees,
            'revenue'      => $revenue,
            'recentSales'  => $recentSales,
            'monthlySales' => $monthlySales,
        ]);
    }
}
