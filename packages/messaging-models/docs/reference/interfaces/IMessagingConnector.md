# Interface: IMessagingConnector

Interface describing a messaging connector functionalities

## Extends

- `IComponent`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`info`): `Promise`\<`boolean`\>

Send a custom email.

#### Parameters

• **info**: [`EmailCustomType`](EmailCustomType.md)

The information of the email to send.

#### Returns

`Promise`\<`boolean`\>

If the email was sent successfully.

***

### createTemplate()

> **createTemplate**(`info`): `Promise`\<`boolean`\>

Create custom template.

#### Parameters

• **info**: [`EmailTemplateType`](EmailTemplateType.md)

The email template information.

#### Returns

`Promise`\<`boolean`\>

If the template was created successfully.

***

### sendMassiveEmail()

> **sendMassiveEmail**(`templateName`, `recipients`): `Promise`\<`boolean`\>

Send a email with a template to multiple recipients.

#### Parameters

• **templateName**: `string`

The name of the template.

• **recipients**: [`EmailRecipientType`](EmailRecipientType.md)[]

The recipients of the email and their values.

#### Returns

`Promise`\<`boolean`\>

If the email was sent successfully.

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

***

### createPlatformApplication()

> **createPlatformApplication**(`applicationName`, `platformType`, `platformCredentials`): `Promise`\<`string`\>

Creates a platform application to push notifications to it.

#### Parameters

• **applicationName**: `string`

The name of the application.

• **platformType**: `string`

The type of platform used for the push notifications.

• **platformCredentials**: `string`

The credentials for the used platform.

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

***

### createTopic()

> **createTopic**(`topicName`): `Promise`\<`string`\>

Creates a topic to send notifications.

#### Parameters

• **topicName**: `string`

The name of the topic.

#### Returns

`Promise`\<`string`\>

The topic address.

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
