// supabaseEdge.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SupabaseEdgeService {
  async insertViaEdgeFunction(book: any) {
    const response = await axios.post(
      `${process.env.SUPABASE_URL}.functions.supabase.co/insert-book`,
      { book },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
