import { Injectable } from '@nestjs/common';
import { MasterDatabaseService } from '../../../common/database/master_database.service';
import * as puppeteer from 'puppeteer';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as emojiStrip from 'emoji-strip';

@Injectable()
export class GooglePlayService {
  constructor(
    private readonly masterDatabaseService: MasterDatabaseService,
  ) {
  }

  async crawlAllReviewsStepByStep(appId: string, steps: number, scrollsPerStep: number) {
    const url = `https://play.google.com/store/apps/details?id=${appId}&hl=ko`;
    const browser = await puppeteer.launch({ headless: false, args: ['--disable-setuid-sandbox', '--ignore-certificate-errors'] });
    const page = await browser.newPage();
  
    await page.goto(url, { waitUntil: 'networkidle2' });
    await this.openReviewModal(page);
    await this.clickLatestSortOption(page);

    const allReviews = await page.evaluate(() => {
      const reviewNodes = document.querySelectorAll('div.RHo1pe');
      return Array.from(reviewNodes).map((node) => {
        const userName = node.querySelector('.X5PpBb')?.textContent || '';
        const text = node.querySelector('.h3YV2d')?.textContent || '';
        const date = node.querySelector('.bp9Aid')?.textContent || '';
        const scoreText = node.querySelector('[role="img"]')?.getAttribute('aria-label') || '';
        const scoreMatch = scoreText.match(/(\d+)개를 받았습니다/);
        const score = scoreMatch ? Number(scoreMatch[1]) : null;
        return { userName, text, date, score };
      }, { timeout: 60000 });
    });

    await this.addGooglePlayReview(allReviews);

    for (let step = 0; step < steps; step++) {
      const reviews = await this.scrollAndGetNewReviews(page, step, scrollsPerStep);
      console.log(`✅ STEP ${step + 1}: ${reviews.length}개 수집`);
      await this.addGooglePlayReview(reviews);
    }
  
    // console.log("FINISH!")
    await browser.close(); // 마지막에만 종료
  }

  async openReviewModal(page: puppeteer.Page) {
    const moreButtonSelector = 'button[aria-label="평점 및 리뷰 자세히 알아보기"]';
    await page.waitForSelector(moreButtonSelector, { timeout: 12000 });
    await page.click(moreButtonSelector);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  async clickLatestSortOption(page: puppeteer.Page) {
    // 1. 정렬 메뉴 열기 (관련성순 버튼 클릭)
    const sortButtonSelector = 'div[role="button"][aria-label="관련성순"]';
    await page.waitForSelector(sortButtonSelector, { timeout: 10000 });
    await page.click(sortButtonSelector);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    // 최신 항목 위치 계산 및 click
    const latestBox = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('span[role="menuitemradio"]'));
      const latestItem = items.find(el => el.getAttribute('aria-label') === '최신');
      if (!latestItem) return null;
      const rect = latestItem.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });

  if (latestBox) {
    await page.mouse.click(latestBox.x, latestBox.y, { delay: 100 });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('✅ 최신 클릭 성공');
  } else {
    console.warn('❌ 최신 항목 찾기 실패');
  }
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async scrollAndGetNewReviews(page: puppeteer.Page, stepIndex: number, scrollsPerStep: number) {
    const modalSelector = 'div[role="dialog"][aria-modal="true"]';
    const scrollContainerSelector = `${modalSelector} .fysCi`;
  
    const prevCount = await page.evaluate(() => document.querySelectorAll('div.RHo1pe').length);

    for (let i = 0; i < scrollsPerStep; i++) {
      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        el?.scrollBy(0, 1000);
      }, scrollContainerSelector);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  
    const allReviews = await page.evaluate(() => {
      const reviewNodes = document.querySelectorAll('div.RHo1pe');
      return Array.from(reviewNodes).map((node) => {
        const userName = node.querySelector('.X5PpBb')?.textContent || '';
        const text = node.querySelector('.h3YV2d')?.textContent || '';
        const date = node.querySelector('.bp9Aid')?.textContent || '';
        const scoreText = node.querySelector('[role="img"]')?.getAttribute('aria-label') || '';
        const scoreMatch = scoreText.match(/(\d+)개를 받았습니다/);
        const score = scoreMatch ? Number(scoreMatch[1]) : null;
        return { userName, text, date, score };
      }, { timeout: 60000 });
    });
  
    return allReviews.slice(prevCount); // 🎯 새로 생긴 것만 반환
  }

  async dateParser(date_str: string){
    dayjs.extend(customParseFormat);

    // dayjs는 포맷 문자열을 명확히 줘야 함
    const parsedDate = dayjs(date_str, 'YYYY년 M월 D일');
    return parsedDate.toISOString(); // 2023-08-13T15:00:00.000Z (KST 기준)
  }

  async addGooglePlayReview(reviews: Object) {
    // console.log(reviews);
    // Object.entries(reviews).forEach(async ([key, value], index) => {
    //   let add_params = {};
    //   add_params = {
    //     userName: reviews[key].userName, 
    //     review_comment: emojiStrip(reviews[key].text),
    //     score: reviews[key].score,
    //     createDate: await this.dateParser(reviews[key].date)
    //   }

    //   await this.masterDatabaseService.add_review(add_params);
      
    // });
  }
}
