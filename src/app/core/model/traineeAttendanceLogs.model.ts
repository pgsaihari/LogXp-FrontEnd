export interface TraineeAttendanceLogs {
        id: number;
        name: string;
        ilp: string;
        date: string;
        status: string;
        batch: string;
        loginTime?: string;
        logoutTime?: string;
        totalWorkHour?: string;
        remark?:string;       
}

