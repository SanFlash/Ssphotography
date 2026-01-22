/**
 * Photography+ Studio | Advanced Analytics Module
 * Real-time data visualization with Chart.js and custom analytics
 */

(function() {
    'use strict';

    // ===================================================================
    // ANALYTICS MANAGER
    // ===================================================================

    class AnalyticsManager {
        constructor() {
            this.charts = new Map();
            this.metrics = new Map();
            this.dataHistory = [];
            this.isRealTime = true;
            this.updateInterval = null;
            this.performanceMode = 'high';
            
            this.init();
        }

        init() {
            this.setupChartDefaults();
            this.createAnalyticsCharts();
            this.startRealTimeUpdates();
            this.setupEventListeners();
        }

        setupChartDefaults() {
            // Configure Chart.js global defaults
            Chart.defaults.color = '#94a3b8';
            Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
            Chart.defaults.font.family = 'Inter, sans-serif';
            Chart.defaults.font.size = 12;
            Chart.defaults.responsive = true;
            Chart.defaults.maintainAspectRatio = false;
            
            // Custom chart plugins
            this.registerCustomPlugins();
        }

        registerCustomPlugins() {
            // Gradient fill plugin
            Chart.register({
                id: 'gradientFill',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    const chartArea = chart.chartArea;
                    
                    chart.data.datasets.forEach((dataset, i) => {
                        if (dataset.gradientFill !== false) {
                            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                            gradient.addColorStop(0, dataset.borderColor + '20');
                            gradient.addColorStop(1, dataset.borderColor + '00');
                            dataset.backgroundColor = gradient;
                        }
                    });
                }
            });

            // Real-time animation plugin
            Chart.register({
                id: 'realtimeAnimation',
                afterDraw: (chart) => {
                    if (chart.options.realtimeAnimation) {
                        this.animateChartUpdate(chart);
                    }
                }
            });
        }

        createAnalyticsCharts() {
            this.createVisitorAnalytics();
            this.createTrafficAnalytics();
            this.createRevenueAnalytics();
            this.createConversionAnalytics();
            this.createHeatmapAnalytics();
            this.createFunnelAnalytics();
        }

        createVisitorAnalytics() {
            const ctx = document.getElementById('visitor-analytics-chart');
            if (!ctx) return;

            const data = this.generateVisitorData();
            
            const config = {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Unique Visitors',
                        data: data.visitors,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true,
                        gradientFill: true
                    }, {
                        label: 'Page Views',
                        data: data.pageViews,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        gradientFill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#e2e8f0',
                            bodyColor: '#94a3b8',
                            borderColor: '#475569',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        }
                    },
                    realtimeAnimation: true
                }
            };

            const chart = new Chart(ctx, config);
            this.charts.set('visitor-analytics', chart);
        }

        createTrafficAnalytics() {
            const ctx = document.getElementById('traffic-analytics-chart');
            if (!ctx) return;

            const data = this.generateTrafficData();
            
            const config = {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        backgroundColor: [
                            '#6366f1',
                            '#8b5cf6',
                            '#06b6d4',
                            '#10b981',
                            '#f59e0b'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#94a3b8',
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            };

            const chart = new Chart(ctx, config);
            this.charts.set('traffic-analytics', chart);
        }

        createRevenueAnalytics() {
            const ctx = document.getElementById('revenue-analytics-chart');
            if (!ctx) return;

            const data = this.generateRevenueData();
            
            const config = {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: data.revenue,
                        backgroundColor: '#10b981',
                        borderColor: '#059669',
                        borderWidth: 1,
                        borderRadius: 4
                    }, {
                        label: 'Expenses',
                        data: data.expenses,
                        backgroundColor: '#ef4444',
                        borderColor: '#dc2626',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    return `${label}: $${value.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8',
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            };

            const chart = new Chart(ctx, config);
            this.charts.set('revenue-analytics', chart);
        }

        createConversionAnalytics() {
            const ctx = document.getElementById('conversion-analytics-chart');
            if (!ctx) return;

            const data = this.generateConversionData();
            
            const config = {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Conversion Rate',
                        data: data.conversionRate,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    }, {
                        label: 'Goal Completions',
                        data: data.goals,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8',
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        }
                    }
                }
            };

            const chart = new Chart(ctx, config);
            this.charts.set('conversion-analytics', chart);
        }

        createHeatmapAnalytics() {
            const ctx = document.getElementById('heatmap-analytics-chart');
            if (!ctx) return;

            const data = this.generateHeatmapData();
            
            const config = {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'User Activity',
                        data: data,
                        backgroundColor: function(context) {
                            const value = context.parsed.y;
                            const alpha = value / 100;
                            return `rgba(99, 102, 241, ${alpha})`;
                        },
                        borderColor: '#6366f1',
                        pointRadius: function(context) {
                            const value = context.parsed.y;
                            return Math.max(3, value / 10);
                        }
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            },
                            title: {
                                display: true,
                                text: 'Time (hours)',
                                color: '#94a3b8'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            },
                            title: {
                                display: true,
                                text: 'Activity Level',
                                color: '#94a3b8'
                            }
                        }
                    }
                }
            };

            const chart = new Chart(ctx, config);
            this.charts.set('heatmap-analytics', chart);
        }

        createFunnelAnalytics() {
            const ctx = document.getElementById('funnel-analytics-chart');
            if (!ctx) return;

            const data = this.generateFunnelData();
            
            const config = {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Users',
                        data: data.users,
                        backgroundColor: [
                            '#6366f1',
                            '#8b5cf6',
                            '#06b6d4',
                            '#10b981',
                            '#f59e0b'
                        ],
                        borderColor: [
                            '#4f46e5',
                            '#7c3aed',
                            '#0891b2',
                            '#059669',
                            '#d97706'
                        ],
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                afterLabel: function(context) {
                                    const index = context.dataIndex;
                                    const total = context.dataset.data[0];
                                    const current = context.parsed.x;
                                    const percentage = ((current / total) * 100).toFixed(1);
                                    return `Conversion: ${percentage}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#94a3b8'
                            }
                        }
                    }
                }
            };

            const chart = new Chart(ctx, config);
            this.charts.set('funnel-analytics', chart);
        }

        generateVisitorData() {
            const labels = [];
            const visitors = [];
            const pageViews = [];
            
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                
                visitors.push(Math.floor(Math.random() * 500) + 100);
                pageViews.push(Math.floor(Math.random() * 800) + 200);
            }
            
            return { labels, visitors, pageViews };
        }

        generateTrafficData() {
            const labels = ['Direct', 'Social', 'Organic', 'Referral', 'Email'];
            const values = [30, 25, 20, 15, 10];
            
            return { labels, values };
        }

        generateRevenueData() {
            const labels = [];
            const revenue = [];
            const expenses = [];
            
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            months.forEach(month => {
                labels.push(month);
                revenue.push(Math.floor(Math.random() * 5000) + 2000);
                expenses.push(Math.floor(Math.random() * 3000) + 1000);
            });
            
            return { labels, revenue, expenses };
        }

        generateConversionData() {
            const labels = [];
            const conversionRate = [];
            const goals = [];
            
            for (let i = 1; i <= 30; i++) {
                labels.push(`Day ${i}`);
                conversionRate.push(Math.random() * 5 + 2); // 2-7%
                goals.push(Math.floor(Math.random() * 50) + 10);
            }
            
            return { labels, conversionRate, goals };
        }

        generateHeatmapData() {
            const data = [];
            
            for (let hour = 0; hour < 24; hour++) {
                for (let day = 0; day < 7; day++) {
                    const activity = Math.random() * 100;
                    data.push({
                        x: hour,
                        y: day,
                        activity: activity
                    });
                }
            }
            
            return data;
        }

        generateFunnelData() {
            const labels = ['Homepage', 'Gallery', 'Contact', 'Quote', 'Booking'];
            const users = [1000, 750, 500, 250, 100];
            
            return { labels, users };
        }

        startRealTimeUpdates() {
            if (!this.isRealTime) return;

            this.updateInterval = setInterval(() => {
                this.updateCharts();
                this.updateMetrics();
            }, 2000);
        }

        updateCharts() {
            this.charts.forEach((chart, key) => {
                if (chart && chart.data) {
                    this.updateChartData(chart, key);
                    chart.update('none'); // Update without animation for performance
                }
            });
        }

        updateChartData(chart, key) {
            // Simulate real-time data updates
            const datasets = chart.data.datasets;
            
            datasets.forEach(dataset => {
                if (dataset.data && dataset.data.length > 0) {
                    // Shift data and add new value
                    dataset.data.shift();
                    
                    let newValue;
                    switch (key) {
                        case 'visitor-analytics':
                            newValue = Math.floor(Math.random() * 100) + 50;
                            break;
                        case 'traffic-analytics':
                            newValue = Math.floor(Math.random() * 30) + 10;
                            break;
                        case 'revenue-analytics':
                            newValue = Math.floor(Math.random() * 5000) + 1000;
                            break;
                        default:
                            newValue = Math.floor(Math.random() * 100);
                    }
                    
                    dataset.data.push(newValue);
                }
            });
        }

        updateMetrics() {
            const metrics = this.generateRealTimeMetrics();
            
            this.metrics.forEach((metric, key) => {
                if (metric.element && metric.value !== undefined) {
                    this.animateMetric(metric.element, metric.value, metric.format);
                }
            });
        }

        generateRealTimeMetrics() {
            return {
                visitors: Math.floor(Math.random() * 100) + 50,
                pageViews: Math.floor(Math.random() * 200) + 100,
                bounceRate: Math.random() * 50 + 20,
                avgSessionDuration: Math.floor(Math.random() * 300) + 120,
                conversionRate: Math.random() * 5 + 1
            };
        }

        animateMetric(element, targetValue, format = 'number') {
            const currentValue = parseFloat(element.textContent.replace(/[^\d.]/g, '')) || 0;
            const increment = (targetValue - currentValue) / 30;
            let current = currentValue;

            const timer = setInterval(() => {
                current += increment;
                
                if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
                    current = targetValue;
                    clearInterval(timer);
                }

                let displayValue;
                switch (format) {
                    case 'percentage':
                        displayValue = current.toFixed(1) + '%';
                        break;
                    case 'duration':
                        displayValue = this.formatDuration(Math.round(current));
                        break;
                    default:
                        displayValue = Math.round(current).toLocaleString();
                }
                
                element.textContent = displayValue;
            }, 50);
        }

        formatDuration(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        setupEventListeners() {
            // Chart interaction listeners
            document.addEventListener('click', (e) => {
                if (e.target.closest('.chart-canvas')) {
                    this.handleChartInteraction(e);
                }
            });

            // Real-time toggle
            const realtimeToggle = document.getElementById('realtime-toggle');
            if (realtimeToggle) {
                realtimeToggle.addEventListener('change', (e) => {
                    this.isRealTime = e.target.checked;
                    if (this.isRealTime) {
                        this.startRealTimeUpdates();
                    } else {
                        this.stopRealTimeUpdates();
                    }
                });
            }

            // Performance mode change
            document.addEventListener('performanceModeChanged', (e) => {
                this.performanceMode = e.detail.mode;
                this.adjustPerformance();
            });
        }

        handleChartInteraction(event) {
            const chartElement = event.target.closest('.chart-canvas');
            if (!chartElement) return;

            const chartId = chartElement.id;
            const chart = this.charts.get(chartId);
            
            if (chart) {
                // Add interaction effect
                chartElement.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    chartElement.style.transform = 'scale(1)';
                }, 150);

                // Log interaction for analytics
                this.logInteraction('chart_click', chartId);
            }
        }

        logInteraction(type, target) {
            const interaction = {
                type,
                target,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            };
            
            this.dataHistory.push(interaction);
            
            // Keep only recent interactions
            if (this.dataHistory.length > 1000) {
                this.dataHistory = this.dataHistory.slice(-500);
            }
        }

        adjustPerformance() {
            switch (this.performanceMode) {
                case 'low':
                    this.updateInterval && clearInterval(this.updateInterval);
                    this.updateInterval = setInterval(() => {
                        this.updateCharts();
                        this.updateMetrics();
                    }, 5000);
                    break;
                case 'medium':
                    this.updateInterval && clearInterval(this.updateInterval);
                    this.updateInterval = setInterval(() => {
                        this.updateCharts();
                        this.updateMetrics();
                    }, 3000);
                    break;
                case 'high':
                    this.updateInterval && clearInterval(this.updateInterval);
                    this.updateInterval = setInterval(() => {
                        this.updateCharts();
                        this.updateMetrics();
                    }, 2000);
                    break;
            }
        }

        stopRealTimeUpdates() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
        }

        exportData() {
            const data = {
                charts: this.getChartData(),
                metrics: this.getMetricsData(),
                history: this.dataHistory,
                timestamp: Date.now()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        getChartData() {
            const chartData = {};
            this.charts.forEach((chart, key) => {
                if (chart && chart.data) {
                    chartData[key] = {
                        labels: chart.data.labels,
                        datasets: chart.data.datasets.map(dataset => ({
                            label: dataset.label,
                            data: dataset.data
                        }))
                    };
                }
            });
            return chartData;
        }

        getMetricsData() {
            const metricsData = {};
            this.metrics.forEach((metric, key) => {
                metricsData[key] = {
                    value: metric.value,
                    format: metric.format,
                    timestamp: metric.timestamp
                };
            });
            return metricsData;
        }

        destroy() {
            this.stopRealTimeUpdates();
            
            this.charts.forEach(chart => {
                if (chart) chart.destroy();
            });
            
            this.charts.clear();
            this.metrics.clear();
        }
    }

    // ===================================================================
    // REAL-TIME METRICS
    // ===================================================================

    class RealtimeMetrics {
        constructor() {
            this.metrics = new Map();
            this.updateInterval = null;
            this.isActive = false;
            
            this.init();
        }

        init() {
            this.createMetrics();
            this.startUpdates();
        }

        createMetrics() {
            // Create real-time metric displays
            const metricElements = [
                { id: 'realtime-visitors', label: 'Visitors', format: 'number' },
                { id: 'realtime-views', label: 'Page Views', format: 'number' },
                { id: 'realtime-bounce', label: 'Bounce Rate', format: 'percentage' },
                { id: 'realtime-duration', label: 'Avg Duration', format: 'duration' }
            ];

            metricElements.forEach(metric => {
                this.createMetricElement(metric);
            });
        }

        createMetricElement(metric) {
            const element = document.getElementById(metric.id);
            if (!element) return;

            this.metrics.set(metric.id, {
                element,
                value: 0,
                label: metric.label,
                format: metric.format
            });

            // Add click-to-copy functionality
            element.addEventListener('click', () => {
                this.copyMetricValue(element, metric.label);
            });
        }

        startUpdates() {
            this.isActive = true;
            
            this.updateInterval = setInterval(() => {
                this.updateMetrics();
            }, 1000);
        }

        updateMetrics() {
            if (!this.isActive) return;

            this.metrics.forEach((metric, id) => {
                // Generate realistic metric values
                let newValue;
                switch (id) {
                    case 'realtime-visitors':
                        newValue = Math.floor(Math.random() * 50) + 20;
                        break;
                    case 'realtime-views':
                        newValue = Math.floor(Math.random() * 100) + 50;
                        break;
                    case 'realtime-bounce':
                        newValue = Math.random() * 30 + 20; // 20-50%
                        break;
                    case 'realtime-duration':
                        newValue = Math.floor(Math.random() * 180) + 60; // 60-240 seconds
                        break;
                }

                if (newValue !== metric.value) {
                    this.animateMetricUpdate(metric.element, newValue, metric.format);
                    metric.value = newValue;
                }
            });
        }

        animateMetricUpdate(element, newValue, format) {
            // Add update animation
            element.style.transform = 'scale(1.05)';
            element.style.color = '#6366f1';
            
            let displayValue;
            switch (format) {
                case 'percentage':
                    displayValue = newValue.toFixed(1) + '%';
                    break;
                case 'duration':
                    displayValue = this.formatDuration(Math.round(newValue));
                    break;
                default:
                    displayValue = Math.round(newValue).toLocaleString();
            }
            
            element.textContent = displayValue;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '#e2e8f0';
            }, 200);
        }

        formatDuration(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        copyMetricValue(element, label) {
            const value = element.textContent;
            navigator.clipboard.writeText(value).then(() => {
                this.showCopyFeedback(element, label);
            });
        }

        showCopyFeedback(element, label) {
            const feedback = document.createElement('div');
            feedback.className = 'copy-feedback';
            feedback.textContent = `${label} copied!`;
            feedback.style.cssText = `
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--admin-primary);
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                font-weight: 500;
                z-index: 1000;
                animation: copy-feedback-fade 1.5s ease-out forwards;
            `;

            element.style.position = 'relative';
            element.appendChild(feedback);

            setTimeout(() => {
                feedback.remove();
            }, 1500);
        }

        stop() {
            this.isActive = false;
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        }

        destroy() {
            this.stop();
            this.metrics.clear();
        }
    }

    // ===================================================================
    // DATA GENERATORS
    // ===================================================================

    class DataGenerator {
        static generateVisitorData(days = 7) {
            const labels = [];
            const visitors = [];
            const pageViews = [];
            
            const now = new Date();
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                
                visitors.push(Math.floor(Math.random() * 500) + 100);
                pageViews.push(Math.floor(Math.random() * 800) + 200);
            }
            
            return { labels, visitors, pageViews };
        }

        static generateTrafficData() {
            const labels = ['Direct', 'Social', 'Organic', 'Referral', 'Email'];
            const values = [30, 25, 20, 15, 10];
            
            return { labels, values };
        }

        static generateRevenueData() {
            const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            const revenue = labels.map(() => Math.floor(Math.random() * 5000) + 2000);
            const expenses = labels.map(() => Math.floor(Math.random() * 3000) + 1000);
            
            return { labels, revenue, expenses };
        }

        static generateConversionData() {
            const labels = [];
            const conversionRate = [];
            const goals = [];
            
            for (let i = 1; i <= 30; i++) {
                labels.push(`Day ${i}`);
                conversionRate.push(Math.random() * 5 + 2); // 2-7%
                goals.push(Math.floor(Math.random() * 50) + 10);
            }
            
            return { labels, conversionRate, goals };
        }

        static generateHeatmapData() {
            const data = [];
            
            for (let hour = 0; hour < 24; hour++) {
                for (let day = 0; day < 7; day++) {
                    const activity = Math.random() * 100;
                    data.push({
                        x: hour,
                        y: day,
                        activity: activity
                    });
                }
            }
            
            return data;
        }

        static generateFunnelData() {
            const labels = ['Homepage', 'Gallery', 'Contact', 'Quote', 'Booking'];
            const users = [1000, 750, 500, 250, 100];
            
            return { labels, users };
        }
    }

    // ===================================================================
    // INITIALIZATION
    // ===================================================================

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize analytics manager
        window.analyticsManager = new AnalyticsManager();
        window.realtimeMetrics = new RealtimeMetrics();
        
        console.log('📊 Advanced analytics module initialized!');
    });

})();