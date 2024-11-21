// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { SESClient, SendEmailCommand, VerifyEmailAddressCommand } from "@aws-sdk/client-ses";
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
	 * The configuration for the client connector.
	 * @internal
	 */
	private readonly _config: IAwsConnectorConfig;

	/**
	 * The Aws SES client.
	 * @internal
	 */
	private readonly _client: SESClient;

	/**
	 * Create a new instance of AwsMessagingEmailConnector.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.config The configuration for the SES connector.
	 */
	constructor(options: { loggingConnectorType?: string; config: IAwsConnectorConfig }) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsConnectorConfig>(this.CLASS_NAME, nameof(options.config), options.config);
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
		this._client = new SESClient({
			endpoint: this._config.endpoint,
			region: this._config.region,
			credentials: {
				accessKeyId: this._config.accessKeyId,
				secretAccessKey: this._config.secretAccessKey
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
			const command = new VerifyEmailAddressCommand({ EmailAddress: sender });
			await this._client.send(command);
			const result = await this._client.send(
				new SendEmailCommand({
					Destination: { ToAddresses: receivers },
					Message: {
						Subject: {
							Data: subject
						},
						Body: {
							Html: {
								Data: content
							}
						}
					},
					Source: sender
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
			// eslint-disable-next-line no-console
			console.log(err);
			throw new GeneralError(this.CLASS_NAME, "sendCustomEmailFailed", undefined, err);
		}
	}
}
