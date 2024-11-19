# Interface: IMessagingPushNotificationsConnector

Interface describing the push notifications messaging connector functionalities

## Extends

- `IComponent`

## Methods

### createPlatformApplication()

> **createPlatformApplication**(`applicationName`, `platformType`, `platformCredentials`): `Promise`\<`string`\>

Creates a platform application to push notifications to it.

#### Parameters

• **applicationName**: `string`

The name of the application.

• **platformType**: `string`

The type of platform used for the push notifications.

• **platformCredentials**: `string`

The credentials for the platform auth.

#### Returns

`Promise`\<`string`\>

The platform application address.

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

The device registered address.

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
