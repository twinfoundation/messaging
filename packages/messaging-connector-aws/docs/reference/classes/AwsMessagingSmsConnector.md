# Class: AwsMessagingSmsConnector

Class for connecting to the SMS messaging operations of the AWS services.

## Implements

- `IMessagingSmsConnector`

## Constructors

### new AwsMessagingSmsConnector()

> **new AwsMessagingSmsConnector**(`options`): [`AwsMessagingSmsConnector`](AwsMessagingSmsConnector.md)

Create a new instance of AwsMessagingSmsConnector.

#### Parameters

• **options**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.config**: [`IAwsConnectorConfig`](../interfaces/IAwsConnectorConfig.md)

The configuration for the AWS connector.

#### Returns

[`AwsMessagingSmsConnector`](AwsMessagingSmsConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingSmsConnector.CLASS_NAME`

## Methods

### sendSMS()

> **sendSMS**(`phoneNumber`, `message`): `Promise`\<`boolean`\>

Send a SMS message to a phone number.

#### Parameters

• **phoneNumber**: `string`

The recipient phone number.

• **message**: `string`

The message to send.

#### Returns

`Promise`\<`boolean`\>

If the SMS was sent successfully.

#### Implementation of

`IMessagingSmsConnector.sendSMS`
