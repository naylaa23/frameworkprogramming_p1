import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({message: 'Name harus diisi'})
  name: string;

  @IsNotEmpty({message: 'Email harus diisi'})
  @IsEmail({}, {message: 'Email wajib valid'})
  email: string;

  @IsNotEmpty({message: 'Password harus diisi'})
  @MinLength(8, {message: 'Password minimal 8 karakter'})
  password: string;
  
  @IsNotEmpty({message: 'Confirm Password harus diisi'})
  @MinLength(8, {message: 'Confirm Password minimal 8 karakter'})
  confirmPassword: string;
}