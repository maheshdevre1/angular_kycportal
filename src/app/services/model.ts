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

