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
import type {
	EmailCustomType,
	EmailTemplateType,
	EmailRecipientType,
	IMessagingEmailConnector
} from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
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
	 * Create a new instance of IAwsConnectorConfig.
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
	 * @param info The information for the custom email.
	 * @returns True if the email was send successfully, otherwise undefined.
	 */
	public async sendCustomEmail(sender: string, info: EmailCustomType): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(sender), sender);
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
					FromEmailAddress: sender
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
	 * @param template The information for the email template.
	 * @returns True if the template was created successfully.
	 */
	public async createTemplate(template: EmailTemplateType): Promise<boolean> {
		Guards.objectValue(this.CLASS_NAME, nameof(template), template);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "templateCreating",
				data: {
					name: template.name
				}
			});
			const result = await this._sesClient.send(
				new CreateEmailTemplateCommand({
					TemplateName: template.name,
					TemplateContent: {
						Subject: template.subject,
						Html: template.content
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
					{ value: template.name },
					result
				);
			}
			return true;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"createTemplateFailed",
				{ value: template.name },
				err
			);
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
	 * @param sender The sender email address.
	 * @param templateName The name of the template to use.
	 * @param recipients The recipients of the email.
	 * @returns True if the email was sent successfully.
	 */
	public async sendMassiveEmail(
		sender: string,
		templateName: string,
		recipients: EmailRecipientType[]
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(sender), sender);
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
					FromEmailAddress: sender,
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
