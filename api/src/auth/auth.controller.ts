import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDTO } from '../user/dtos/new-user.dto';
import { UserDetails } from '../user/user-detail.interface';
import { ExistingUserDTO } from '../user/dtos/existing-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: NewUserDTO): Promise<UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('login')
//   @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null> {
    console.log("🚀 ~ file: auth.controller.ts:19 ~ AuthController ~ login ~ user", user)
    
    return this.authService.login(user);
  }
}
