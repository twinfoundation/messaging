// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the AWS SES Connector.
 */
export interface IAwsSESConnectorConfig {
	/**
	 * The endpoint for the AWS instance.
	 */
	endpoint: string;

	/**
	 * The region for the AWS SES instance.
	 */
	region: string;

	/**
	 * The access key ID for the AWS SES instance.
	 */
	accessKeyId: string;

	/**
	 * The secret access key for the AWS SES instance.
	 */
	secretAccessKey: string;
}
