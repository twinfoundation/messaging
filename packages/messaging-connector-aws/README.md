# TWIN Messaging Connector AWS

Messaging connector implementation using the AWS functions.

## Installation

```shell
npm install @twin.org/messaging-connector-aws
```

## Testing

The tests developed are functional tests and need an AWS simulator with the SES and SNS services up and running.
The AWS SNS simulator can't send real SMS messages nor push notifications but simulates the server response accordingly.

To run AWS locally:

```sh

docker run -p 4866:4566 --name twin-messaging-aws -d localstack/localstack -e AWS_DEFAULT_REGION='eu-central-1' -e AWS_ACCESS_KEY_ID='test' -e AWS_SECRET_ACCESS_KEY='test' -e SERVICE='SNS,SES'
```

Afterwards you can run the tests as follows:

```sh
npm run test
```

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)
