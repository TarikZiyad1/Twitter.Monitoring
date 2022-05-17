import { TweetV2SingleStreamResult } from 'twitter-api-v2';

export function tweet_toDbItem(tweet: TweetV2SingleStreamResult, count: number) {
    return {
        PK: `Tweet#${count % 100000}`,
        SK: 'Tweet',
        ItemType: 'Tweet',
        ...tweet,
    };
}
