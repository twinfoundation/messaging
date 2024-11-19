// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing the push notifications messaging connector functionalities
 */
export interface IMessagingPushNotificationsConnector extends IComponent {
	/**
	 * Creates a platform application to push notifications to it.
	 * @param applicationName The name of the application.
	 * @param platformType The type of platform used for the push notifications.
	 * @param platformCredentials The credentials for the platform auth.
	 * @returns The platform application address.
	 */
	createPlatformApplication(
		applicationName: string,
		platformType: string,
		platformCredentials: string
	): Promise<string>;

	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationAddress The application address.
	 * @param deviceToken The device token.
	 * @returns The device registered address.
	 */
	registerDevice(applicationAddress: string, deviceToken: string): Promise<string>;

	/**
	 * Send a push notification to a device.
	 * @param deviceAddress The address of the device.
	 * @param title The title of the notification.
	 * @param message The message to send.
	 * @returns If the notification was sent successfully.
	 */
	sendSinglePushNotification(
		deviceAddress: string,
		title: string,
		message: string
	): Promise<boolean>;
}
