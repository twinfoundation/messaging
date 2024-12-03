# Class: MessagingSmsService

Service for performing sms messaging operations to a connector.

## Implements

- `IMessagingSmsComponent`

## Constructors

### new MessagingSmsService()

> **new MessagingSmsService**(`options`?): [`MessagingSmsService`](MessagingSmsService.md)

Create a new instance of MessagingSmsService.

#### Parameters

• **options?**

The options for the connector.

• **options.messagingConnectorType?**: `string`

The type of the messaging connector to use, defaults to "messaging".

• **options.config?**: [`IMessagingConfig`](../interfaces/IMessagingConfig.md)

The configuration for the messaging service.

#### Returns

[`MessagingSmsService`](MessagingSmsService.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingSmsComponent.CLASS_NAME`

## Methods

### sendSMS()

> **sendSMS**(`phoneNumber`, `message`, `userIdentity`?, `nodeIdentity`?): `Promise`\<`boolean`\>

Send a SMS message to a phone number.

#### Parameters

• **phoneNumber**: `string`

The recipient phone number.

• **message**: `string`

The message to send.

• **userIdentity?**: `string`

The user identity to use with email messaging operations.

• **nodeIdentity?**: `string`

The node identity to use with email messaging operations.

#### Returns

`Promise`\<`boolean`\>

If the SMS was sent successfully.

#### Implementation of

`IMessagingSmsComponent.sendSMS`
