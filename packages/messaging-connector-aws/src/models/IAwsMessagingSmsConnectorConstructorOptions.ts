// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAwsSmsConnectorConfig } from "./IAwsSmsConnectorConfig";

/**
 * Options for the AWS messaging SMS connector.
 */
export interface IAwsMessagingSmsConnectorConstructorOptions {
	/**
	 * The type of logging connector to use, defaults to no logging.
	 */
	loggingConnectorType?: string;

	/**
	 * The configuration for the connector.
	 */
	config: IAwsSmsConnectorConfig;
}
