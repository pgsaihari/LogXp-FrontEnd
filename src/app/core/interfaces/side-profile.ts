import { TraineeAttendanceLogs } from "../model/traineeAttendanceLogs.model";

export interface SideProfile {
}

export interface PatchResponse{
    traineeAttendanceLogs:TraineeAttendanceLogs;
    message:string;
}

export interface CurrentTraineeLog {
    status: string;
    remark?: string;
}

export interface AbsenceAndLate{
    absentDaysCount: number;
    earlyDepartureDaysCount: number;
    lateArrivalDaysCount: number;
    onTimeDaysCount: number;
}