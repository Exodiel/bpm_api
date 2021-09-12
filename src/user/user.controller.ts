import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { Query } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassUserDto } from './dto/update-pass-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CriteriaDTO } from 'src/shared/dto/criteria.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('user/create')
  @ApiOperation({ description: 'Create a user with all attributes' })
  @Post('/create')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async saveUser(@Body() userCreateDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(userCreateDto);

    return res.status(HttpStatus.CREATED).json(user);
  }

  @ApiTags('user/all')
  @ApiOperation({ description: 'Get all users without password' })
  @Get('/all')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() criteria: CriteriaDTO, @Res() res: Response) {
    const [users, counter] = await this.userService.findAll(criteria);

    return res.status(HttpStatus.OK).json({
      limit: criteria.limit,
      offset: criteria.offset,
      total: counter,
      data: users,
    });
  }

  @ApiTags('user/find')
  @ApiOperation({ description: 'Get all users without paginate' })
  @Get('/find')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUsers(@Res() res: Response) {
    const users = await this.userService.find();

    return res.status(HttpStatus.OK).json(users);
  }

  @ApiTags('user/search?type')
  @ApiOperation({ description: 'Get an especifics users by type' })
  @Get('/search')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUsersByType(@Res() res: Response, @Query('type') type: string) {
    const user = await this.userService.findType(type);
    return res.status(HttpStatus.OK).json(user);
  }

  @ApiTags('user/search?type')
  @ApiOperation({ description: 'Get an especifics users by rol' })
  @Get('/search')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUsersByRol(@Res() res: Response, @Query('rol') rol: string) {
    const user = await this.userService.findUsersByRol(rol);
    return res.status(HttpStatus.OK).json(user);
  }

  @ApiTags('user/:id')
  @ApiOperation({ description: 'Get an especific user by id' })
  @Get('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUserById(@Res() res: Response, @Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    return res.status(HttpStatus.OK).json(user);
  }

  @ApiTags('user/search')
  @ApiOperation({ description: 'Get an especific user by email' })
  @Get('/search')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(@Res() res: Response, @Query('email') email: string) {
    const user = await this.userService.getUserByEmail(email);

    return res.status(HttpStatus.OK).json(user);
  }

  @ApiTags('user/search')
  @ApiOperation({ description: 'Get an especific user by identification' })
  @Get('/search')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUserByIdentification(
    @Query('identification') identification: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.getUserByIdentification(identification);

    return res.status(HttpStatus.OK).json(user);
  }

  @ApiTags('user/:id')
  @ApiOperation({ description: 'Delete an especific user by id' })
  @Delete('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: number, @Res() res: Response) {
    await this.userService.deleteUser(id);

    return res.status(HttpStatus.OK).json({ message: 'deleted' });
  }

  @ApiTags('user/update/:id')
  @ApiOperation({ description: 'Update an especific user by id' })
  @Put('/update/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: number,
    @Body() userDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.updateUser(id, userDto);

    return res.status(HttpStatus.OK).json(user);
  }

  @ApiTags('user/update-pass/:id')
  @ApiOperation({ description: 'Update an especific user password by id' })
  @Put('/update-pass/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updatePasswordUser(
    @Param('id') id: number,
    @Body() passDto: UpdatePassUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.updatePasswordUser(
      id,
      passDto.password,
    );

    return res.status(HttpStatus.OK).json(user);
  }
}
