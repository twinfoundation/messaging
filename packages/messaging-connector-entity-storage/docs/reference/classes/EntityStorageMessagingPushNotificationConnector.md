# Class: EntityStorageMessagingPushNotificationConnector

Class for connecting to the push notifications messaging operations of the Entity Storage.

## Implements

- `IMessagingPushNotificationsConnector`

## Constructors

### new EntityStorageMessagingPushNotificationConnector()

> **new EntityStorageMessagingPushNotificationConnector**(`options`?): [`EntityStorageMessagingPushNotificationConnector`](EntityStorageMessagingPushNotificationConnector.md)

Create a new instance of EntityStorageMessagingPushNotificationConnector.

#### Parameters

• **options?**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.messagingEntryStorageConnectorType?**: `string`

The type of entity storage connector to use for the push notifications entries.

• **options.config?**: `IMessagingPushNotificationsConnector`

The configuration for the push notifications connector.

#### Returns

[`EntityStorageMessagingPushNotificationConnector`](EntityStorageMessagingPushNotificationConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingPushNotificationsConnector.CLASS_NAME`

## Methods

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
