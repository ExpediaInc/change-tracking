console.log('Loading function');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const params = {
        TableName: 'change-tracking',
        Item: JSON.parse(event.body),
    };

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'POST':
            docClient.put(params, done);
            break;
        default:
            done(new Error(JSON.stringify({
                    errMsg: `Unsupported method ${event.httpMethod}`
                })));
    }
};
