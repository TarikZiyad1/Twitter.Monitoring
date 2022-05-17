import { DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB, S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const tweetsArchiveS3Bucket = process.env.TweetsArchiveS3Bucket as string;
const s3 = new S3();

export const lambdaHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
    let tweet;
    for (let i = 0; i < event.Records.length; i++) {
        if (event.Records[i].dynamodb?.OldImage) {
            tweet = DynamoDB.Converter.unmarshall(event.Records[i].dynamodb?.OldImage as DynamoDB.AttributeMap);
            const key = new Date().toISOString().substring(0, 10) + '/' + uuidv4();
            const params = { Bucket: tweetsArchiveS3Bucket, Key: key, Body: JSON.stringify(tweet, null, 2) };
            await s3.upload(params).promise();
        }
    }
};
