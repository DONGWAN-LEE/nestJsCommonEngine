import * as path from 'path';
import * as glob from 'glob';
import { Type } from '@nestjs/common';

/**
 * 주어진 상대경로(src 기준)에서 .ts 파일을 찾아 클래스를 로딩
 * @param relativeDirPath 예: 'src/common/database/master'
 */
export async function loadClassesFromDir(relativeDirPath: string): Promise<Type<unknown>[]> {
  const ext = '.ts'; // 개발 환경에서 .ts 강제
  const absolutePath = path.resolve(process.cwd(), relativeDirPath).split(path.sep).join('/');
  const pattern = `${absolutePath}/**/*${ext}`;
  const files = glob.sync(pattern);
  const classes: Type<unknown>[] = [];

  console.log('[DEBUG] 패턴:', pattern);
  console.log('[DEBUG] 찾은 파일 수:', files.length);

  for (const file of files) {
    try {
      const module = await import(`file://${file}`);
      for (const key in module) {
        const exported = module[key];
        if (typeof exported === 'function') {
          classes.push(exported);
        }
      }
    } catch (err) {
      console.error(`⚠️ ${file} 로딩 실패:`, err);
    }
  }

  return classes;
}

