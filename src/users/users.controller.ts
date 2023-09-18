import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserValidationPipe } from '../pipes/create-user-validation.pipe';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'get all users' })
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @UsePipes(new CreateUserValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
