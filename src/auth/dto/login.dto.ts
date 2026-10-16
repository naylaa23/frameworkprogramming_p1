import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({message: 'Email harus diisi'})
  @IsEmail({}, {message: 'Email wajib valid'})
  email: string;
  @IsNotEmpty({message: 'Password harus diisi'})
  @MinLength(8, {message: 'Password minimal 8 karakter'})
  password: string;
}