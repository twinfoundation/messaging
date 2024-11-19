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
import type { EmailCustomType } from "../../messaging-models/src";
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
});
