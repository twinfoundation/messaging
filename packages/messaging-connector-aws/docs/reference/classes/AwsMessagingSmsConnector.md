# Class: AwsMessagingSmsConnector

Class for connecting to the SMS messaging operations of the AWS services.

## Implements

- `IMessagingSmsConnector`

## Constructors

### Constructor

> **new AwsMessagingSmsConnector**(`options`): `AwsMessagingSmsConnector`

Create a new instance of AwsMessagingSmsConnector.

#### Parameters

##### options

[`IAwsMessagingSmsConnectorConstructorOptions`](../interfaces/IAwsMessagingSmsConnectorConstructorOptions.md)

The options for the connector.

#### Returns

`AwsMessagingSmsConnector`

## Properties

### NAMESPACE

> `readonly` `static` **NAMESPACE**: `string` = `"aws"`

The namespace for the connector.

***

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingSmsConnector.CLASS_NAME`

## Methods

### sendSMS()

> **sendSMS**(`phoneNumber`, `message`): `Promise`\<`boolean`\>

Send a SMS message to a phone number.

#### Parameters

##### phoneNumber

`string`

The recipient phone number.

##### message

`string`

The message to send.

#### Returns

`Promise`\<`boolean`\>

If the SMS was sent successfully.

#### Implementation of

`IMessagingSmsConnector.sendSMS`
