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

***

### createPlatformApplication()

> **createPlatformApplication**(`appName`, `platformType`, `platformCredentials`): `Promise`\<`string`\>

Creates a platform application if it does not exist.

#### Parameters

• **appName**: `string`

The name of the app.

• **platformType**: `string`

The type of platform used for the push notifications.

• **platformCredentials**: `string`

The credentials for the used platform.

#### Returns

`Promise`\<`string`\>

The platform application address.

#### Implementation of

`IMessagingConnector.createPlatformApplication`

***

### registerDevice()

> **registerDevice**(`applicationAddress`, `deviceToken`): `Promise`\<`string`\>

Registers a device to an specific app in order to send notifications to it.

#### Parameters

• **applicationAddress**: `string`

The application address.

• **deviceToken**: `string`

The device token.

#### Returns

`Promise`\<`string`\>

If the device was registered successfully.

#### Implementation of

`IMessagingConnector.registerDevice`

***

### sendSinglePushNotification()

> **sendSinglePushNotification**(`deviceAddress`, `title`, `message`): `Promise`\<`boolean`\>

Send a push notification to a device.

#### Parameters

• **deviceAddress**: `string`

The address of the device.

• **title**: `string`

The title of the notification.

• **message**: `string`

The message to send.

#### Returns

`Promise`\<`boolean`\>

If the notification was sent successfully.

#### Implementation of

`IMessagingConnector.sendSinglePushNotification`

***

### createTopic()

> **createTopic**(`topicName`): `Promise`\<`string`\>

Creates a topic if it does not exist.

#### Parameters

• **topicName**: `string`

The name of the topic.

#### Returns

`Promise`\<`string`\>

The topic address.

#### Implementation of

`IMessagingConnector.createTopic`

***

### subscribeToTopic()

> **subscribeToTopic**(`topicAddress`, `deviceAddress`): `Promise`\<`boolean`\>

Subscribes a device to a topic.

#### Parameters

• **topicAddress**: `string`

The address of the topic.

• **deviceAddress**: `string`

The address of the device.

#### Returns

`Promise`\<`boolean`\>

True if the subscription was successful.

#### Implementation of

`IMessagingConnector.subscribeToTopic`

***

### publishToTopic()

> **publishToTopic**(`topicAddress`, `title`, `message`): `Promise`\<`boolean`\>

Publishes a message to a topic.

#### Parameters

• **topicAddress**: `string`

The address of the topic.

• **title**: `string`

The title of the message.

• **message**: `string`

The message to send.

#### Returns

`Promise`\<`boolean`\>

If the message was published successfully to the topic.

#### Implementation of

`IMessagingConnector.publishToTopic`
