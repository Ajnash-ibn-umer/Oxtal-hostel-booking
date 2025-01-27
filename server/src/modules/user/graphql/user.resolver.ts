import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Info,
  Context,
} from '@nestjs/graphql';
import { UserService } from '../service/user.service';
import {
  ListUsersResponse,
  LoginResponse,
  User,
} from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { ListUserInput } from '../dto/list-user.input';
import { GraphQLResolveInfo } from 'graphql';
import getProjection from 'src/shared/graphql/queryProjection';
import { LoginAdminInput } from '../dto/login-amin.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserTypes } from 'src/shared/decorators';
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'User_Create' })
  createCustomerUser(@Args('createUserInput') dto: CreateUserInput) {
    dto['userType'] = USER_TYPES.USER;
    return this.userService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'User_Admin_Create' })
  createAdminUser(@Args('createUserInput') dto: CreateUserInput) {
    dto['userType'] = USER_TYPES.ADMIN;
    return this.userService.create(dto);
  }

  @UseGuards(AuthGuard)
  @UserTypes([USER_TYPES.ADMIN])
  @Query(() => ListUsersResponse, { name: 'User_List' })
  listUser(
    @Args('listUserInput') dto: ListUserInput,
    @Info() info: GraphQLResolveInfo,
    @Context() context,
  ) {
    dto['userType'] = USER_TYPES.ADMIN;

    const projection = getProjection(info.fieldNodes[0]);

    return this.userService.list(dto, projection);
  }

  @Mutation(() => LoginResponse, { name: 'User_Admin_Login' })
  loginAdmin(@Args('loginAdminInput') dto: LoginAdminInput) {
    return this.userService.loginAdmin(dto);
  }
}
