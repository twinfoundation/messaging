// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { EmailEntry } from "../src/entities/emailEntry";
import { EntityStorageMessagingEmailConnector } from "../src/entityStorageMessagingEmailConnector";
import { initSchema } from "../src/schema";

describe("EntityStorageMessagingEmailConnector", () => {
	beforeAll(() => {
		initSchema();
		EntityStorageConnectorFactory.register(
			"messaging-entry",
			() =>
				new MemoryEntityStorageConnector<EmailEntry>({
					entitySchema: nameof<EmailEntry>()
				})
		);
	});

	test("can construct", async () => {
		const storage = new EntityStorageMessagingEmailConnector();
		expect(storage).toBeDefined();
	});

	test("throws error when sending email with invalid sender", async () => {
		const storage = new EntityStorageMessagingEmailConnector({
			messagingEntryStorageConnectorType: "messaging-entry"
		});
		await expect(
			storage.sendCustomEmail("", ["recipient@example.com"], "Test Subject", "<p>Test Content</p>")
		).rejects.toThrow();
	});

	test("throws error when sending email with invalid recipients", async () => {
		const storage = new EntityStorageMessagingEmailConnector({
			messagingEntryStorageConnectorType: "messaging-entry"
		});
		await expect(
			storage.sendCustomEmail("sender@example.com", [], "Test Subject", "<p>Test Content</p>")
		).rejects.toThrow();
	});

	test("throws error when sending email with invalid subject", async () => {
		const storage = new EntityStorageMessagingEmailConnector({
			messagingEntryStorageConnectorType: "messaging-entry"
		});
		await expect(
			storage.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				"",
				"<p>Test Content</p>"
			)
		).rejects.toThrow();
	});

	test("throws error when sending email with invalid content", async () => {
		const storage = new EntityStorageMessagingEmailConnector({
			messagingEntryStorageConnectorType: "messaging-entry"
		});
		await expect(
			storage.sendCustomEmail("sender@example.com", ["recipient@example.com"], "Test Subject", "")
		).rejects.toThrow();
	});

	test("can send custom email", async () => {
		const storage = new EntityStorageMessagingEmailConnector({
			messagingEntryStorageConnectorType: "messaging-entry"
		});
		const result = await storage.sendCustomEmail(
			"sender@example.com",
			["recipient@example.com"],
			"Test Subject",
			"<p>Test Content</p>"
		);
		expect(result).toBe(true);
		const emailEntry = await storage.readEmailEntry("1");
		expect(emailEntry).toBeDefined();
		expect(emailEntry?.sender).toBe("sender@example.com");
		expect(emailEntry?.recipients).toEqual(["recipient@example.com"]);
		expect(emailEntry?.subject).toBe("Test Subject");
		expect(emailEntry?.message).toBe("<p>Test Content</p>");
	});
});
