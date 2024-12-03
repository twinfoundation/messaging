# Class: MessagingPushNotificationService

Service for performing push notification messaging operations to a connector.

## Implements

- `IMessagingPushNotificationsComponent`

## Constructors

### new MessagingPushNotificationService()

> **new MessagingPushNotificationService**(`options`?): [`MessagingPushNotificationService`](MessagingPushNotificationService.md)

Create a new instance of MessagingPushNotificationService.

#### Parameters

• **options?**

The options for the connector.

• **options.messagingConnectorType?**: `string`

The type of the messaging connector to use, defaults to "messaging".

• **options.config?**: [`IMessagingConfig`](../interfaces/IMessagingConfig.md)

The configuration for the messaging service.

#### Returns

[`MessagingPushNotificationService`](MessagingPushNotificationService.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingPushNotificationsComponent.CLASS_NAME`

## Methods

### registerDevice()

> **registerDevice**(`applicationId`, `deviceToken`, `userIdentity`?, `nodeIdentity`?): `Promise`\<`string`\>

Registers a device to an specific app in order to send notifications to it.

#### Parameters

• **applicationId**: `string`

The application address.

• **deviceToken**: `string`

The device token.

• **userIdentity?**: `string`

The user identity to use with push notifications messaging operations.

• **nodeIdentity?**: `string`

The node identity to use with push notifications messaging operations.

#### Returns

`Promise`\<`string`\>

If the device was registered successfully.

#### Implementation of

`IMessagingPushNotificationsComponent.registerDevice`

***

### sendSinglePushNotification()

> **sendSinglePushNotification**(`deviceAddress`, `title`, `message`, `userIdentity`?, `nodeIdentity`?): `Promise`\<`boolean`\>

Send a push notification to a device.

#### Parameters

• **deviceAddress**: `string`

The address of the device.

• **title**: `string`

The title of the notification.

• **message**: `string`

The message to send.

• **userIdentity?**: `string`

The user identity to use with push notifications messaging operations.

• **nodeIdentity?**: `string`

The node identity to use with push notifications messaging operations.

#### Returns

`Promise`\<`boolean`\>

If the notification was sent successfully.

#### Implementation of

`IMessagingPushNotificationsComponent.sendSinglePushNotification`
