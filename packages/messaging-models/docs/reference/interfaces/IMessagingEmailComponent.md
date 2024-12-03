# Interface: IMessagingEmailComponent

Interface describing an email messaging component.

## Extends

- `IComponent`

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
