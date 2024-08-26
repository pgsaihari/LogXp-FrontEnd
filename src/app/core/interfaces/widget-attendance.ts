export interface WidgetAttendance {
    employeeCode: string,
    name: string,
    batch: string,
    loginTime: string,
    status: string,
    date:string
}

export interface WidgetSummary{
  earlyArrivalCount: number,
  lateArrivalCount: number,
  earlyDepartureCount: number,
  absentCount: number,
  latestDate: string
}

export interface UserWidgetSummary{
    numberOfDaysAbsent : number,
    numberOfDaysLate: number
}

export interface EarlyArrivalLogs{
    earlyArrivals:WidgetAttendance[],
    message:string,
    count:number
}
export interface LateArrivalsLog{
    lateArrivals:WidgetAttendance[],
    message:string,
    count:number
}
export interface EarlyDepartureLog{
    earlyDepartures:WidgetAttendance[],
    message:string,
    count:number
}
export interface AbsenteeLog{
    absentees:WidgetAttendance[],
    message:string,
    count:number
}
