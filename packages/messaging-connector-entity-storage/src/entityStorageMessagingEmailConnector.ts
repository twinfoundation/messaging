// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, GeneralError, Guards, Is, RandomHelper } from "@twin.org/core";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { LoggingConnectorFactory, type ILoggingConnector } from "@twin.org/logging-models";
import type { IMessagingEmailConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { EmailEntry } from "./entities/emailEntry";
import type { IEntityStorageMessagingEmailConnectorConfig } from "./models/IEntityStorageMessagingEmailConnectorConfig";

/**
 * Class for connecting to the email messaging operations of the Entity Storage.
 */
export class EntityStorageMessagingEmailConnector implements IMessagingEmailConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<EntityStorageMessagingEmailConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	protected readonly _logging?: ILoggingConnector;

	/**
	 * The entity storage for the emails entries.
	 * @internal
	 */
	private readonly _messagingEntryStorage: IEntityStorageConnector<EmailEntry>;

	/**
	 * Create a new instance of EntityStorageMessagingEmailConnector.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.messagingEntryStorageConnectorType The type of entity storage connector to use for the email entries.
	 * @param options.config The configuration for the email connector.
	 */
	constructor(options?: {
		loggingConnectorType?: string;
		messagingEntryStorageConnectorType: string;
		config?: IEntityStorageMessagingEmailConnectorConfig;
	}) {
		if (Is.stringValue(options?.loggingConnectorType)) {
			this._logging = LoggingConnectorFactory.get(options.loggingConnectorType);
		}
		this._messagingEntryStorage = EntityStorageConnectorFactory.get(
			options?.messagingEntryStorageConnectorType ?? "email-messaging-entry"
		);
	}

	/**
	 * Store a custom email using Entity Storage.
	 * @param sender The sender email address.
	 * @param recipients An array of recipients email addresses.
	 * @param subject The subject of the email.
	 * @param content The html content of the email.
	 * @returns True if the email was send successfully, otherwise undefined.
	 */
	public async sendCustomEmail(
		sender: string,
		recipients: string[],
		subject: string,
		content: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(sender), sender);
		Guards.arrayValue(this.CLASS_NAME, nameof(recipients), recipients);
		Guards.stringValue(this.CLASS_NAME, nameof(subject), subject);
		Guards.stringValue(this.CLASS_NAME, nameof(content), content);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "emailSending",
				data: {
					type: "Custom Email"
				}
			});

			const id = Converter.bytesToHex(RandomHelper.generate(32));

			const entity: EmailEntry = {
				id,
				sender,
				recipients,
				ts: Date.now(),
				message: content,
				subject,
				status: "pending"
			};

			await this._messagingEntryStorage.set(entity);

			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "sendCustomEmailFailed", undefined, err);
		}
	}
}
