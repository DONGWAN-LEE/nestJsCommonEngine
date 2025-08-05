// aladin.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AladinService {
  private readonly TTB_KEY = process.env.ALADIN_TTB_KEY;
  private readonly BASE_URL = process.env.ALADIN_API_URL;

  constructor(private readonly httpService: HttpService) {}

  async searchBooks(keyword: string) {
    const params = {
      ttbkey: this.TTB_KEY,
      Query: keyword,
      QueryType: 'Keyword',
      MaxResults: 10,
      start: 1,
      SearchTarget: 'Book',
      output: 'js',
      Version: '20131101',
    };

    const { data } = await lastValueFrom(
      this.httpService.get(this.BASE_URL, { params }),
    );

    return data?.item ?? [];
  }

  async lookupByISBN(isbn13: string) {
    const url = 'https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx';
  
    const params = {
      ttbkey: this.TTB_KEY,
      itemIdType: 'ISBN13', // 또는 ISBN
      ItemId: isbn13,
      output: 'js',
      Version: '20131101',
    };
  
    const { data } = await lastValueFrom(
      this.httpService.get(url, { params }),
    );
  
    return data?.item?.[0] ?? null;
  }
  
  // aladin.service.ts
  async lookupMultipleISBNs(isbnList: string[]) {
    const results = [];
  
    for (const isbn of isbnList) {
      const data = await this.lookupByISBN(isbn);
      if (data) {
        results.push(data);
      }
    }
  
    return results;
  }
  
  // 또는 병렬 처리 (주의: 호출 제한에 유의)
  async lookupMultipleISBNsParallel(isbnList: string[]) {
    const promises = isbnList.map((isbn) => this.lookupByISBN(isbn));
    const results = await Promise.all(promises);
    return results.filter((item) => item != null);
  }
  
}
