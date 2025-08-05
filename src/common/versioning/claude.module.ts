import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClaudeV1_0_0Module } from '../../v1_0_0/ai/claude/claude.module';
// import { GameV1_0_4Module } from '../../v1_0_4/game/game.module';

@Module({
  imports: [
    ClaudeV1_0_0Module,
    // GameV1_0_4Module,
    RouterModule.register([
      {
        path:'v1_0_0',
        module: ClaudeV1_0_0Module
      },
      // {
      //   path:'v1_0_4',
      //   module: GameV1_0_4Module
      // }
    ])
    
  ]
})
export class ClaudeModule {}
