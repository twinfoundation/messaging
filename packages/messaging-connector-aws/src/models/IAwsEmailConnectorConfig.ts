// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the AWS Connector.
 */
export interface IAwsEmailConnectorConfig {
	/**
	 * The endpoint for the AWS instance.
	 */
	endpoint: string;

	/**
	 * The region for the AWS instance.
	 */
	region: string;

	/**
	 * The access key ID for the AWS instance.
	 */
	accessKeyId: string;

	/**
	 * The secret access key for the AWS instance.
	 */
	secretAccessKey: string;
}
