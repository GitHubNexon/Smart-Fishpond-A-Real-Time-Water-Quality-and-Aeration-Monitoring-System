// src/modules/users/interfaces/user.interface.ts
export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  userType: string;
  failedAttempts: number;
  lockoutUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
