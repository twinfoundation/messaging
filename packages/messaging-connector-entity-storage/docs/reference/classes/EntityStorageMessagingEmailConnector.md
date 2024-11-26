# Class: EntityStorageMessagingEmailConnector

Class for connecting to the email messaging operations of the Entity Storage.

## Implements

- `IMessagingEmailConnector`

## Constructors

### new EntityStorageMessagingEmailConnector()

> **new EntityStorageMessagingEmailConnector**(`options`?): [`EntityStorageMessagingEmailConnector`](EntityStorageMessagingEmailConnector.md)

Create a new instance of EntityStorageMessagingEmailConnector.

#### Parameters

• **options?**

The options for the connector.

• **options.loggingConnectorType?**: `string`

The type of logging connector to use, defaults to no logging.

• **options.messagingEntryStorageConnectorType?**: `string`

The type of entity storage connector to use for the email entries.

• **options.config?**: `IMessagingEmailConnector`

The configuration for the email connector.

#### Returns

[`EntityStorageMessagingEmailConnector`](EntityStorageMessagingEmailConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IMessagingEmailConnector.CLASS_NAME`

## Methods

### sendCustomEmail()

> **sendCustomEmail**(`sender`, `recipients`, `subject`, `content`): `Promise`\<`boolean`\>

Store a custom email using Entity Storage.

#### Parameters

• **sender**: `string`

The sender email address.

• **recipients**: `string`[]

An array of recipients email addresses.

• **subject**: `string`

The subject of the email.

• **content**: `string`

The html content of the email.

#### Returns

`Promise`\<`boolean`\>

True if the email was send successfully, otherwise undefined.

#### Implementation of

`IMessagingEmailConnector.sendCustomEmail`
