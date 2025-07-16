import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, ChartType, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../../services/dashboard/dashboard';
import { Table } from "../../../shared/table/table";


Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.css'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective, Table]
})
export class StatisticsComponent implements OnInit {
  statCards: any[] = [];

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Students',
        data: [],
        backgroundColor: 'rgba(96, 165, 250, 0.7)',
        borderRadius: 10,
        barPercentage: 0.6,
        categoryPercentage: 0.5
      }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          // color: '#334155',
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: '#1e3a8a',
        // titleColor: '#fff',
        bodyColor: '#fff',
        // borderColor: '#60a5fa',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          // color: '#334155',
          font: { size: 13, weight: 'bold' }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          // color: 'rgba(148, 163, 184, 0.2)'
        },
        ticks: {
          // color: '#334155',
          font: { size: 13, weight: 'bold' }
        }
      }
    }
  };


  public aiLineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Avg Score',
        data: [],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6',
        fill: true
      },
      {
        label: 'Pass Rate',
        data: [],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 6,
        pointBackgroundColor: '#22d3ee',
        fill: true
      }
    ]
  };

  public aiLineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          // color: '#334155',
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        // titleColor: '#fff',
        // bodyColor: '#fff',
        borderColor: '#a78bfa',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          // color: '#334155',
          font: { size: 13, weight: 'bold' }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          // color: 'rgba(203, 213, 225, 0.2)'
        },
        ticks: {
          // color: '#334155',
          font: { size: 13, weight: 'bold' },
          callback: function (value) {
            return value + '%';
          }
        }
      }
    }
  };


  public aiLineChartType: ChartType = 'line';


  public barChartLabels: string[] = [];

  public barChartType: ChartType = 'bar';

  aiInsights: any[] = [];
  predictions: any[] = [];
  predictionColumns = [
    { field: 'examTitle', label: 'Exam' },
    { field: 'predictedAverageScore', label: 'Avg Score', format: (val: any) => `${val}%` },
    { field: 'predictedPassRate', label: 'Pass Rate', format: (val: any) => `${val}%` },
    { field: 'confidence', label: 'Confidence', pipe: 'confidence' },
    { field: 'recommendation', label: 'Recommendation' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchStats();
    this.fetchStudentsChart();
    this.fetchInsights();
    this.fetchPredictions();
  }

  fetchStats() {
    this.dashboardService.getStats().subscribe(res => {
      const data = res?.data ?? res;
      this.statCards = [
        { title: 'Total Students', value: data.totalStudents, icon: '👨‍🎓' },
        { title: 'Total Exams', value: data.totalExams, icon: '📝' },
        { title: 'Completed Exams', value: data.completedExams, icon: '✅' },
        { title: 'Ongoing Exams', value: data.ongoingExams, icon: '⌛' },
        { title: 'Upcoming Exams', value: data.upcomingExams, icon: '📅' },
        { title: 'Recent Results', value: data.recentResultsCount, icon: '📊' }
      ];

      this.cd.detectChanges();
    });
  }

  fetchStudentsChart() {
    this.dashboardService.getStudentsPerMonth().subscribe(res => {
      const values = res?.data?.$values;
      console.log(res.data.$values);
      this.barChartLabels = values.map((m: any) => m.month);
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          {
            label: 'Students',
            data: values.map((m: any) => m.count),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
      this.cd.detectChanges();
    });
  }

  fetchInsights() {
    this.dashboardService.getAiInsights().subscribe(res => {
      const rawInsights = res?.data?.$values.slice(0,6) ?? [];


      this.aiInsights = rawInsights.map((insight: any) => {
        const insightList = Array.isArray(insight.insights)
          ? insight.insights
          : insight.insights?.$values ?? [];

        const level = insightList.some((t: string) => t.toLowerCase().includes('very difficult') || t.includes('Low'))
          ? 'low'
          : insightList.some((t: string) => t.includes('Medium'))
            ? 'medium'
            : 'high';

        return {
          ...insight,
          insights: insightList,
          level: level
        };
      });

      this.cd.detectChanges();
    });
  }


  // fetchPredictions() {
  //   this.dashboardService.getPredictions().subscribe(res => {
  //     this.predictions = res?.data?.$values;
  //     this.cd.detectChanges();
  //   });
  // }


  fetchPredictions() {
    this.dashboardService.getPredictions().subscribe(res => {
      const predictions = res?.data?.$values ?? [];
      this.predictions = predictions;

      const labels = predictions.map((p: any) => p.examTitle);
      const avgScores = predictions.map((p: any) => p.predictedAverageScore);
      const passRates = predictions.map((p: any) => p.predictedPassRate);


      this.aiLineChartData = {
        labels: labels,
        datasets: [
          {
            ...this.aiLineChartData.datasets[0],
            data: avgScores
          },
          {
            ...this.aiLineChartData.datasets[1],
            data: passRates
          }
        ]
      };

      this.cd.detectChanges();
    });
  }

}
