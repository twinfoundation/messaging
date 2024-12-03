# Interface: IMessagingSmsComponent

Interface describing a SMS messaging component.

## Extends

- `IComponent`

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

The user identity to use with SMS messaging operations.

• **nodeIdentity?**: `string`

The node identity to use with SMS messaging operations.

#### Returns

`Promise`\<`boolean`\>

If the SMS was sent successfully.
