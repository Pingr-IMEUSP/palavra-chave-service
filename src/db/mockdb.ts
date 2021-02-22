export interface KeywordInterface {
  keyword: string;
  timestamp: Date;
}

export class Keyword {
  public static count = 0;
  public static all: KeywordInterface[] = [];
}
