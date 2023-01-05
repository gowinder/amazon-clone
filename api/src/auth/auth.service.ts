import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './../user/user.service';
import { NewUserDTO } from '../user/dtos/new-user.dto';
import { User } from 'src/user/user.schema';
import { UserDetails } from '../user/user-detail.interface';
import { ExistingUserDTO } from '../user/dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) return 'Email taken!';
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create(name, email, hashedPassword);
    return newUser;
  }

  async checkPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const checkPassword = await bcrypt.hash(password, 12);
    return bcrypt.compare(password, hashPassword);
  }

  async validUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const validPassword = await this.checkPassword(password, user.password);
    if (!validPassword) return null;

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validUser(email, password);
    console.log('🚀 ~ file: auth.service.ts:60 ~ AuthService ~ user', user);
    if (!user) return null;
    const jwt = await this.jwtService.signAsync({ user });
    console.log('🚀 ~ file: auth.service.ts:62 ~ AuthService ~ jwt', jwt);
    return { token: jwt };
  }
}
