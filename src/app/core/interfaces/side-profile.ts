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
    numberOfDaysAbsent: number;
    numberOfDaysLate: number;
}