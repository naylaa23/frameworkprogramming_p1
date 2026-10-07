import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { User } from './entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    //hash password -> salt:hash
    private hashPassword(password: string): string {
        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    }

    //cek password dengan hash yang tersimpan
    private verifyPassword(password: string, stored: string): boolean {
        const [salt, hash] = stored.split(':');
        const hashBuffer = Buffer.from(hash, 'hex');
        const inputBuffer = scryptSync(password, salt, 64);
        return timingSafeEqual(hashBuffer, inputBuffer);
    }

    //register
    async register(registerDto: RegisterDto) {
        const exists = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (exists) {
            throw new ConflictException(`Email ${registerDto.email} sudah terdaftar.`);
        }
        const user = this.userRepository.create({
            name: registerDto.name,
            email: registerDto.email,
            password: this.hashPassword(registerDto.password),
        });
        const saved = await this.userRepository.save(user);
        return {
            message: 'Register berhasil.',
            user: { id: saved.id, name: saved.name, email: saved.email },
        };
    }

    //login
    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
        });
        if (!user || !this.verifyPassword(loginDto.password, user.password)) {
            throw new UnauthorizedException('Email atau password salah.');
        }
        return {
            message: 'Login berhasil.',
            user: { id: user.id, name: user.name, email: user.email },
        };
    }
}