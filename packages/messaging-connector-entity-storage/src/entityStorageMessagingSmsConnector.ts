// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, GeneralError, Guards, Is, RandomHelper } from "@twin.org/core";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { type ILoggingConnector, LoggingConnectorFactory } from "@twin.org/logging-models";
import type { IMessagingSmsConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { SmsEntry } from "./entities/smsEntry";
import type { IEntityStorageMessagingSmsConnectorConfig } from "./models/IEntityStorageMessagingSmsConnectorConfig";

/**
 * Class for connecting to the SMS messaging operations of the Entity Storage.
 */
export class EntityStorageMessagingSmsConnector implements IMessagingSmsConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<EntityStorageMessagingSmsConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	protected readonly _logging?: ILoggingConnector;

	/**
	 * The entity storage for the sms entries.
	 * @internal
	 */
	private readonly _messagingEntryStorage: IEntityStorageConnector<SmsEntry>;

	/**
	 * Create a new instance of EntityStorageMessagingSmsConnector.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.messagingEntryStorageConnectorType The type of entity storage connector to use for the sms entries.
	 * @param options.config The configuration for the sms connector.
	 */
	constructor(options?: {
		loggingConnectorType?: string;
		messagingEntryStorageConnectorType: string;
		config?: IEntityStorageMessagingSmsConnectorConfig;
	}) {
		if (Is.stringValue(options?.loggingConnectorType)) {
			this._logging = LoggingConnectorFactory.get(options.loggingConnectorType);
		}
		this._messagingEntryStorage = EntityStorageConnectorFactory.get(
			options?.messagingEntryStorageConnectorType ?? "sms-entry"
		);
	}

	/**
	 * Send a SMS message to a phone number.
	 * @param phoneNumber The recipient phone number.
	 * @param message The message to send.
	 * @returns If the SMS was sent successfully.
	 */
	public async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(phoneNumber), phoneNumber);
		Guards.stringValue(this.CLASS_NAME, nameof(message), message);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "smsSending"
			});

			const id = Converter.bytesToHex(RandomHelper.generate(32));

			const entity: SmsEntry = {
				id,
				phoneNumber,
				message,
				ts: Date.now(),
				status: "sent"
			};

			await this._messagingEntryStorage.set(entity);

			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "sendSMSFailed", undefined, err);
		}
	}
}
