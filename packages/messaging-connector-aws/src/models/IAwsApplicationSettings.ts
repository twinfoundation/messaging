// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the AWS Application Settings.
 */
export interface IAwsApplicationSettings {
	/**
	 * The application identificator to send the push notifications.
	 */
	applicationId: string;

	/**
	 * The type of push notifications platform.
	 */
	pushNotificationsPlatformType: string;

	/**
	 * The credentials for the push notifications platform.
	 */
	pushNotificationsPlatformCredentials: string;
}
