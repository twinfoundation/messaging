# Interface: IMessagingPushNotificationsComponent

Interface describing a push notifications messaging component.

## Extends

- `IComponent`

## Methods

### registerDevice()

> **registerDevice**(`applicationAddress`, `deviceToken`, `userIdentity`?, `nodeIdentity`?): `Promise`\<`string`\>

Registers a device to an specific app in order to send notifications to it.

#### Parameters

• **applicationAddress**: `string`

The application address.

• **deviceToken**: `string`

The device token.

• **userIdentity?**: `string`

The user identity to use with push notifications messaging operations.

• **nodeIdentity?**: `string`

The node identity to use with push notifications messaging operations.

#### Returns

`Promise`\<`string`\>

The device registered address.

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
