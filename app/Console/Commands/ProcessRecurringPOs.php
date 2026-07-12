<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessRecurringPOs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'po:process-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate new Purchase Orders from templates that are due';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $templates = \App\Models\Purchase_Order::where('is_template', true)
            ->whereNotNull('next_run_at')
            ->where('next_run_at', '<=', now())
            ->get();

        $count = 0;
        foreach ($templates as $template) {
            // Generate a new PO
            $newPo = $template->replicate();
            $newPo->is_template = false;
            $newPo->recurrence_interval = null;
            $newPo->next_run_at = null;
            $newPo->status = 'draft'; // Or 'submitted' depending on logic
            $newPo->ordered_at = now();
            $newPo->received_at = null;
            $newPo->save();

            // Clone items
            foreach ($template->items as $item) {
                $newItem = $item->replicate();
                $newItem->purchase_order_id = $newPo->id;
                $newItem->quantity_received = 0;
                $newItem->save();
            }

            // Update next_run_at on template
            if ($template->recurrence_interval == 'daily') {
                $template->next_run_at = Carbon\Carbon::parse($template->next_run_at)->addDay();
            } elseif ($template->recurrence_interval == 'weekly') {
                $template->next_run_at = Carbon\Carbon::parse($template->next_run_at)->addWeek();
            } elseif ($template->recurrence_interval == 'monthly') {
                $template->next_run_at = Carbon\Carbon::parse($template->next_run_at)->addMonth();
            }
            $template->save();
            $count++;
        }

        $this->info("Processed {$count} recurring Purchase Orders.");
    }
}
