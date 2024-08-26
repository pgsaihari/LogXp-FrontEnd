export interface User{
    userId?: string;       // EmployeeCode is the primary key
    name?: string;         // Optional property
    email?: string;        // Optional property
    isActive?: boolean;    // Optional property
    batchId?: number;      // Optional property
    role?: string;         // Optional property
}
