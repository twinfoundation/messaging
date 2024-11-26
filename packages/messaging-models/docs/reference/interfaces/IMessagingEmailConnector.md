# Interface: IMessagingEmailConnector

Interface describing the email messaging connector functionalities

## Extends

- `IComponent`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`sender`, `receivers`, `subject`, `content`): `Promise`\<`boolean`\>

Send a custom email.

#### Parameters

• **sender**: `string`

The sender email address.

• **receivers**: `string`[]

An array of receivers email addresses.

• **subject**: `string`

The subject of the email.

• **content**: `string`

The html content of the email.

#### Returns

`Promise`\<`boolean`\>

If the email was sent successfully.
