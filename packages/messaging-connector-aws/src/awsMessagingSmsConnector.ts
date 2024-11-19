// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { GeneralError, Guards } from "@twin.org/core";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import type { IMessagingSmsConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IAwsConnectorConfig } from "./models/IAwsConnectorConfig";

/**
 * Class for connecting to the SMS messaging operations of the AWS services.
 */
export class AwsMessagingSmsConnector implements IMessagingSmsConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<AwsMessagingSmsConnector>();

	/**
	 * The configuration for the SNS connector.
	 * @internal
	 */
	private readonly _snsConfig: IAwsConnectorConfig;

	/**
	 * The Aws SNS client.
	 * @internal
	 */
	private readonly _snsClient: SNSClient;

	/**
	 * Create a new instance of IAwsConnectorConfig.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.snsConfig The configuration for the SNS connector.
	 */
	constructor(options: { loggingConnectorType?: string; snsConfig: IAwsConnectorConfig }) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsConnectorConfig>(
			this.CLASS_NAME,
			nameof(options.snsConfig),
			options.snsConfig
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.snsConfig.endpoint),
			options.snsConfig.endpoint
		);
		Guards.stringValue(this.CLASS_NAME, nameof(options.snsConfig.region), options.snsConfig.region);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.snsConfig.accessKeyId),
			options.snsConfig.accessKeyId
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.snsConfig.secretAccessKey),
			options.snsConfig.secretAccessKey
		);

		this._snsConfig = options.snsConfig;
		this._snsClient = new SNSClient({
			endpoint: this._snsConfig.endpoint,
			region: this._snsConfig.region,
			credentials: {
				accessKeyId: this._snsConfig.accessKeyId,
				secretAccessKey: this._snsConfig.secretAccessKey
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
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		const params = {
			Message: message,
			PhoneNumber: phoneNumber
		};
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "smsSending"
			});
			await this._snsClient.send(new PublishCommand(params));
			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "sendSMSFailed", undefined, err);
		}
	}
}
