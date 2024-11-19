# Class: AwsMessagingPushNotificationConnector

Class for connecting to the email messaging operations of the AWS services.

## Implements

- `IMessagingPushNotificationsConnector`

## Constructors

### new AwsMessagingPushNotificationConnector()

> **new AwsMessagingPushNotificationConnector**(`options`): [`AwsMessagingPushNotificationConnector`](AwsMessagingPushNotificationConnector.md)

Create a new instance of IAwsConnectorConfig.

#### Parameters

• **options**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.snsConfig**: [`IAwsConnectorConfig`](../interfaces/IAwsConnectorConfig.md)

The configuration for the SNS connector.

#### Returns

[`AwsMessagingPushNotificationConnector`](AwsMessagingPushNotificationConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingPushNotificationsConnector.CLASS_NAME`

## Methods

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

`IMessagingPushNotificationsConnector.createPlatformApplication`

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

`IMessagingPushNotificationsConnector.registerDevice`

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

`IMessagingPushNotificationsConnector.sendSinglePushNotification`
