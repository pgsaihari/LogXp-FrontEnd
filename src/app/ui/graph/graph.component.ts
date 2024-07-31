import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule, } from 'primeng/calendar';

 
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChartModule, FormsModule, CalendarModule, ],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent  {
  graphDataMonth: Date | undefined;
  numberOfWorkingDays: number = 25;
  data: any;
  options: any;
  monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  currentMonth:string = '';
  maxDate!: Date;

  ngOnInit() {
    this.graphDataMonth = new Date();
    this.maxDate = this.graphDataMonth;
    this.currentMonth = this.monthNames[this.graphDataMonth.getMonth()]
    this.graphInit();    
  }

  generateRandomData(length: number): number[] {
    const min = 34;
    const max = 37;
    const result: number[] = [];
    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      result.push(randomNumber);
    }
    return result;
  }
  generateXaxisLabel(length: number): string[] {
    const result: string[] = []; 
    for (let i = 1; i <= length; i++) {
      result.push(i+this.currentMonth);
    }
    return result;
  } // for testing with data

  monthSelection() {
    this.currentMonth = this.monthNames[<number>this.graphDataMonth?.getMonth()]
    this.graphInit()
  }

  graphInit(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
        labels: this.generateXaxisLabel(this.numberOfWorkingDays),
        datasets: [
            {
                label: 'Present',
                data: this.generateRandomData(this.numberOfWorkingDays),
                fill: false,
                borderColor: "#EA454C",
                tension: 0.4
            },
        ]
    };
    //remove aspect ration to alter height, or change it to alter height
    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.9,
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