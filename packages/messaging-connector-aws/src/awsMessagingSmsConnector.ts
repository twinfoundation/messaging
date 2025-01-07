// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { GeneralError, Guards, Is } from "@twin.org/core";
import { type ILoggingConnector, LoggingConnectorFactory } from "@twin.org/logging-models";
import type { IMessagingSmsConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IAwsMessagingSmsConnectorConstructorOptions } from "./models/IAwsMessagingSmsConnectorConstructorOptions";
import type { IAwsSmsConnectorConfig } from "./models/IAwsSmsConnectorConfig";

/**
 * Class for connecting to the SMS messaging operations of the AWS services.
 */
export class AwsMessagingSmsConnector implements IMessagingSmsConnector {
	/**
	 * The namespace for the connector.
	 */
	public static readonly NAMESPACE: string = "aws";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<AwsMessagingSmsConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	protected readonly _logging?: ILoggingConnector;

	/**
	 * The configuration for the AWS connector.
	 * @internal
	 */
	private readonly _config: IAwsSmsConnectorConfig;

	/**
	 * The Aws SNS client.
	 * @internal
	 */
	private readonly _client: SNSClient;

	/**
	 * Create a new instance of AwsMessagingSmsConnector.
	 * @param options The options for the connector.
	 */
	constructor(options: IAwsMessagingSmsConnectorConstructorOptions) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsSmsConnectorConfig>(this.CLASS_NAME, nameof(options.config), options.config);
		Guards.stringValue(this.CLASS_NAME, nameof(options.config.endpoint), options.config.endpoint);
		Guards.stringValue(this.CLASS_NAME, nameof(options.config.region), options.config.region);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.config.accessKeyId),
			options.config.accessKeyId
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.config.secretAccessKey),
			options.config.secretAccessKey
		);

		if (Is.stringValue(options.loggingConnectorType)) {
			this._logging = LoggingConnectorFactory.get(options.loggingConnectorType);
		}

		this._config = options.config;
		this._client = new SNSClient({
			endpoint: this._config.endpoint,
			region: this._config.region,
			credentials: {
				accessKeyId: this._config.accessKeyId,
				secretAccessKey: this._config.secretAccessKey
			}
		});
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
		const params = {
			Message: message,
			PhoneNumber: phoneNumber
		};
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "smsSending"
			});
			await this._client.send(new PublishCommand(params));
			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "sendSMSFailed", undefined, err);
		}
	}
}
