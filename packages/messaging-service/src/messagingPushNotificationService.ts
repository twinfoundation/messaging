// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards } from "@twin.org/core";
import {
	MessagingPushNotificationsConnectorFactory,
	type IMessagingPushNotificationsComponent,
	type IMessagingPushNotificationsConnector
} from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IMessagingConfig } from "./models/IMessagingConfig";

/**
 * Service for performing push notification messaging operations to a connector.
 */
export class MessagingPushNotificationService implements IMessagingPushNotificationsComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<MessagingPushNotificationService>();

	/**
	 * Messaging connector used by the service.
	 * @internal
	 */
	private readonly _messagingConnector: IMessagingPushNotificationsConnector;

	/**
	 * Include the node identity when performing storage operations, defaults to true.
	 * @internal
	 */
	private readonly _includeNodeIdentity: boolean;

	/**
	 * Include the user identity when performing storage operations, defaults to true.
	 * @internal
	 */
	private readonly _includeUserIdentity: boolean;

	/**
	 * Create a new instance of MessagingPushNotificationService.
	 * @param options The options for the connector.
	 * @param options.messagingConnectorType The type of the messaging connector to use, defaults to "messaging".
	 * @param options.config The configuration for the messaging service.
	 */
	constructor(options?: { messagingConnectorType?: string; config?: IMessagingConfig }) {
		this._messagingConnector = MessagingPushNotificationsConnectorFactory.get(
			options?.messagingConnectorType ?? "messaging-push-notification"
		);
		this._includeNodeIdentity = options?.config?.includeNodeIdentity ?? true;
		this._includeUserIdentity = options?.config?.includeUserIdentity ?? true;
	}

	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationId The application address.
	 * @param deviceToken The device token.
	 * @param userIdentity The user identity to use with push notifications messaging operations.
	 * @param nodeIdentity The node identity to use with push notifications messaging operations.
	 * @returns If the device was registered successfully.
	 */
	public async registerDevice(
    applicationId: string,
    deviceToken: string,
		userIdentity?: string,
		nodeIdentity?: string): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(applicationId), applicationId);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceToken), deviceToken);

		return this._messagingConnector.registerDevice(applicationId, deviceToken);
	}

	/**
	 * Send a push notification to a device.
	 * @param deviceAddress The address of the device.
	 * @param title The title of the notification.
	 * @param message The message to send.
	 * @param userIdentity The user identity to use with push notifications messaging operations.
	 * @param nodeIdentity The node identity to use with push notifications messaging operations.
	 * @returns If the notification was sent successfully.
	 */
	public async sendSinglePushNotification(
		deviceAddress: string,
		title: string,
		message: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(deviceAddress), deviceAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(title), title);
		Guards.stringValue(this.CLASS_NAME, nameof(message), message);

		return this._messagingConnector.sendSinglePushNotification(deviceAddress, title, message);
	}
}
