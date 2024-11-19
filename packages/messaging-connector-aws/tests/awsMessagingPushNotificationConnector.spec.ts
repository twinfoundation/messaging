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
});
