import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:process.env.SECRET_KEY
    });
  }

  async validate(payload){
    const { email } = payload;
    
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }      

    return user;
  }
}