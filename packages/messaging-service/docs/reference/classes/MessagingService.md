# Class: MessagingService

Service for performing email messaging operations to a connector.

## Implements

- `IMessagingComponent`

## Constructors

### new MessagingService()

> **new MessagingService**(`options`?): [`MessagingService`](MessagingService.md)

Create a new instance of MessagingService.

#### Parameters

• **options?**

The options for the connector.

• **options.messagingEmailConnectorType?**: `string`

The type of the email messaging connector to use, defaults to not configured.

• **options.messagingPushNotificationConnectorType?**: `string`

The type of the push notifications messaging connector to use, defaults to not configured.

• **options.messagingSmsConnectorType?**: `string`

The type of the sms messaging connector to use, defaults to not configured.

• **options.templateEntryStorageConnectorType?**: `string`

The type of the entity connector to use, defaults to "messaging-templates".

#### Returns

[`MessagingService`](MessagingService.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingComponent.CLASS_NAME`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`sender`, `recipients`, `templateId`, `data`, `locale`): `Promise`\<`boolean`\>

Send a custom email.

#### Parameters

• **sender**: `string`

The sender email address.

• **recipients**: `string`[]

An array of recipients email addresses.

• **templateId**: `string`

The id of the email template.

• **data**

The data to populate the email template.

• **locale**: `string`

The locale of the email template.

#### Returns

`Promise`\<`boolean`\>

If the email was sent successfully.

#### Implementation of

`IMessagingComponent.sendCustomEmail`

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

`IMessagingComponent.registerDevice`

***

### sendSinglePushNotification()

> **sendSinglePushNotification**(`deviceAddress`, `templateId`, `data`, `locale`): `Promise`\<`boolean`\>

Send a push notification to a device.

#### Parameters

• **deviceAddress**: `string`

The address of the device.

• **templateId**: `string`

The id of the push notification template.

• **data**

The data to populate the push notification template.

• **locale**: `string`

The locale of the push notification template.

#### Returns

`Promise`\<`boolean`\>

If the notification was sent successfully.

#### Implementation of

`IMessagingComponent.sendSinglePushNotification`

***

### sendSMS()

> **sendSMS**(`phoneNumber`, `templateId`, `data`, `locale`): `Promise`\<`boolean`\>

Send a SMS message to a phone number.

#### Parameters

• **phoneNumber**: `string`

The recipient phone number.

• **templateId**: `string`

The id of the SMS template.

• **data**

The data to populate the SMS template.

• **locale**: `string`

The locale of the SMS template.

#### Returns

`Promise`\<`boolean`\>

If the SMS was sent successfully.

#### Implementation of

`IMessagingComponent.sendSMS`

***

### createOrUpdateTemplate()

> **createOrUpdateTemplate**(`templateId`, `locale`, `title`, `content`): `Promise`\<`boolean`\>

Create or update a template.

#### Parameters

• **templateId**: `string`

The id of the template.

• **locale**: `string`

The locale of the template.

• **title**: `string`

The title of the template.

• **content**: `string`

The content of the template.

#### Returns

`Promise`\<`boolean`\>

If the template was created or updated successfully.
