// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing a push notifications messaging component.
 */
export interface IMessagingPushNotificationsComponent extends IComponent {
	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationAddress The application address.
	 * @param deviceToken The device token.
	 * @param userIdentity The user identity to use with push notifications messaging operations.
	 * @param nodeIdentity The node identity to use with push notifications messaging operations.
	 * @returns The device registered address.
	 */
	registerDevice(
		applicationAddress: string,
		deviceToken: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<string>;

	/**
	 * Send a push notification to a device.
	 * @param deviceAddress The address of the device.
	 * @param title The title of the notification.
	 * @param message The message to send.
	 * @param userIdentity The user identity to use with push notifications messaging operations.
	 * @param nodeIdentity The node identity to use with push notifications messaging operations.
	 * @returns If the notification was sent successfully.
	 */
	sendSinglePushNotification(
		deviceAddress: string,
		title: string,
		message: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<boolean>;
}
