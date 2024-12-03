# Class: EntityStorageMessagingSmsConnector

Class for connecting to the SMS messaging operations of the Entity Storage.

## Implements

- `IMessagingSmsConnector`

## Constructors

### new EntityStorageMessagingSmsConnector()

> **new EntityStorageMessagingSmsConnector**(`options`?): [`EntityStorageMessagingSmsConnector`](EntityStorageMessagingSmsConnector.md)

Create a new instance of EntityStorageMessagingSmsConnector.

#### Parameters

• **options?**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.messagingEntryStorageConnectorType?**: `string`

The type of entity storage connector to use for the sms entries.

• **options.config?**: `IMessagingSmsConnector`

The configuration for the sms connector.

#### Returns

[`EntityStorageMessagingSmsConnector`](EntityStorageMessagingSmsConnector.md)

## Properties

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

• **phoneNumber**: `string`

The recipient phone number.

• **message**: `string`

The message to send.

#### Returns

`Promise`\<`boolean`\>

If the SMS was sent successfully.

#### Implementation of

`IMessagingSmsConnector.sendSMS`