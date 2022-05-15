import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TweetV2SingleStreamResult } from 'twitter-api-v2';

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
    try {
        const tweet: TweetV2SingleStreamResult = JSON.parse(event.body as string);
        console.log('🚀 ~ file: storeTweets.ts ~ line 18 ~ lambdaHandler ~ tweet', tweet);
    } catch (err) {
        console.log(err);
        const response: APIGatewayProxyResult = {
            statusCode: 500,
            body: JSON.stringify({
                message: JSON.stringify(err),
            }),
        };
    }

    return {
        statusCode: 200,
        body: '',
    };
};
console.log('s');
