import { DynamoDB } from 'aws-sdk';
import { LastInsertedItemsCounts } from '../Types/commonTypes';

const dynamodb = new DynamoDB();

async function getLastInsertedItemsCount(): Promise<number> {
    try {
        const params: DynamoDB.Types.GetItemInput = {
            TableName: 'TwitterMonitorApp-dev-TweetsTable-15AUHOL6QJ2YM',
            Key: {
                PK: {
                    S: 'Tweets#LastInsertedItemsCounts',
                },
                SK: {
                    S: 'Tweets#LastInsertedItemsCounts',
                },
            },
        };
        const dbResult = await dynamodb.getItem(params).promise();
        const dbItem = dbResult.Item as LastInsertedItemsCounts;
        console.log('🚀 ~ file: GetLastInsertedItemsCount.ts ~ line 21 ~ getLastInsertedItemsCount ~ dbItem', dbItem);
        return dbItem.LastInsertedItemsCounts;
    } catch (e) {
        console.log(e);
    }
    return 0;
}
getLastInsertedItemsCount().then();
