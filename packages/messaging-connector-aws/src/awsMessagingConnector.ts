// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	CreateEmailTemplateCommand,
	DeleteEmailTemplateCommand,
	SESv2Client,
	SendBulkEmailCommand,
	SendEmailCommand
} from "@aws-sdk/client-sesv2";
import { GeneralError, Guards } from "@twin.org/core";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IAwsSESConnectorConfig } from "./models/IAwsSESConnectorConfig";
// import type { EmailCustomType, IMessagingConnector, EmailTemplateType, EmailRecipientType } from "../../messaging-models/src/index"; -- This has to change after the models is reachable --

/**
 * Class for performing messaging operations using the AWS services.
 */
// export class AwsMessagingConnector implements IMessagingConnector { -- This has to change after the models is reachable --
export class AwsMessagingConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<AwsMessagingConnector>();

	/**
	 * The configuration for the connector.
	 * @internal
	 */
	private readonly _config: IAwsSESConnectorConfig;

	/**
	 * The Aws SES client.
	 * @internal
	 */
	private readonly _client: SESv2Client;

	/**
	 * Container user for the data storage.
	 * @internal
	 */
	private readonly _defaultOutgoingEmail: string;

	/**
	 * Create a new instance of IAwsSESConnectorConfig.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.config The configuration for the connector.
	 */
	constructor(options: { loggingConnectorType?: string; config: IAwsSESConnectorConfig }) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsSESConnectorConfig>(this.CLASS_NAME, nameof(options.config), options.config);
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

		this._config = options.config;
		this._client = new SESv2Client({
			endpoint: this._config.endpoint,
			region: this._config.region,
			credentials: {
				accessKeyId: this._config.accessKeyId,
				secretAccessKey: this._config.secretAccessKey
			}
		});

		this._defaultOutgoingEmail = "default@email.com";
	}

	/**
	 * Send a custom email using AWS SES.
	 * @param info The information for the custom email.
	 * @param info.receiver The receiver of the email.
	 * @param info.subject The subject of the email.
	 * @param info.content The content of the email.
	 * @returns True if the email was send successfully, otherwise undefined.
	 */
	// public async sendCustomEmail(info: EmailCustomType): Promise<boolean> { -- This has to change after the models is reachable --
	public async sendCustomEmail(info: {
		receiver: string;
		subject: string;
		content: string;
	}): Promise<boolean> {
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
			const result = await this._client.send(
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
	 * @param info.name The name of the email template.
	 * @param info.subject The subject of the email template.
	 * @param info.content The content of the email template.
	 * @returns True if the template was created successfully.
	 */
	// public async createTemplate(info: EmailTemplateType): Promise<boolean> { -- This has to change after the models is reachable --
	public async createTemplate(info: {
		name: string;
		subject: string;
		content: string;
	}): Promise<boolean> {
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
			const result = await this._client.send(
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
			const result = await this._client.send(
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
	// public async sendMassiveEmail(templateName: string, recipients: EmailRecipientType[]): Promise<boolean> { -- This has to change after the models is reachable --
	public async sendMassiveEmail(
		templateName: string,
		recipients: { email: string; content: { key: string; value: string }[] }[]
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

			const result = await this._client.send(
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
}
