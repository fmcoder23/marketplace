export interface JwtPayload {
    id: string; 
    role: string;
    iat?: number;
    exp?: number;
  }
  