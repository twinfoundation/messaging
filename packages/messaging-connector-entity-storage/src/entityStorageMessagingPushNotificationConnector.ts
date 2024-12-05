// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, GeneralError, Guards, Is, RandomHelper, StringHelper } from "@twin.org/core";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { type ILoggingConnector, LoggingConnectorFactory } from "@twin.org/logging-models";
import type { IMessagingPushNotificationsConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { PushNotificationDeviceEntry } from "./entities/pushNotificationDeviceEntry";
import type { PushNotificationMessageEntry } from "./entities/pushNotificationMessageEntry";

/**
 * Class for connecting to the push notifications messaging operations of the Entity Storage.
 */
export class EntityStorageMessagingPushNotificationConnector
	implements IMessagingPushNotificationsConnector
{
	/**
	 * The namespace for the connector.
	 */
	public static readonly NAMESPACE: string = "entity-storage";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<EntityStorageMessagingPushNotificationConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	protected readonly _logging?: ILoggingConnector;

	/**
	 * The entity storage for the push notifications device entries.
	 * @internal
	 */
	private readonly _messagingDeviceEntryStorage: IEntityStorageConnector<PushNotificationDeviceEntry>;

	/**
	 * The entity storage for the push notifications message entries.
	 * @internal
	 */
	private readonly _messagingMessageEntryStorage: IEntityStorageConnector<PushNotificationMessageEntry>;

	/**
	 * Create a new instance of EntityStorageMessagingPushNotificationConnector.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.messagingDeviceEntryStorageConnectorType The type of entity storage connector to use for the push notifications entries, defaults to "push-notification-device-entry".
	 * @param options.messagingMessageEntryStorageConnectorType The type of entity storage connector to use for the push notifications entries, defaults to "push-notification-message-entry".
	 */
	constructor(options?: {
		loggingConnectorType?: string;
		messagingDeviceEntryStorageConnectorType?: string;
		messagingMessageEntryStorageConnectorType?: string;
	}) {
		if (Is.stringValue(options?.loggingConnectorType)) {
			this._logging = LoggingConnectorFactory.get(options.loggingConnectorType);
		}
		this._messagingDeviceEntryStorage = EntityStorageConnectorFactory.get(
			options?.messagingDeviceEntryStorageConnectorType ??
				StringHelper.kebabCase(nameof<PushNotificationDeviceEntry>())
		);
		this._messagingMessageEntryStorage = EntityStorageConnectorFactory.get(
			options?.messagingMessageEntryStorageConnectorType ??
				StringHelper.kebabCase(nameof<PushNotificationMessageEntry>())
		);
	}

	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationId The application address.
	 * @param deviceToken The device token.
	 * @returns If the device was registered successfully.
	 */
	public async registerDevice(applicationId: string, deviceToken: string): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(applicationId), applicationId);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceToken), deviceToken);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "deviceRegistering"
			});

			const id = Converter.bytesToHex(RandomHelper.generate(32));

			const entity: PushNotificationDeviceEntry = {
				id,
				applicationId,
				deviceToken,
				ts: Date.now(),
				status: "pending"
			};

			await this._messagingDeviceEntryStorage.set(entity);
			return id;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"deviceTokenRegisterFailed",
				{ property: "applicationId", value: applicationId },
				err
			);
		}
	}

	/**
	 * Send a push notification to a device.
	 * @param deviceAddress The address of the device.
	 * @param title The title of the notification.
	 * @param message The message to send.
	 * @returns If the notification was sent successfully.
	 */
	public async sendSinglePushNotification(
		deviceAddress: string,
		title: string,
		message: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(deviceAddress), deviceAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(title), title);
		Guards.stringValue(this.CLASS_NAME, nameof(message), message);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "pushNotificationSending"
			});

			const id = Converter.bytesToHex(RandomHelper.generate(32));

			const entity: PushNotificationMessageEntry = {
				id,
				deviceAddress,
				title,
				message,
				ts: Date.now(),
				status: "pending"
			};

			await this._messagingMessageEntryStorage.set(entity);
			return true;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"sendPushNotificationFailed",
				{ value: deviceAddress },
				err
			);
		}
	}
}
