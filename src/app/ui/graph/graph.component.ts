// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-graph',
//   standalone: true,
//   imports: [],
//   templateUrl: './graph.component.html',
//   styleUrl: './graph.component.css'
// })
// export class GraphComponent {

// }

/* app.component.ts */
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
 
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { ChartModule } from 'primeng/chart';
 
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CanvasJSAngularChartsModule, ChartModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent  {
	title = 'angular17ssrapp';
	generateRandomData = () => {
		var y  = 24, dps = [];
		for(var i = 0; i < 24; i++) {
			y += Math.ceil(Math.random() * 10 - 5);
			dps.push({ y: y});
		}
    console.log(dps);
    
		return dps;
	}

  chartData: {y: number, x: number}[] = [
    {y:33,x:1},
    {y:35, x:2},
    {y:37, x:3},
    {y:36, x:4},
    {y:37, x:5},
    {y:33, x:6},
    {y:34, x:7},
    {y:36, x:8},
    {y:34, x:9},
    {y:33, x:10},
    {y:37, x:11},
    {y:37, x:12},
    {y:36, x:13},
    {y:35, x:14},
    {y:35, x:15},
    {y:36, x:16},
    {y:36, x:17},
    {y:36, x:18},
    {y:36, x:19},
    {y:37, x:20},
    {y:35, x:21},
    {y:33, x:22},
    {y:34, x:23},
    {y:34, x:24},
    {y:36, x:25},
    {y:36, x:26}
  ];

	chartOptions = {
	  zoomEnabled: true,
	  exportEnabled: true,
	  theme: "light2",
	  title: {
		text: "Batch 4 Attendance Chart"
	  },
	  data: [{
		type: "line",
    color: "#EA454C",
		dataPoints: this.chartData
	  }]
	}



  myLable = new Date();
  // console.log(myLable);
  
  data: any;

    options: any;

    ngOnInit() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
            datasets: [
                {
                    label: 'Present',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                // {
                //     label: 'Second Dataset',
                //     data: [28, 48, 40, 19, 86, 27, 90],
                //     fill: false,
                //     borderColor: documentStyle.getPropertyValue('--pink-500'),
                //     tension: 0.4
                // }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
}        