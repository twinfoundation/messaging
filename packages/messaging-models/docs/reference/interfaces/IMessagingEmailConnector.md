# Interface: IMessagingEmailConnector

Interface describing the email messaging connector functionalities

## Extends

- `IComponent`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`sender`, `info`): `Promise`\<`boolean`\>

Send a custom email.

#### Parameters

• **sender**: `string`

The sender email address.

• **info**: [`EmailCustomType`](EmailCustomType.md)

The information of the email to send.

#### Returns

`Promise`\<`boolean`\>

If the email was sent successfully.
