export interface DailyAttendanceOfMonth {
    day?:Date;
    absentees?:number;
    lateArrivals?:number
    totalEmployees?:number;
}

export interface OfficeEntryTime {
    hours:number;
    minutes:number;
    seconds:number;
}