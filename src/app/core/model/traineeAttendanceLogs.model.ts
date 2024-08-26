export interface TraineeAttendanceLogs {
        id: string;
        name: string;
        ilp: string;
        date: string;
        status: string;
        batch: string;
        checkin?: string;
        checkout?: string;
        workhours?: string;
}
