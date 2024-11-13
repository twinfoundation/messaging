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
