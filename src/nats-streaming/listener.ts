import { Message } from 'node-nats-streaming';
import { stan } from './stan';
import { Keyword } from '../db/mockdb';

interface PingInterface {
  id: number;
  author: string;
  text: string;
  hashtags: string[];
  mentions: string[];
}

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const createdPing = stan.subscribe('PING_CREATED_WITH_KEYWORDS', replayAllOpts);

  //João Corno
  createdPing.on('message', (msg: Message): void => {
    const ping: PingInterface = JSON.parse(msg.getData() as string);

    ping.hashtags.forEach((hashtag: string) => {
      const newKeyword = { id: ++Keyword.count, keyword: hashtag, timestamp: new Date() };

      if (!Keyword.all.some(({ keyword }: { keyword: string }) => keyword === hashtag)) {
        stan.publish('KEYWORD_CREATED', JSON.stringify(newKeyword));
      }

      Keyword.all.push(newKeyword);
      console.log('[PING_CREATED_WITH_KEYWORDS]:', hashtag);
    });
  });
}
