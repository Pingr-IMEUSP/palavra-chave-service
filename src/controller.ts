import { Context } from 'koa';
import { Keyword, KeywordInterface } from './db/mockdb';

interface Hash<T> {
  [key: string]: T;
}

class TagNowController {
  public static show(ctx: Context) {
    const now = new Date();

    const lastTenMinutes = Keyword.all.filter((keyword: KeywordInterface) => {
      return keyword.timestamp.getTime() >= now.getTime() - 10 * 60 * 1000;
    });

    let mostUsedKeywords: Hash<number> = {};

    lastTenMinutes.forEach(({ keyword }: { keyword: string }) => {
      if (mostUsedKeywords[`${keyword}`]) {
        mostUsedKeywords[`${keyword}`]++;
      } else {
        mostUsedKeywords[`${keyword}`] = 1;
      }
    });

    ctx.body = Object.keys(mostUsedKeywords).sort((a, b) => {
      return mostUsedKeywords[`${b}`] - mostUsedKeywords[`${a}`];
    });
  }
}

export default TagNowController;
