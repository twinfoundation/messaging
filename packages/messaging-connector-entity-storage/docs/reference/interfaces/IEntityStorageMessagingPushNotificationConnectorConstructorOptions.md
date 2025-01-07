# Interface: IEntityStorageMessagingPushNotificationConnectorConstructorOptions

Options for the entity storage messaging push notification connector.

## Properties

### loggingConnectorType?

> `optional` **loggingConnectorType**: `string`

The type of logging connector to use, defaults to no logging.

***

### messagingDeviceEntryStorageConnectorType?

> `optional` **messagingDeviceEntryStorageConnectorType**: `string`

The type of entity storage connector to use for the push notifications entries.

#### Default

```ts
push-notification-device-entry
```

***

### messagingMessageEntryStorageConnectorType?

> `optional` **messagingMessageEntryStorageConnectorType**: `string`

The type of entity storage connector to use for the push notifications entries.

#### Default

```ts
push-notification-message-entry
```
