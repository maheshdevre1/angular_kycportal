// src/app/models/auth.models.ts
export interface LoginRequest {
  bankCode: string;
  loginId: string;
  password: string;
}

export interface CommonRequest {
  token: string;
}


export interface BatchesRequest {
    token: string;
    start: number,
    length: number,
    type: string;
    batchId: string;
}

export interface DownlodBatchRequest {
    token: string;
    batchId: string;
}


export interface ExportRequest {
    token: string;
    type: string;
}

export interface ViewReportRequest{
  token: string;
  branchInfo: BranchInfo[]; 
  type: string,
  start: number,
  length: number
}

export interface BranchInfo {
  branchId: string;
  branchName: string;
}

export interface ReportTab {
  label: string;
  type: string;
}

export interface LapsedRecordRequest {
  searchId: string;
  rowId: string;
  type : string;
  token : string;
  start : number;
  length : number;
}


export interface ReprocessLapsedRequest {
  token: string;
  listOfCustomerId: {
    rowId: number;
    customerID: string;
  }[];
}





