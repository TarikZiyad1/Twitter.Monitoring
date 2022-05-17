import { APIGatewayProxyEvent, APIGatewayProxyResult, DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB, DynamoDBStreams, S3 } from 'aws-sdk';
import { TweetV2SingleStreamResult } from 'twitter-api-v2';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const tweetsArchiveS3Bucket = process.env.TweetsArchiveS3Bucket as string;
const s3 = new S3();

export const lambdaHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
    console.log('🐱‍🏍', JSON.stringify(event, null, 2));
    let tweet;
    for (let i = 0; i < event.Records.length; i++) {
        if (event.Records[i].dynamodb?.OldImage) {
            console.log(
                '🚀🚀 ~ file: archiveTweets.ts ~ line 23 ~ lambdaHandler ~ event.Records[i].dynamodb?.OldImage',
                event.Records[i].dynamodb?.OldImage,
            );
            tweet = DynamoDB.Converter.unmarshall(event.Records[i].dynamodb?.OldImage as DynamoDB.AttributeMap);
            console.log('🚀 ~ file: archiveTweets.ts ~ line 22 ~ lambdaHandler ~ tweet', tweet);
            const key = new Date().toISOString().substring(0, 10) + '/' + uuidv4();
            const params = { Bucket: tweetsArchiveS3Bucket, Key: key, Body: JSON.stringify(tweet, null, 2) };
            await s3.upload(params).promise();
        }
    }
};

// lambdaHandler({
//     Records: [
//         {
//             eventID: 'f801df58751d2783204045b14c4ac4aa',
//             eventName: 'INSERT',
//             eventVersion: '1.1',
//             eventSource: 'aws:dynamodb',
//             awsRegion: 'us-east-1',
//             dynamodb: {},
//             eventSourceARN:
//                 'arn:aws:dynamodb:us-east-1:105361737748:table/TwitterMonitorApp-dev-TweetsTable-15AUHOL6QJ2YM/stream/2022-05-15T13:41:58.259',
//         },
//     ],
// }).then();
