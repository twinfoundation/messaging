// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	CreateEmailTemplateCommand,
	DeleteEmailTemplateCommand,
	SESv2Client,
	SendBulkEmailCommand,
	SendEmailCommand
} from "@aws-sdk/client-sesv2";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { GeneralError, Guards } from "@twin.org/core";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import type {
	EmailCustomType,
	IMessagingConnector,
	EmailTemplateType,
	EmailRecipientType
} from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IAwsConnectorConfig } from "./models/IAwsConnectorConfig";

/**
 * Class for performing messaging operations using the AWS services.
 */
export class AwsMessagingConnector implements IMessagingConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<AwsMessagingConnector>();

	/**
	 * The configuration for the SES connector.
	 * @internal
	 */
	private readonly _sesConfig: IAwsConnectorConfig;

	/**
	 * The configuration for the SNS connector.
	 * @internal
	 */
	private readonly _snsConfig: IAwsConnectorConfig;

	/**
	 * The Aws SES client.
	 * @internal
	 */
	private readonly _sesClient: SESv2Client;

	/**
	 * The Aws SNS client.
	 * @internal
	 */
	private readonly _snsClient: SNSClient;

	/**
	 * Container user for the data storage.
	 * @internal
	 */
	private readonly _defaultOutgoingEmail: string;

	/**
	 * Create a new instance of IAwsConnectorConfig.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.sesConfig The configuration for the SES connector.
	 * @param options.snsConfig The configuration for the SNS connector.
	 */
	constructor(options: {
		loggingConnectorType?: string;
		sesConfig: IAwsConnectorConfig;
		snsConfig: IAwsConnectorConfig;
	}) {
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

		this._sesConfig = options.sesConfig;
		this._sesClient = new SESv2Client({
			endpoint: this._sesConfig.endpoint,
			region: this._sesConfig.region,
			credentials: {
				accessKeyId: this._sesConfig.accessKeyId,
				secretAccessKey: this._sesConfig.secretAccessKey
			}
		});

		this._defaultOutgoingEmail = "default@email.com";

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
	 * Send a custom email using AWS SES.
	 * @param info The information for the custom email.
	 * @returns True if the email was send successfully, otherwise undefined.
	 */
	public async sendCustomEmail(info: EmailCustomType): Promise<boolean> {
		Guards.objectValue(this.CLASS_NAME, nameof(info), info);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
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
					Destination: { ToAddresses: [info.receiver] },
					Content: {
						Simple: {
							Subject: { Data: info.subject },
							Body: {
								Html: { Data: info.content }
							}
						}
					},
					FromEmailAddress: this._defaultOutgoingEmail
				})
			);
			if (result.$metadata.httpStatusCode !== 200) {
				await nodeLogging?.log({
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

	/**
	 * Create an email template.
	 * @param info The information for the email template.
	 * @returns True if the template was created successfully.
	 */
	public async createTemplate(info: EmailTemplateType): Promise<boolean> {
		Guards.objectValue(this.CLASS_NAME, nameof(info), info);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "templateCreating",
				data: {
					name: info.name
				}
			});
			const result = await this._sesClient.send(
				new CreateEmailTemplateCommand({
					TemplateName: info.name,
					TemplateContent: {
						Subject: info.subject,
						Html: info.content
					}
				})
			);
			if (result.$metadata.httpStatusCode !== 200) {
				await nodeLogging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "createTemplateFailed"
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"createTemplateFailed",
					{ value: info.name },
					result
				);
			}
			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "createTemplateFailed", { value: info.name }, err);
		}
	}

	/**
	 * Delete an email template.
	 * @param name The email template name to delete.
	 * @returns True if the template was deleted successfully.
	 */
	public async deleteTemplate(name: string): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(name), name);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "templateDeleting",
				data: {
					name
				}
			});
			const result = await this._sesClient.send(
				new DeleteEmailTemplateCommand({
					TemplateName: name
				})
			);

			if (result.$metadata.httpStatusCode !== 200) {
				await nodeLogging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "deleteTemplateFailed"
				});
				throw new GeneralError(this.CLASS_NAME, "deleteTemplateFailed", { value: name }, result);
			}
			return true;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "deleteTemplateFailed", { value: name }, err);
		}
	}

	/**
	 * Send a massive email using a template.
	 * @param templateName The name of the template to use.
	 * @param recipients The recipients of the email.
	 * @returns True if the email was sent successfully.
	 */
	public async sendMassiveEmail(
		templateName: string,
		recipients: EmailRecipientType[]
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(templateName), templateName);
		Guards.arrayValue(this.CLASS_NAME, nameof(recipients), recipients);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "sendMassiveEmail",
				data: {
					name: templateName
				}
			});
			const bulkEmailEntries = recipients.map(recipient => {
				const entry: {
					Destination: { ToAddresses: string[] };
					ReplacementEmailContent?: { ReplacementTemplate: { ReplacementTemplateData: string } };
				} = { Destination: { ToAddresses: [recipient.email] } };

				if (recipient.content.length > 0) {
					const content: { [key: string]: string } = {};
					for (const item of recipient.content) {
						content[item.key] = item.value;
					}
					entry.ReplacementEmailContent = {
						ReplacementTemplate: {
							ReplacementTemplateData: JSON.stringify(content)
						}
					};
				}
				return entry;
			});

			const result = await this._sesClient.send(
				new SendBulkEmailCommand({
					FromEmailAddress: this._defaultOutgoingEmail,
					BulkEmailEntries: bulkEmailEntries,
					DefaultContent: {
						Template: {
							TemplateName: templateName
						}
					}
				})
			);

			if (result.$metadata.httpStatusCode !== 200) {
				await nodeLogging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "sendMassiveEmailFailed"
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"sendMassiveEmailFailed",
					{ value: templateName },
					result
				);
			}
			return true;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"sendMassiveEmailFailed",
				{ value: templateName },
				err
			);
		}
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
