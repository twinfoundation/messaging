# Class: EntityStorageMessagingSmsConnector

Class for connecting to the SMS messaging operations of the Entity Storage.

## Implements

- `IMessagingSmsConnector`

## Constructors

### new EntityStorageMessagingSmsConnector()

> **new EntityStorageMessagingSmsConnector**(`options`?): [`EntityStorageMessagingSmsConnector`](EntityStorageMessagingSmsConnector.md)

Create a new instance of EntityStorageMessagingSmsConnector.

#### Parameters

##### options?

[`IEntityStorageMessagingSmsConnectorConstructorOptions`](../interfaces/IEntityStorageMessagingSmsConnectorConstructorOptions.md)

The options for the connector.

#### Returns

[`EntityStorageMessagingSmsConnector`](EntityStorageMessagingSmsConnector.md)

## Properties

### NAMESPACE

> `readonly` `static` **NAMESPACE**: `string` = `"entity-storage"`

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
