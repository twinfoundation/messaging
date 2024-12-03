// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards } from "@twin.org/core";
import {
	MessagingEmailConnectorFactory,
	type IMessagingEmailComponent,
	type IMessagingEmailConnector
} from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IMessagingConfig } from "./models/IMessagingConfig";

/**
 * Service for performing email messaging operations to a connector.
 */
export class MessagingEmailService implements IMessagingEmailComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<MessagingEmailService>();

	/**
	 * Messaging connector used by the service.
	 * @internal
	 */
	private readonly _messagingConnector: IMessagingEmailConnector;

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
	 * Create a new instance of MessagingEmailService.
	 * @param options The options for the connector.
	 * @param options.messagingConnectorType The type of the messaging connector to use, defaults to "messaging".
	 * @param options.config The configuration for the messaging service.
	 */
	constructor(options?: { messagingConnectorType?: string; config?: IMessagingConfig }) {
		this._messagingConnector = MessagingEmailConnectorFactory.get(
			options?.messagingConnectorType ?? "messaging-email"
		);
		this._includeNodeIdentity = options?.config?.includeNodeIdentity ?? true;
		this._includeUserIdentity = options?.config?.includeUserIdentity ?? true;
	}

	/**
	 * Send a custom email.
	 * @param sender The sender email address.
	 * @param recipients An array of recipients email addresses.
	 * @param subject The subject of the email.
	 * @param content The html content of the email.
	 * @param userIdentity The user identity to use with email messaging operations.
	 * @param nodeIdentity The node identity to use with email messaging operations.
	 * @returns If the email was sent successfully.
	 */
	public async sendCustomEmail(
		sender: string,
		recipients: string[],
		subject: string,
		content: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(sender), sender);
		Guards.arrayValue(this.CLASS_NAME, nameof(recipients), recipients);
		Guards.stringValue(this.CLASS_NAME, nameof(subject), subject);
		Guards.stringValue(this.CLASS_NAME, nameof(content), content);

		return this._messagingConnector.sendCustomEmail(sender, recipients, subject, content);
	}
}
