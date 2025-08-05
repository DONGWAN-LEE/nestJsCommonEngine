import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { promises } from 'dns';

@Injectable()
export class CommonService {
  constructor(
  ) {}

  private readonly secretKey = 'ppteamScret';
  private readonly algorithm = 'aes-256-ctr';
  
  private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  private readonly IV_LENGTH = 16; // For AES, this is always 16

  async trim(str: any) {
    // String check
    if(str.replace(/(\s*)/g, "")){
      return true;
    }else{
      return false;
    }
  }

  async encrypt(text: string) {

    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.ENCRYPTION_KEY),
      iv,
    )
    const encrypted = cipher.update(text)

    return (
      iv.toString('hex') +
      ':' +
      Buffer.concat([encrypted, cipher.final()]).toString('hex')
    )
  }

  async decrypt(text: string) {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.ENCRYPTION_KEY),
      iv,
    )
    const decrypted = decipher.update(encryptedText)

    return Buffer.concat([decrypted, decipher.final()]).toString()
  }


  // async encrypt(text: string) {
  //   const cipher = crypto.createCipher(this.algorithm, this.secretKey);
  //   let encrypted = cipher.update(text, 'utf8', 'hex');
  //   encrypted += cipher.final('hex');
  //   return encrypted;
  // }

  // async decrypt(encryptedText: string) {
  //   const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
  //   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  //   decrypted += decipher.final('utf8');
  //   return decrypted;
  // }

  async datetimeReplace(str: any) {
    let total_str = "";

    total_str = str.replace(/-/g, "");
    total_str = total_str.replace(/(\s*)/g, "");
    total_str = total_str.replace(/:/g, "");

    return total_str;
  }

  async count(obj: any){
    return Object.keys(obj).length;
  }

  async now(unit: string = null) {
    const hrTime = process.hrtime();
    
    switch (unit) {
      case 'milli':
        return hrTime[0] * 1000 + hrTime[1] / 1000000;
      case 'micro':
        return hrTime[0] * 1000000 + hrTime[1] / 1000;
      case 'nano':
        return hrTime[0] * 1000000000 + hrTime[1] / 100;
      default:
        return hrTime[0] * 1000000000 + hrTime[1];
    }
  }

  async unix_timestamp() {
    return Math.floor((new Date()).getTime() / 1000);
  }

  async retData(code, errmsg, ret) {
    let json_data = {};
    json_data['code'] = code;
    json_data['errmsg'] = errmsg;
    json_data['data'] = ret;

    let ret_data = {};

    ret_data['res'] = JSON.stringify(json_data);

    if(process.env.SERVER_NAME != "LIVE"){
      console.log(ret_data);
    }

    return ret_data;
  }

  async write_access_log(req: any) {
    const ip = await this.get_user_ip(req);

    // console.log(ip);
    const date = new Date();
    // Error Log 를 파일로 남긴다.
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hour = ('0' + date.getHours()).slice(-2);
    let min = ('0' + date.getMinutes()).slice(-2);
    let sec = ('0' + date.getSeconds()).slice(-2);

    const today = `${year}-${month}-${day}`
    const time =  `${hour}:${min}:${sec}`
    
    const fs = require('fs');
    const directory = fs.existsSync("./log");

    if(!directory) fs.mkdirSync("./log");
    let fd = fs.openSync(`./log/access_log_${today}.txt`, "a");

    let file = "";
    file += `${today} ${time} :: ${ip}` + "\n";
    
    fs.appendFileSync(fd, file, "utf8");
  }

  async get_user_ip(req: any){
    let ip = (req.headers['x-forwarded-for'] as string) || req.ip;
    let replace_ip = ip.replaceAll(':', '').replaceAll('f', '');

    return replace_ip;
  }

  async sortByValueDescExcludeZero(obj: Record<string, number>): Promise<Record<string, string>> {
    return Object.entries(obj)
      .filter(([, value]) => value !== 0)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [key, value]) => {
        acc[key] = 'DESC';
        return acc;
      }, {} as Record<string, string>);
  }

  async getTodayYYYYMMDD(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 0부터 시작
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}${month}${day}`; // 예: 20250523
  }

  async subtractOneDay(dateString: string): Promise<string> {
    // 1. 문자열을 Date 객체로 변환
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // JS는 0-indexed month
    const day = parseInt(dateString.substring(6, 8), 10);
  
    const date = new Date(year, month, day);
  
    // 2. 하루 빼기 (밀리초 기준)
    date.setDate(date.getDate() - 1);
  
    // 3. YYYYMMDD 포맷으로 변환
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');
  
    return `${newYear}${newMonth}${newDay}`;
  }

  async cleanJsonBlock(input: string): Promise<string> {
    // 앞의 ```json 또는 ``` 제거
    return input.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '');
  }

  async cleanJsonBlock2(input: string): Promise<string> {
    // 앞의 ```json 또는 ``` 제거
    return input.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\n$/, '').replaceAll("\n" , "");
  }

  // utils/random.util.ts

  async getTwoUniqueRandomInts(min: number, max: number): Promise<[number, number]> {
    if (max - min < 1) {
      throw new Error('범위가 2개 이상의 고유 숫자를 생성할 수 없습니다.');
    }
  
    const first = await this.getRandomInt(min, max);
    let second: number;
  
    do {
      second = await this.getRandomInt(min, max);
    } while (second === first);
  
    return [first, second];
  }
  
  async getRandomInt(min: number, max: number): Promise<number> {
    const ceilMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
  }
}