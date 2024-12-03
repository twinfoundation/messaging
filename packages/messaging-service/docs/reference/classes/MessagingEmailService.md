# Class: MessagingEmailService

Service for performing email messaging operations to a connector.

## Implements

- `IMessagingEmailComponent`

## Constructors

### new MessagingEmailService()

> **new MessagingEmailService**(`options`?): [`MessagingEmailService`](MessagingEmailService.md)

Create a new instance of MessagingEmailService.

#### Parameters

• **options?**

The options for the connector.

• **options.messagingConnectorType?**: `string`

The type of the messaging connector to use, defaults to "messaging".

• **options.config?**: [`IMessagingConfig`](../interfaces/IMessagingConfig.md)

The configuration for the messaging service.

#### Returns

[`MessagingEmailService`](MessagingEmailService.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingEmailComponent.CLASS_NAME`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`sender`, `recipients`, `subject`, `content`, `userIdentity`?, `nodeIdentity`?): `Promise`\<`boolean`\>

Send a custom email.

#### Parameters

• **sender**: `string`

The sender email address.

• **recipients**: `string`[]

An array of recipients email addresses.

• **subject**: `string`

The subject of the email.

• **content**: `string`

The html content of the email.

• **userIdentity?**: `string`

The user identity to use with email messaging operations.

• **nodeIdentity?**: `string`

The node identity to use with email messaging operations.

#### Returns

`Promise`\<`boolean`\>

If the email was sent successfully.

#### Implementation of

`IMessagingEmailComponent.sendCustomEmail`
