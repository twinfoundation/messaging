// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the entity storage messaging email connector.
 */
export interface IEntityStorageMessagingEmailConnectorConstructorOptions {
	/**
	 * The type of logging connector to use, defaults to no logging.
	 */
	loggingConnectorType?: string;

	/**
	 * The type of entity storage connector to use for the email entries.
	 * @default email-entry
	 */
	messagingEmailEntryStorageConnectorType?: string;
}
