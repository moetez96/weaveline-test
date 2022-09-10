import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/shared/repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService){};

    signUser(user: any){
        return {accessToken: this.jwtService.sign({
            id: user._id,
            fullName: user.fullName
        })};
    }
}
