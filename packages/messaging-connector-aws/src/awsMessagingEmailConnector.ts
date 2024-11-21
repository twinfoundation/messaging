// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { GeneralError, Guards, Is } from "@twin.org/core";
import { type ILoggingConnector, LoggingConnectorFactory } from "@twin.org/logging-models";
import type { IMessagingEmailConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import { HttpStatusCode } from "@twin.org/web";
import type { IAwsConnectorConfig } from "./models/IAwsConnectorConfig";

/**
 * Class for connecting to the email messaging operations of the AWS services.
 */
export class AwsMessagingEmailConnector implements IMessagingEmailConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<AwsMessagingEmailConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	protected readonly _logging?: ILoggingConnector;

	/**
	 * The configuration for the SES connector.
	 * @internal
	 */
	private readonly _sesConfig: IAwsConnectorConfig;

	/**
	 * The Aws SES client.
	 * @internal
	 */
	private readonly _sesClient: SESv2Client;

	/**
	 * Create a new instance of AwsMessagingEmailConnector.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.sesConfig The configuration for the SES connector.
	 */
	constructor(options: { loggingConnectorType?: string; sesConfig: IAwsConnectorConfig }) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsConnectorConfig>(
			this.CLASS_NAME,
			nameof(options.sesConfig),
			options.sesConfig
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.sesConfig.endpoint),
			options.sesConfig.endpoint
		);
		Guards.stringValue(this.CLASS_NAME, nameof(options.sesConfig.region), options.sesConfig.region);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.sesConfig.accessKeyId),
			options.sesConfig.accessKeyId
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.sesConfig.secretAccessKey),
			options.sesConfig.secretAccessKey
		);

		if (Is.stringValue(options.loggingConnectorType)) {
			this._logging = LoggingConnectorFactory.get(options.loggingConnectorType);
		}

		this._sesConfig = options.sesConfig;
		this._sesClient = new SESv2Client({
			endpoint: this._sesConfig.endpoint,
			region: this._sesConfig.region,
			credentials: {
				accessKeyId: this._sesConfig.accessKeyId,
				secretAccessKey: this._sesConfig.secretAccessKey
			}
		});
	}

	/**
	 * Send a custom email using AWS SES.
	 * @param sender The sender email address.
	 * @param receivers An array of receivers email addresses.
	 * @param subject The subject of the email.
	 * @param content The html content of the email.
	 * @returns True if the email was send successfully, otherwise undefined.
	 */
	public async sendCustomEmail(
		sender: string,
		receivers: string[],
		subject: string,
		content: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(sender), sender);
		Guards.arrayValue(this.CLASS_NAME, nameof(receivers), receivers);
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
			const result = await this._sesClient.send(
				new SendEmailCommand({
					Destination: { ToAddresses: receivers },
					Content: {
						Simple: {
							Subject: { Data: subject },
							Body: {
								Html: { Data: content }
							}
						}
					},
					FromEmailAddress: sender
				})
			);
			if (result.$metadata.httpStatusCode !== HttpStatusCode.ok) {
				await this._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "sendCustomEmailFailed"
				});
				throw new GeneralError(this.CLASS_NAME, "sendCustomEmailFailed", undefined, result);
			}
			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "sendCustomEmailFailed", undefined, err);
		}
	}
}
