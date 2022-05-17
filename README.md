# TwitterMonitoringApp

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.  

> Note since we used `TypeScript` beta feature for `SAM`, you have to run `sam build --beta-features` when building the app.

To install the latest version of the AWS SAM CLI, refer to the [installation section of the AWS SAM page](https://aws.amazon.com/serverless/sam/).

The application receive Tweeter data from the [Twitter.Streaming application](https://github.com/TarikZiyad1/Twitter.Streaming).

After you deploy the application you have to assign the generated URL in the `Outputs` to the `Twitter.Streaming` application.

The application will receive the tweets to the lambda `storeTweets` and store the last 100,000 ones into `DynamoDB` NoSQL data table.

The `storeTweets` lambda function will write new items into the table, and if the 100,000 tweets is exceeded, the items will be overwritten.

We Enabled a stream event for every `PutItem` action on the table to trigger `archiveTweets` lambda function.

The `archiveTweets` will receive the overwritten items and store them into `S3` for archiving.

## NoSQL Data Structure

To ensure that we are storing only the last 100,000 tweets, we are maintaining 
The database structure is designed as the following:

For every item we have the prporties:

- PK: This will be `Tweet#${count % 100000}`, example `Tweet#1002`
- SK: This will be always `Tweet` since we are not sorting the data for now,
- ItemType: `Tweet`, for future if we want to store another item types in the table to be aligned with the single table design.
- tweet: the JSON object of the tweet itself.

If we want to add messages/comments from other social paltform we have two options:

- Either we add it to the same item, since the documentDB is schema-less, we have the flexibility to add data as much as need
  but this option will be limited to the maximum size of the data item in `DynamoDB` which is 400kb.
- Or we can add a new Item that reference the original tweet, the structure of the item will be
  - PK: `{SocialApp#Tweet#Count}`, example `YouTube#Tweet#1002`
  - SK: `DateTime`
  - ItemType: `{message/comment}`
  - The JSON data itself.

## Anomaly Detection

The implemented anomaly detection mechanism will use `CloudWatch Anomaly Detection` service to detect the anomalies in the data streaming.

We used the metric `Invocations` for the lambda `storeTweet` to detect the anomalies the anomalies in the data we have.

If we have the number of tweets lower or below the standard deviation of the normal streaming we will have a cloudwatch alarm that will trigger an `SNS` topic to send an email.

Monitoring the anomalies in the number of tweets for a certain hashtag will help us knowing:

- if a certain topic has more interest, so we can put more adds for it.
- or a certain topic has less interest, so we can delete already existing adds of it.

## Time spent to build

The whole time: 30-35 hours.
Building the streaming and the storing and archiving the tweets : about 20 hours.
Building the alert mechanism: about 10 hours.
