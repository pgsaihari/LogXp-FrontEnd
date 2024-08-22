export interface WidgetAttendance {
    // id:string;
    // traineeName:string;
    // batch:string;
    // date:string;
    // checkin?: string;
    // checkout?: string;

    employeeCode: string,
    name: string,
    batch: string,
    loginTime: string,
    status: string
}

export interface EarlyArrivalsLog{
    earlyArrivals:WidgetAttendance[],
    message:string,
    count:number
}

export interface LateArrivalsLog{
    lateArrivals:WidgetAttendance[],
    message:string,
    count:number
}