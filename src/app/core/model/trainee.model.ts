export interface Trainee {
    employeeCode? : string;        // EmployeeCode is the primary key
    name?: string;               // Optional property
    email?: string;              // Optional property
    batchId?: number;              // Optional property
    isActive?:boolean;
  }
  