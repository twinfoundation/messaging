// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the entity storage messaging SMS connector.
 */
export interface IEntityStorageMessagingSmsConnectorConstructorOptions {
	/**
	 * The type of logging connector to use, defaults to no logging.
	 */
	loggingConnectorType?: string;

	/**
	 * The type of entity storage connector to use for the sms entries.
	 * @default sms-entry
	 */
	messagingSmsEntryStorageConnectorType?: string;
}
