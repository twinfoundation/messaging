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
import { TEST_AWS_SES_CONFIG, TEST_AWS_SNS_CONFIG } from "./setupTestEnv";
import type {
	EmailCustomType,
	EmailRecipientType,
	EmailTemplateType
} from "../../messaging-models/src";
import { AwsMessagingConnector } from "../src/awsMessagingConnector";
import type { IAwsConnectorConfig } from "../src/models/IAwsConnectorConfig";

let memoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
const sesConfiguration: IAwsConnectorConfig = TEST_AWS_SES_CONFIG;
const snsConfiguration: IAwsConnectorConfig = TEST_AWS_SNS_CONFIG;

describe("AwsMessagingConnector", () => {
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
				new AwsMessagingConnector(
					undefined as unknown as {
						entitySchema: string;
						sesConfig: IAwsConnectorConfig;
						snsConfig: IAwsConnectorConfig;
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
		const entityStorage = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const entityStorage = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(messagingConnector.deleteTemplate("NotExistingTemplate")).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				value: "NotExistingTemplate"
			}
		});
	});

	test("can delete a template", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
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

	test("can fail to send SMS without phoneNumber", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.sendSMS(undefined as unknown as string, "Test message")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "phoneNumber",
				value: "undefined"
			}
		});
	});

	test("can fail to send SMS without message", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.sendSMS("+1234567890", undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "message",
				value: "undefined"
			}
		});
	});

	test("can send SMS", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const result = await messagingConnector.sendSMS("+1234567890", "Test message");
		expect(result).toEqual(true);
	});

	test("can fail to create a platform application without appName", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.createPlatformApplication(
				undefined as unknown as string,
				"platformType",
				"platformCredentials"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "appName",
				value: "undefined"
			}
		});
	});

	test("can fail to create a platform application without platformType", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.createPlatformApplication(
				"appName",
				undefined as unknown as string,
				"platformCredentials"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "platformType",
				value: "undefined"
			}
		});
	});

	test("can fail to create a platform application without platformCredentials", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.createPlatformApplication(
				"appName",
				"platformType",
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "platformCredentials",
				value: "undefined"
			}
		});
	});
	test("can create a platform application", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const appName = "TestApp";
		const platformType = "GCM";
		const platformCredentials = "test_credentials";
		const result = await messagingConnector.createPlatformApplication(
			appName,
			platformType,
			platformCredentials
		);
		expect(result).toBeDefined();
	});

	test("can fail to register a device without applicationArn", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.registerDevice(undefined as unknown as string, "deviceToken")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "applicationAddress",
				value: "undefined"
			}
		});
	});

	test("can fail to register a device without deviceToken", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.registerDevice("applicationAddress", undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceToken",
				value: "undefined"
			}
		});
	});

	test("can register a device", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const appName = "TestApp";
		const platformType = "GCM";
		const platformCredentials = "test_credentials";
		const applicationArn = await messagingConnector.createPlatformApplication(
			appName,
			platformType,
			platformCredentials
		);
		const deviceToken = "testDeviceToken";
		const result = await messagingConnector.registerDevice(applicationArn, deviceToken);
		expect(result).toBeDefined();
		expect(result.length).toBeGreaterThan(0);
	});

	test("can fail to send push notification without deviceAddress", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.sendSinglePushNotification(
				undefined as unknown as string,
				"Test Title",
				"Test message"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceAddress",
				value: "undefined"
			}
		});
	});

	test("can fail to send push notification without title", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.sendSinglePushNotification(
				"deviceAddress",
				undefined as unknown as string,
				"Test message"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "title",
				value: "undefined"
			}
		});
	});

	test("can fail to send push notification without message", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.sendSinglePushNotification(
				"deviceAddress",
				"Test Title",
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "message",
				value: "undefined"
			}
		});
	});

	test("can send push notification", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const appName = "TestApp";
		const platformType = "GCM";
		const platformCredentials = "test_credentials";
		const applicationArn = await messagingConnector.createPlatformApplication(
			appName,
			platformType,
			platformCredentials
		);
		const deviceToken = "testDeviceToken";
		const deviceAddress = await messagingConnector.registerDevice(applicationArn, deviceToken);
		const result = await messagingConnector.sendSinglePushNotification(
			deviceAddress,
			"Test Title",
			"Test message"
		);
		expect(result).toBeDefined();
		expect(result).toBe(true);
	});

	test("can fail to create a topic without topicName", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.createTopic(undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "topicName",
				value: "undefined"
			}
		});
	});

	test("can create a topic", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const topicName = "TestTopic";
		const result = await messagingConnector.createTopic(topicName);
		expect(result).toBeDefined();
		expect(result.length).toBeGreaterThan(0);
	});

	test("can fail to subscribe to a topic without topicAddress", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.subscribeToTopic(undefined as unknown as string, "deviceAddress")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "topicAddress",
				value: "undefined"
			}
		});
	});

	test("can fail to subscribe to a topic without deviceAddress", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.subscribeToTopic("topicAddress", undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceAddress",
				value: "undefined"
			}
		});
	});

	test("can subscribe to a topic", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const topicName = "TestTopic";
		const topicAddress = await messagingConnector.createTopic(topicName);
		const appName = "TestApp";
		const platformType = "GCM";
		const platformCredentials = "test_credentials";
		const applicationArn = await messagingConnector.createPlatformApplication(
			appName,
			platformType,
			platformCredentials
		);
		const deviceToken = "testDeviceToken";
		const deviceAddress = await messagingConnector.registerDevice(applicationArn, deviceToken);
		const result = await messagingConnector.subscribeToTopic(topicAddress, deviceAddress);
		expect(result).toEqual(true);
	});

	test("can fail to publish to topic without topicAddress", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.publishToTopic(
				undefined as unknown as string,
				"Test Title",
				"Test message"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "topicAddress",
				value: "undefined"
			}
		});
	});

	test("can fail to publish to topic without title", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.publishToTopic(
				"topicAddress",
				undefined as unknown as string,
				"Test message"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "title",
				value: "undefined"
			}
		});
	});

	test("can fail to publish to topic without message", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.publishToTopic(
				"topicAddress",
				"Test Title",
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "message",
				value: "undefined"
			}
		});
	});

	test("can publish to topic", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const topicName = "TestTopic";
		const appName = "TestApp";
		const platformType = "GCM";
		const platformCredentials = "test_credentials";
		const applicationArn = await messagingConnector.createPlatformApplication(
			appName,
			platformType,
			platformCredentials
		);
		const deviceToken = "testDeviceToken";
		const deviceAddress = await messagingConnector.registerDevice(applicationArn, deviceToken);
		const topicAddress = await messagingConnector.createTopic(topicName);
		await messagingConnector.subscribeToTopic(topicAddress, deviceAddress);
		const result = await messagingConnector.publishToTopic(
			topicAddress,
			"Test Title",
			"Test message"
		);
		expect(result).toEqual(true);
	});

	test("can fail to publish to topic without creating the topic first", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const topicAddress = "arn:aws:sns:us-east-1:123456789012:NonExistentTopic";
		await expect(
			messagingConnector.publishToTopic(topicAddress, "Test Title", "Test message")
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				topic: topicAddress
			}
		});
	});

	test("can fail to publish to topic without registering the device first", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const topicName = "TestTopic";
		const topicAddress = await messagingConnector.createTopic(topicName);
		const deviceAddress = "arn:aws:sns:us-east-1:123456789012:endpoint/GCM/NonExistentDevice";
		await expect(
			messagingConnector.subscribeToTopic(topicAddress, deviceAddress)
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				device: deviceAddress,
				topic: topicAddress
			}
		});
	});

	test("can fail to register a device without creating a platform application before", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const deviceToken = "testDeviceToken";
		await expect(
			messagingConnector.registerDevice("invalid_platform_application_address", deviceToken)
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				value: "invalid_platform_application_address"
			}
		});
	});

	test("can fail to send push notification with invalid device address", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.sendSinglePushNotification(
				"invalid_device_address",
				"Test Title",
				"Test message"
			)
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				value: "invalid_device_address"
			}
		});
	});

	test("can fail to subscribe to a topic with invalid topic address", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		const deviceAddress = "arn:aws:sns:us-east-1:123456789012:endpoint/GCM/ValidDevice";
		await expect(
			messagingConnector.subscribeToTopic("invalid_topic_address", deviceAddress)
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				device: deviceAddress,
				topic: "invalid_topic_address"
			}
		});
	});

	test("can fail to publish to topic with invalid topic address", async () => {
		const messagingConnector = new AwsMessagingConnector({
			sesConfig: sesConfiguration,
			snsConfig: snsConfiguration
		});
		await expect(
			messagingConnector.publishToTopic("invalid_topic_address", "Test Title", "Test message")
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				topic: "invalid_topic_address"
			}
		});
	});
});
