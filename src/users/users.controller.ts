import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt')) 
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


    @Get('search')
    searchUsers(@Query('q') query: string, @Request() req) {
        const userId = req.user._id.toString();
        return this.usersService.search(query, userId);
    }
}