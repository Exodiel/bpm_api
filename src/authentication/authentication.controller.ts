import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @ApiTags('auth/login')
  @ApiOperation({ description: 'login to authenticated users' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginDto) {
    return await this.authService.login(loginUserDto);
  }

  @ApiTags('auth/register')
  @ApiOperation({ description: 'register to authenticated users' })
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerUserDto: RegisterDto) {
    return await this.authService.register(registerUserDto);
  }
}
