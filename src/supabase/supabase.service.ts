// src/supabase/supabase.service.ts

import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { decode } from 'html-entities';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    console.log(process.env.API_EXTERNAL_URL)
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );
  }

  // 예: 테이블에서 데이터 가져오기
  async getUsers() {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // 예: 데이터 삽입
  async createUser(user: { name: string; email: string }) {
    const { data, error } = await this.supabase.from('users').insert([user]);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getBookIsbn() {
    // const { data, error } = await this.supabase.from('book_isbn').select('*').range(0, 9);
    const { data, error } = await this.supabase.from('book_isbn').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // 예: 인증 처리
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async insertBooks(bookList: any[]) {
    for (const book of bookList) {
      try {
        const { data, error } = await this.supabase
          .from('book_info')
          .insert([{
            title: book.title,
            link: decode(book.link),
            author: book.author,
            pub_date: new Date(book.pubDate),
            description: book.description,
            isbn: book.isbn,
            isbn13: book.isbn13,
            item_id: book.itemId,
            price_sales: book.priceSales,
            price_standard: book.priceStandard,
            mall_type: book.mallType,
            stock_status: book.stockStatus || '',
            mileage: book.mileage,
            cover: decode(book.cover || ''),
            category_id: book.categoryId,
            category_name: book.categoryName,
            publisher: book.publisher,
            sales_point: book.salesPoint,
            is_adult: book.adult,
            fixed_price: book.fixedPrice,
            review_rank: book.customerReviewRank,
            subtitle: book.subInfo?.subTitle || '',
            item_page: book.subInfo?.itemPage || null,
            region: '서울',
            rental_flg: 0,
          }]);

          if (error) {
            console.error(`❌ Insert failed for ISBN: ${book.isbn13}`);
            console.error('📦 Payload:', {
              link: decode(book.link),
              cover: decode(book.cover),
              isbn13: book.isbn13
            });
            console.error('📛 Error:', error);
          } else {
            console.log(`✅ Inserted: ${book.title}`);
          }
      } catch (err) {
          console.error('❗ Unexpected error:', err);
      }
    }
  }


  // ✅ insert 실행 함수
  async insertDummyIsbns() {
      const { data, error } = await this.supabase.from('book_test').insert([{
        isbn: '1234567890',
        title: '테스트 도서',
        region: '서울',
        rental_flg: 0,
        pub_date: new Date(),
      }]);
      console.log('📚 더미 ISBN 삽입 결과:', data);
      if (error) {
        console.error('📛 에러:', error);
      }
  }
}
