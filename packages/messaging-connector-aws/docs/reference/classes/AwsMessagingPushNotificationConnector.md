# Class: AwsMessagingPushNotificationConnector

Class for connecting to the email messaging operations of the AWS services.

## Implements

- `IMessagingPushNotificationsConnector`

## Constructors

### new AwsMessagingPushNotificationConnector()

> **new AwsMessagingPushNotificationConnector**(`options`): [`AwsMessagingPushNotificationConnector`](AwsMessagingPushNotificationConnector.md)

Create a new instance of AwsMessagingPushNotificationConnector.

#### Parameters

• **options**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.config**: [`IAwsConnectorConfig`](../interfaces/IAwsConnectorConfig.md)

The configuration for the AWS connector.

#### Returns

[`AwsMessagingPushNotificationConnector`](AwsMessagingPushNotificationConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingPushNotificationsConnector.CLASS_NAME`

## Methods

### start()

> **start**(`nodeIdentity`, `nodeLoggingConnectorType`?): `Promise`\<`void`\>

The component needs to be started when the node is initialized.

#### Parameters

• **nodeIdentity**: `string`

The identity of the node starting the component.

• **nodeLoggingConnectorType?**: `string`

The node logging connector type, defaults to "node-logging".

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IMessagingPushNotificationsConnector.start`

***

### registerDevice()

> **registerDevice**(`applicationId`, `deviceToken`): `Promise`\<`string`\>

Registers a device to an specific app in order to send notifications to it.

#### Parameters

• **applicationId**: `string`

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
