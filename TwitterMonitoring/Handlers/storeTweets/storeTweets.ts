import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TweetV2SingleStreamResult } from 'twitter-api-v2';
import { putTweet } from '../../DBLayer/GetLastInsertedItemsCount';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('🐱‍🏍', JSON.stringify(event, null, 2));
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
