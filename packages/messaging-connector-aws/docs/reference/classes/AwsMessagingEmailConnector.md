# Class: AwsMessagingEmailConnector

Class for connecting to the email messaging operations of the AWS services.

## Implements

- `IMessagingEmailConnector`

## Constructors

### new AwsMessagingEmailConnector()

> **new AwsMessagingEmailConnector**(`options`): [`AwsMessagingEmailConnector`](AwsMessagingEmailConnector.md)

Create a new instance of AwsMessagingEmailConnector.

#### Parameters

• **options**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.config**: [`IAwsConnectorConfig`](../interfaces/IAwsConnectorConfig.md)

The configuration for the SES connector.

#### Returns

[`AwsMessagingEmailConnector`](AwsMessagingEmailConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingEmailConnector.CLASS_NAME`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`sender`, `recipients`, `subject`, `content`): `Promise`\<`boolean`\>

Send a custom email using AWS SES.

#### Parameters

• **sender**: `string`

The sender email address.

• **recipients**: `string`[]

An array of recipients email addresses.

• **subject**: `string`

The subject of the email.

• **content**: `string`

The html content of the email.

#### Returns

`Promise`\<`boolean`\>

True if the email was send successfully, otherwise undefined.

#### Implementation of

`IMessagingEmailConnector.sendCustomEmail`
