export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
  };
}
