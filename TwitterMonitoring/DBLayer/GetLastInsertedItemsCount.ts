import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TweetV2SingleStreamResult } from 'twitter-api-v2';
import { LastInsertedItemsCounts } from '../Types/commonTypes';
import { tweet_toDbItem } from './ToDbItem';

const dynamodb = new DynamoDB.DocumentClient();
const tableName = process.env.TableName || 'TwitterMonitorApp-dev-TweetsTable-15AUHOL6QJ2YM';

export async function getLastInsertedItemsCount(): Promise<number> {
    let count = 0;
    try {
        const params = {
            TableName: tableName,
            Key: {
                PK: 'Tweets#LastInsertedItemsCounts',
                SK: 'Tweets#LastInsertedItemsCounts',
            },
        };

        const dbResult = await dynamodb.get(params).promise();
        if (dbResult.Item) {
            count = (dbResult.Item as LastInsertedItemsCounts).count;
        }
    } catch (e) {
        console.log(e);
    }
    return count;
}

export async function incrementCount() {
    try {
        const params: DocumentClient.UpdateItemInput = {
            TableName: tableName,
            Key: {
                PK: 'Tweets#LastInsertedItemsCounts',
                SK: 'Tweets#LastInsertedItemsCounts',
            },
            UpdateExpression: 'SET #count = #count + :incr',
            ExpressionAttributeValues: { ':incr': 1 },
            ExpressionAttributeNames: { '#count': 'count' },
        };
        await dynamodb.update(params).promise();
    } catch (e) {
        console.log(e);
    }
}

export async function putTweet(tweet: TweetV2SingleStreamResult): Promise<void> {
    try {
        const counter = await getLastInsertedItemsCount();
        const dbItem = tweet_toDbItem(tweet, counter);
        const params: DocumentClient.PutItemInput = {
            TableName: tableName,
            Item: dbItem,
        };
        await dynamodb.put(params).promise();
        await incrementCount();
    } catch (e) {
        console.log(e);
    }
}
