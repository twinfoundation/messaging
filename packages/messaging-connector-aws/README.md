# TWIN Messaging Connector AWS

Messaging connector implementation using the AWS functions.

## Installation

```shell
npm install @twin.org/messaging-connector-aws
```

## Testing

The tests developed are functional tests and need an AWS SES simulator up and running. To run AWS SES locally:

```sh
docker run -p 8005:8005  --name twin-messaging-connector-aws-ses adrianmssiota/ses-local-test-server:latest
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
