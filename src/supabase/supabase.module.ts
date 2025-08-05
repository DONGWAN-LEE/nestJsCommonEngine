// src/supabase/supabase.module.ts

import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseEdgeService } from './supabaseEdge.service';

@Module({
  providers: [SupabaseService, SupabaseEdgeService],
  exports: [SupabaseService, SupabaseEdgeService],
})

export class SupabaseModule {}
