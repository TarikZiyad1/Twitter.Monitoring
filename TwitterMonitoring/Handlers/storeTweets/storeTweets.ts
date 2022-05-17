import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TweetV2SingleStreamResult } from 'twitter-api-v2';
import { putTweet } from '../../DBLayer/GetLastInsertedItemsCount';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const tweet: TweetV2SingleStreamResult = JSON.parse(event.body as string);
        putTweet(tweet);
    } catch (err) {
        console.log(err);
    }

    return {
        statusCode: 200,
        body: '',
    };
};
