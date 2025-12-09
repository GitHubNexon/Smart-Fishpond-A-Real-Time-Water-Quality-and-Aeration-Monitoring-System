export class LoginRequestDto {
  email: string;
  password: string;
}

export type PayloadUser = {
  id: string;
  fullname: string;
  profileImage?: string;
  username: string;
  email: string;
  failedAttempts: number;
  lockoutUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  deletedAt?: Date | null;
};


export type LoginResponseDto = {
  accessToken: string;
  message: string;
  user: PayloadUser;
};
