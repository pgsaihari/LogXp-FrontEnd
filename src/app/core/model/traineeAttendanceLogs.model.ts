export interface TraineeAttendanceLogs {
        id: number;
        name: string;
        ilp: string;
        date: string;
        status: string;
        batch: string;
        checkin?: string;
        checkout?: string;
        workhours?: string;
        remark?:string;
}

