import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { Query } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassUserDto } from './dto/update-pass-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @ApiTags('user/create')
    @ApiOperation({ description: 'Create a user with all attributes' })
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async saveUser(@Body() userCreateDto: CreateUserDto, @Res() res: Response) {
        let user = await this.userService.createUser(userCreateDto);

        return res.status(HttpStatus.CREATED).json(user);
    }

    @ApiTags('user/all')
    @ApiOperation({ description: 'Get all users without password' })
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    async getAll(@Res() res: Response) {
        let users = await this.userService.findAll();

        return res.status(HttpStatus.CREATED).send(users);
    }

    @ApiTags('user/:id')
    @ApiOperation({ description: 'Get an especific user by id' })
    @Get('/search')
    @HttpCode(HttpStatus.OK)
    async getUserById(@Res() res: Response, @Query('id') id: number) {
        let user =  await this.userService.getUserById(id);
        return res.status(HttpStatus.OK).json(user);
    }

    @ApiTags('user/search')
    @ApiOperation({ description: 'Get an especific user by email' })
    @Get('/search')
    @HttpCode(HttpStatus.OK)
    async getUserByEmail(@Res() res: Response, @Query('email') email: string) {
        let user = await this.userService.getUserByEmail(email);

        return res.status(HttpStatus.OK).json(user);
    }

    @ApiTags('user/search')
    @ApiOperation({ description: 'Get an especific user by identification' })
    @Get('/search')
    @HttpCode(HttpStatus.OK)
    async getUserByIdentification(@Query('identification') identification: string, @Res() res: Response) {
        let user = await this.userService.getUserByIdentification(identification);

        return res.status(HttpStatus.OK).json(user);
    }

    @ApiTags('user/:id')
    @ApiOperation({ description: 'Delete an especific user by id' })
    @Post('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: number, @Res() res: Response) {
        await this.userService.deleteUser(id);

        return res.send(HttpStatus.OK);
    }

    @ApiTags('user/update/:id')
    @ApiOperation({ description: 'Update an especific user by id' })
    @Put('/update/:id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id') id: number, @Body() userDto: UpdateUserDto, @Res() res: Response) {
        let user = await this.userService.updateUser(id, userDto);

        return res.status(HttpStatus.OK).json(user);
    }

    @ApiTags('user/update-pass/:id')
    @ApiOperation({ description: 'Update an especific user password by id' })
    @Put('/update-pass/:id')
    @HttpCode(HttpStatus.OK)
    async updatePasswordUser(@Param('id') id: number, @Body() passDto: UpdatePassUserDto, @Res() res: Response) {

        let user = await this.userService.updatePasswordUser(id, passDto.password);

        return res.status(HttpStatus.OK).json(user);
    }
}


