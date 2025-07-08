// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAwsEmailConnectorConfig } from "./IAwsEmailConnectorConfig";

/**
 * Options for the AWS messaging email connector.
 */
export interface IAwsMessagingEmailConnectorConstructorOptions {
	/**
	 * The type of logging connector to use, defaults to no logging.
	 */
	loggingConnectorType?: string;

	/**
	 * The configuration for the connector.
	 */
	config: IAwsEmailConnectorConfig;
}
