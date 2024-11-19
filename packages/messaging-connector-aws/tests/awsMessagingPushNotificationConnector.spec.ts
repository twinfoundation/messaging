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
import { TEST_AWS_SNS_CONFIG } from "./setupTestEnv";
import { AwsMessagingPushNotificationConnector } from "../src/awsMessagingPushNotificationConnector";
import type { IAwsConnectorConfig } from "../src/models/IAwsConnectorConfig";

let memoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
const snsConfiguration: IAwsConnectorConfig = TEST_AWS_SNS_CONFIG;

describe("AwsMessagingPushNotificationConnector", () => {
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
				new AwsMessagingPushNotificationConnector(
					undefined as unknown as {
						entitySchema: string;
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

	test("can fail to create a platform application without appName", async () => {
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
			snsConfig: snsConfiguration
		});
		const topicName = "TestTopic";
		const result = await messagingConnector.createTopic(topicName);
		expect(result).toBeDefined();
		expect(result.length).toBeGreaterThan(0);
	});

	test("can fail to subscribe to a topic without topicAddress", async () => {
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
		const messagingConnector = new AwsMessagingPushNotificationConnector({
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
