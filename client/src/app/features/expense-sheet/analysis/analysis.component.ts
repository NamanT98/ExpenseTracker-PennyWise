import {
  Component, Input, OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Transaction, DateRange } from '../models';
import { SheetBudget } from '../../../features/home/models';
import { CATEGORY_ICONS } from '../constants';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface CategoryAnalysis {
  icon: string;
  name: string;
  limit: number | null;
  spent: number;
  percent: number;
  isOver: boolean;
  isNear: boolean;
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, CurrencyPipe],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() transactions: Transaction[] = [];
  @Input() budget?: SheetBudget;
  @Input() period: DateRange = 'this_month';
  @Input() sheetCreatedAt?: string;

  @ViewChild('donutCanvas')  donutCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('spendCanvas')  spendCanvas?: ElementRef<HTMLCanvasElement>;

  private donutChart?: Chart;
  private spendChart?: Chart;
  private viewReady = false;

  // Derived data
  categoryAnalysis: CategoryAnalysis[] = [];
  totalSpent = 0;
  totalReceived = 0;
  netBalance = 0;
  budgetPercent = 0;
  scaledGlobalLimit = 0;
  isBudgetOver = false;
  isBudgetNear = false;

  // Category spend (actual expenses from transactions, by transaction category key)
  private categorySpend = new Map<string, number>();

  // Chart colour palette
  private readonly PALETTE = [
    '#f65e3c','#9cbea6','#4f86c6','#f59e0b','#8b5cf6',
    '#ec4899','#10b981','#3b82f6','#f97316','#14b8a6'
  ];

  ngOnChanges(changes: SimpleChanges) {
    this.compute();
    if (this.viewReady) {
      setTimeout(() => { this.buildDonutChart(); this.buildSpendChart(); }, 50);
    }
  }

  ngAfterViewInit() {
    this.viewReady = true;
    setTimeout(() => { this.buildDonutChart(); this.buildSpendChart(); }, 100);
  }

  ngOnDestroy() {
    this.donutChart?.destroy();
    this.spendChart?.destroy();
  }

  private compute() {
    // Aggregate spend by tx category key
    this.categorySpend.clear();
    this.totalSpent = 0;
    this.totalReceived = 0;

    // Filter transactions based on period for analysis
    const now = new Date();
    let startDate = new Date(0);
    let endDate = new Date(now);
    if (this.period !== 'all') {
      startDate = new Date();
      if (this.period === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (this.period === '1month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      } else if (this.period === '3months') {
        startDate.setMonth(now.getMonth() - 3);
      } else if (this.period === '6months') {
        startDate.setMonth(now.getMonth() - 6);
      } else if (this.period === 'this_week') {
        const day = now.getDay() || 7;
        startDate.setDate(now.getDate() - day + 1);
        startDate.setHours(0,0,0,0);
      } else if (this.period === 'last_week') {
        const day = now.getDay() || 7;
        startDate.setDate(now.getDate() - day - 6);
        startDate.setHours(0,0,0,0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      } else if (this.period === '4weeks') {
        startDate.setDate(now.getDate() - 28);
      } else if (this.period === '12weeks') {
        startDate.setDate(now.getDate() - 84);
      } else if (this.period === 'this_year') {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else if (this.period === 'last_year') {
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      } else if (this.period === '3years') {
        startDate.setFullYear(now.getFullYear() - 3);
      }
    }

    const filteredTxs = this.transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    for (const t of filteredTxs) {
      if (t.type === 'SENT') {
        this.totalSpent += t.amount;
        const key = t.category.toLowerCase();
        this.categorySpend.set(key, (this.categorySpend.get(key) ?? 0) + t.amount);
      } else {
        this.totalReceived += t.amount;
      }
    }
    this.netBalance = this.totalReceived - this.totalSpent;

    // Map budget categories → analysis rows
    if (this.budget) {
      let multiplier = 1;
      const freq = this.budget.frequency;
      
      if (freq === 'monthly') {
        if (this.period === '3months') multiplier = 3;
        else if (this.period === '6months') multiplier = 6;
        else if (this.period === 'all') {
          multiplier = this.sheetCreatedAt ? Math.max(1, (now.getFullYear() - new Date(this.sheetCreatedAt).getFullYear()) * 12 + (now.getMonth() - new Date(this.sheetCreatedAt).getMonth()) + 1) : 1;
        }
      } else if (freq === 'weekly') {
        if (this.period === '4weeks') multiplier = 4;
        else if (this.period === '12weeks') multiplier = 12;
        else if (this.period === 'all') {
          multiplier = this.sheetCreatedAt ? Math.max(1, Math.ceil(Math.abs(now.getTime() - new Date(this.sheetCreatedAt).getTime()) / (1000 * 60 * 60 * 24 * 7))) : 1;
        }
      } else if (freq === 'yearly') {
        if (this.period === '3years') multiplier = 3;
        else if (this.period === 'all') {
          multiplier = this.sheetCreatedAt ? Math.max(1, (now.getFullYear() - new Date(this.sheetCreatedAt).getFullYear()) + 1) : 1;
        }
      }

      this.categoryAnalysis = this.budget.categories.map(cat => {
        // Try to match budget category name to transaction category key
        const matchKey = cat.name.toLowerCase().replace(/\s*&\s*/g, ' ').split(' ')[0];
        const txKey = [...this.categorySpend.keys()].find(k => k.startsWith(matchKey) || matchKey.startsWith(k)) ?? '';
        const spent = this.categorySpend.get(txKey) ?? 0;
        const limit = cat.limit ? Number(cat.limit) * multiplier : null;
        const percent = limit ? Math.min((spent / limit) * 100, 100) : 0;
        return {
          icon:    cat.icon,
          name:    cat.name,
          limit,
          spent,
          percent,
          isOver:  limit != null && spent > limit,
          isNear:  limit != null && (spent / limit) >= 0.8 && (spent / limit) < 1,
        };
      });

      const global = Number(this.budget.globalLimit) * multiplier;
      this.scaledGlobalLimit = global;
      this.budgetPercent = global ? Math.min((this.totalSpent / global) * 100, 100) : 0;
      this.isBudgetOver  = global > 0 && this.totalSpent > global;
      this.isBudgetNear  = !this.isBudgetOver && this.budgetPercent >= 80;
    } else {
      this.scaledGlobalLimit = 0;
    }
  }

  getBudgetPeriodLabel(): string {
    if (!this.budget) return '';
    const freq = this.budget.frequency;
    
    if (this.period === 'all') return 'All Time';
    
    if (freq === 'monthly') {
      if (this.period === '3months') return '3 Month';
      if (this.period === '6months') return '6 Month';
      return 'Monthly';
    }
    if (freq === 'weekly') {
      if (this.period === '4weeks') return '4 Week';
      if (this.period === '12weeks') return '12 Week';
      return 'Weekly';
    }
    if (freq === 'yearly') {
      if (this.period === '3years') return '3 Year';
      return 'Yearly';
    }
    return freq;
  }

  // ─── Spend by category donut chart ─────────────────────────────────────────
  private buildDonutChart() {
    if (!this.donutCanvas) return;
    this.donutChart?.destroy();

    const entries = [...this.categorySpend.entries()].filter(([, v]) => v > 0);
    if (!entries.length) return;

    const labels = entries.map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
    const data   = entries.map(([, v]) => v);

    this.donutChart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.PALETTE.slice(0, entries.length),
          borderWidth: 2,
          borderColor: 'transparent',
          hoverBorderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#9a9a9a',
              font: { family: 'Poppins', size: 12 },
              boxWidth: 12,
              padding: 14
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` $${(ctx.raw as number).toFixed(2)}`
            }
          }
        }
      }
    });
  }

  // ─── Daily spending trend bar chart ────────────────────────────────────────
  private buildSpendChart() {
    if (!this.spendCanvas) return;
    this.spendChart?.destroy();

    // Re-filter transactions to ensure chart matches the period exactly
    const now = new Date();
    let startDate = new Date(0);
    let endDate = new Date(now);
    if (this.period !== 'all') {
      startDate = new Date();
      if (this.period === 'this_month') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      else if (this.period === '1month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      }
      else if (this.period === '3months') startDate.setMonth(now.getMonth() - 3);
      else if (this.period === '6months') startDate.setMonth(now.getMonth() - 6);
      else if (this.period === 'this_week') { const d = now.getDay() || 7; startDate.setDate(now.getDate() - d + 1); startDate.setHours(0,0,0,0); }
      else if (this.period === 'last_week') {
        const day = now.getDay() || 7;
        startDate.setDate(now.getDate() - day - 6);
        startDate.setHours(0,0,0,0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      }
      else if (this.period === '4weeks') startDate.setDate(now.getDate() - 28);
      else if (this.period === '12weeks') startDate.setDate(now.getDate() - 84);
      else if (this.period === 'this_year') startDate = new Date(now.getFullYear(), 0, 1);
      else if (this.period === 'last_year') {
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      }
      else if (this.period === '3years') startDate.setFullYear(now.getFullYear() - 3);
    }

    const filteredTxs = this.transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    // Determine how many days to plot based on the period
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = this.period === 'all' ? 30 : Math.max(7, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - (days - 1 - i));
      return { label: `${d.getMonth() + 1}/${d.getDate()}`, sent: 0, received: 0, key: d.toDateString() };
    });

    for (const t of filteredTxs) {
      const key = new Date(t.date).toDateString();
      const bucket = buckets.find(b => b.key === key);
      if (bucket) {
        if (t.type === 'SENT')     bucket.sent     += t.amount;
        if (t.type === 'RECEIVED') bucket.received += t.amount;
      }
    }

    // Only show last 14 with data or last 14 by default if days > 14
    const relevant = buckets.filter(b => b.sent > 0 || b.received > 0);
    const display  = relevant.length > 0 ? relevant : buckets.slice(Math.max(0, days - 14));

    this.spendChart = new Chart(this.spendCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: display.map(b => b.label),
        datasets: [
          {
            label: 'Spent',
            data: display.map(b => b.sent),
            backgroundColor: 'rgba(246,94,60,0.7)',
            borderColor: '#f65e3c',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Received',
            data: display.map(b => b.received),
            backgroundColor: 'rgba(156,190,166,0.7)',
            borderColor: '#9cbea6',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9a9a9a', font: { family: 'Poppins', size: 12 }, boxWidth: 12 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` $${(ctx.raw as number).toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#666', font: { family: 'Poppins', size: 11 } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            ticks: {
              color: '#666',
              font: { family: 'Poppins', size: 11 },
              callback: v => `$${v}`
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }

  getCategoryIcon(cat: string): string {
    return CATEGORY_ICONS[cat] ?? 'payments';
  }
}
