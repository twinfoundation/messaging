// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/* eslint-disable max-classes-per-file */
import { I18n } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	type LogEntry,
	initSchema
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { TEST_AWS_SES_CONFIG } from "./setupTestEnv";
import type {
	EmailCustomType,
	EmailRecipientType,
	EmailTemplateType
} from "../../messaging-models/src";
import { AwsMessagingEmailConnector } from "../src/awsMessagingEmailConnector";
import type { IAwsConnectorConfig } from "../src/models/IAwsConnectorConfig";

let memoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
const sesConfiguration: IAwsConnectorConfig = TEST_AWS_SES_CONFIG;

describe("AwsMessagingEmailConnector", () => {
	beforeAll(async () => {
		I18n.addDictionary("en", await import("../locales/en.json"));

		initSchema();
	});

	beforeEach(async () => {
		memoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => memoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		LoggingConnectorFactory.register("node-logging", () => new EntityStorageLoggingConnector());
	});

	test("can fail to construct when there are no options", async () => {
		expect(
			() =>
				new AwsMessagingEmailConnector(
					undefined as unknown as {
						entitySchema: string;
						sesConfig: IAwsConnectorConfig;
					}
				)
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "options",
					value: "undefined"
				}
			})
		);
	});

	test("can fail to send a custom email without sender", async () => {
		const entityStorage = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			entityStorage.sendCustomEmail(undefined as unknown as string, {} as EmailCustomType)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "sender",
				value: "undefined"
			}
		});
	});

	test("can fail to send a custom email without info", async () => {
		const entityStorage = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			entityStorage.sendCustomEmail("sender@example.com", undefined as unknown as EmailCustomType)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "info",
				value: "undefined"
			}
		});
	});

	test("can send a custom email", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		const objectSet: EmailCustomType = {
			receiver: "receiver@example.com",
			subject: "Custom Email",
			content: "<body><h1>Hi, Joe!</h1><p>This is a custom email.</p></body>"
		};

		const result = await messagingConnector.sendCustomEmail("sender@example.com", objectSet);
		expect(result).toEqual(true);
	});

	test("can fail to create a template without template", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			messagingConnector.createTemplate(undefined as unknown as EmailTemplateType)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "template",
				value: "undefined"
			}
		});
	});

	test("can create a template", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		const templateName = "TestTemplate";
		const templateInfo: EmailTemplateType = {
			name: templateName,
			subject: "Template Subject",
			language: "en",
			content: "<body><h1>Template Content</h1></body>"
		};

		const result = await messagingConnector.createTemplate(templateInfo);
		expect(result).toEqual(true);
		await messagingConnector.deleteTemplate(templateName);
	});

	test("can fail to create a template with the same name as a previous one", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});

		const templateName = "TestTemplate";
		const templateInfo: EmailTemplateType = {
			name: templateName,
			subject: "Template Subject",
			language: "en",
			content: "<body><h1>Template Content</h1></body>"
		};

		await messagingConnector.createTemplate(templateInfo);
		await expect(messagingConnector.createTemplate(templateInfo)).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				value: templateName
			}
		});
		await messagingConnector.deleteTemplate(templateName);
	});

	test("can fail to delete a template without name", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			messagingConnector.deleteTemplate(undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "name",
				value: "undefined"
			}
		});
	});

	test("can fail to delete a not found template", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(messagingConnector.deleteTemplate("NotExistingTemplate")).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				value: "NotExistingTemplate"
			}
		});
	});

	test("can delete a template", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		const templateName = "TestTemplate";
		const templateInfo: EmailTemplateType = {
			name: templateName,
			subject: "Template Subject",
			language: "en",
			content: "<body><h1>Template Content</h1></body>"
		};

		await messagingConnector.createTemplate(templateInfo);

		const result = await messagingConnector.deleteTemplate(templateName);
		expect(result).toEqual(true);
	});

	test("can fail to send a massive email without sender", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			messagingConnector.sendMassiveEmail(undefined as unknown as string, "templateName", [])
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "sender",
				value: "undefined"
			}
		});
	});

	test("can fail to send a massive email without templateName", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			messagingConnector.sendMassiveEmail("sender@example.com", undefined as unknown as string, [])
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "templateName",
				value: "undefined"
			}
		});
	});

	test("can fail to send a massive email without recipients", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		await expect(
			messagingConnector.sendMassiveEmail(
				"sender@example.com",
				"TestTemplate",
				undefined as unknown as EmailRecipientType[]
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "recipients",
				value: "undefined"
			}
		});
	});

	test("can fail to send a massive email without a valid template", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});
		const templateName = "TestTemplate";
		const recipients: EmailRecipientType[] = [
			{
				email: "recipient1@example.com",
				content: [{ key: "name", value: "Recipient1" }]
			},
			{
				email: "recipient2@example.com",
				content: [{ key: "name", value: "Recipient2" }]
			}
		];

		await expect(
			messagingConnector.sendMassiveEmail("sender@example.com", templateName, recipients)
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				value: templateName
			}
		});
	});

	test("can send a massive email", async () => {
		const messagingConnector = new AwsMessagingEmailConnector({
			sesConfig: sesConfiguration
		});

		const templateName = "TestTemplate";
		const templateInfo: EmailTemplateType = {
			name: templateName,
			subject: "Template Subject",
			language: "en",
			content:
				"<html><head></head><body><h1>Hello, {{name}}!</h1><p>This is a sample email template.</p></body></html>"
		};

		await messagingConnector.createTemplate(templateInfo);

		const recipients: EmailRecipientType[] = [
			{
				email: "recipient1@example.com",
				content: [{ key: "name", value: "Recipient1" }]
			},
			{
				email: "recipient2@example.com",
				content: [{ key: "name", value: "Recipient2" }]
			}
		];

		const result = await messagingConnector.sendMassiveEmail(
			"sender@example.com",
			templateName,
			recipients
		);
		expect(result).toEqual(true);
		await messagingConnector.deleteTemplate(templateName);
	});
});
