import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }

  @ApiTags('auth/login')
  @ApiOperation({ description: 'login to authenticated users' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginDto) {
    return await this.authService.login(loginUserDto);
  }
}
