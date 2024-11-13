# Class: AwsMessagingConnector

Class for performing messaging operations using the AWS services.

## Implements

- `IMessagingConnector`

## Constructors

### new AwsMessagingConnector()

> **new AwsMessagingConnector**(`options`): [`AwsMessagingConnector`](AwsMessagingConnector.md)

Create a new instance of IAwsConnectorConfig.

#### Parameters

• **options**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.sesConfig**: [`IAwsConnectorConfig`](../interfaces/IAwsConnectorConfig.md)

The configuration for the SES connector.

• **options.snsConfig**: [`IAwsConnectorConfig`](../interfaces/IAwsConnectorConfig.md)

The configuration for the SNS connector.

#### Returns

[`AwsMessagingConnector`](AwsMessagingConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingConnector.CLASS_NAME`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`info`): `Promise`\<`boolean`\>

Send a custom email using AWS SES.

#### Parameters

• **info**: `EmailCustomType`

The information for the custom email.

#### Returns

`Promise`\<`boolean`\>

True if the email was send successfully, otherwise undefined.

#### Implementation of

`IMessagingConnector.sendCustomEmail`

***

### createTemplate()

> **createTemplate**(`info`): `Promise`\<`boolean`\>

Create an email template.

#### Parameters

• **info**: `EmailTemplateType`

The information for the email template.

#### Returns

`Promise`\<`boolean`\>

True if the template was created successfully.

#### Implementation of

`IMessagingConnector.createTemplate`

***

### deleteTemplate()

> **deleteTemplate**(`name`): `Promise`\<`boolean`\>

Delete an email template.

#### Parameters

• **name**: `string`

The email template name to delete.

#### Returns

`Promise`\<`boolean`\>

True if the template was deleted successfully.

***

### sendMassiveEmail()

> **sendMassiveEmail**(`templateName`, `recipients`): `Promise`\<`boolean`\>

Send a massive email using a template.

#### Parameters

• **templateName**: `string`

The name of the template to use.

• **recipients**: `EmailRecipientType`[]

The recipients of the email.

#### Returns

`Promise`\<`boolean`\>

True if the email was sent successfully.

#### Implementation of

`IMessagingConnector.sendMassiveEmail`

***

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

`IMessagingConnector.sendSMS`
