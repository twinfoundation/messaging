// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards } from "@twin.org/core";
import {
	MessagingSmsConnectorFactory,
	type IMessagingSmsComponent,
	type IMessagingSmsConnector
} from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IMessagingConfig } from "./models/IMessagingConfig";

/**
 * Service for performing sms messaging operations to a connector.
 */
export class MessagingSmsService implements IMessagingSmsComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<MessagingSmsService>();

	/**
	 * Messaging connector used by the service.
	 * @internal
	 */
	private readonly _messagingConnector: IMessagingSmsConnector;

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
	 * Create a new instance of MessagingSmsService.
	 * @param options The options for the connector.
	 * @param options.messagingConnectorType The type of the messaging connector to use, defaults to "messaging".
	 * @param options.config The configuration for the messaging service.
	 */
	constructor(options?: { messagingConnectorType?: string; config?: IMessagingConfig }) {
		this._messagingConnector = MessagingSmsConnectorFactory.get(
			options?.messagingConnectorType ?? "messaging-sms"
		);
		this._includeNodeIdentity = options?.config?.includeNodeIdentity ?? true;
		this._includeUserIdentity = options?.config?.includeUserIdentity ?? true;
	}

	/**
	 * Send a SMS message to a phone number.
	 * @param phoneNumber The recipient phone number.
	 * @param message The message to send.
	 * @param userIdentity The user identity to use with email messaging operations.
	 * @param nodeIdentity The node identity to use with email messaging operations.
	 * @returns If the SMS was sent successfully.
	 */
	public async sendSMS(
		phoneNumber: string,
		message: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(phoneNumber), phoneNumber);
		Guards.stringValue(this.CLASS_NAME, nameof(message), message);

		return this._messagingConnector.sendSMS(phoneNumber, message);
	}
}
