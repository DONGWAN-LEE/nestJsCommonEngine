import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserV1_0_0Module } from '../../v1_0_0/user/user.module';
// import { UserV1_0_4Module } from '../../v1_0_4/user/user.module';


@Module({
  imports: [
    UserV1_0_0Module,
    // UserV1_0_4Module,
    RouterModule.register([
      {
        path:'v1_0_0',
        module: UserV1_0_0Module
      },
      // {
      //   path:'v1_0_4',
      //   module: UserV1_0_4Module
      // }
    ])
  ],
})

export class UserModule {}
