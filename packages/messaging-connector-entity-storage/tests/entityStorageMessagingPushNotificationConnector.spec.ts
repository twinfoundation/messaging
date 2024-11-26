// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { PushNotificationDeviceEntry } from "../src/entities/pushNotificationDeviceEntry";
import type { PushNotificationMessageEntry } from "../src/entities/pushNotificationMessageEntry";
import { EntityStorageMessagingPushNotificationConnector } from "../src/entityStorageMessagingPushNotificationConnector";
import { initSchema } from "../src/schema";

describe("EntityStorageMessagingPushNotificationConnector", () => {
	beforeAll(() => {
		initSchema();
		EntityStorageConnectorFactory.register(
			"push-notifications-device-messaging-entry",
			() =>
				new MemoryEntityStorageConnector<PushNotificationDeviceEntry>({
					entitySchema: nameof<PushNotificationDeviceEntry>()
				})
		);
		EntityStorageConnectorFactory.register(
			"push-notifications-message-messaging-entry",
			() =>
				new MemoryEntityStorageConnector<PushNotificationMessageEntry>({
					entitySchema: nameof<PushNotificationMessageEntry>()
				})
		);
	});

	test("can construct", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector();
		expect(storage).toBeDefined();
	});

	test("register device with invalid applicationId throws error", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-device-messaging-entry"
		});
		const deviceToken = "token123";
		await expect(
			storage.registerDevice(undefined as unknown as string, deviceToken)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "applicationId",
				value: "undefined"
			}
		});
	});

	test("register device with invalid deviceToken throws error", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-device-messaging-entry"
		});
		const applicationId = "app123";
		await expect(
			storage.registerDevice(applicationId, undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceToken",
				value: "undefined"
			}
		});
	});

	test("can register device", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-device-messaging-entry"
		});
		const applicationId = "app123";
		const deviceToken = "token123";
		const id = await storage.registerDevice(applicationId, deviceToken);
		expect(id).toBeDefined();
		expect(id.length).toBeGreaterThan(0);
		const entries = await EntityStorageConnectorFactory.get(
			"push-notifications-device-messaging-entry"
		).query();
		expect(entries.entities).toBeDefined();
		expect(entries.entities.length).toBe(1);
		expect((entries.entities[0] as PushNotificationDeviceEntry).applicationId).toBe(applicationId);
		expect((entries.entities[0] as PushNotificationDeviceEntry).deviceToken).toBe(deviceToken);
	});

	test("send single push notification with invalid deviceAddress throws error", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-message-messaging-entry"
		});
		const title = "Test Title";
		const message = "Test Message";
		await expect(
			storage.sendSinglePushNotification(undefined as unknown as string, title, message)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceAddress",
				value: "undefined"
			}
		});
	});

	test("send single push notification with invalid title throws error", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-message-messaging-entry"
		});
		const deviceAddress = "device123";
		const message = "Test Message";
		await expect(
			storage.sendSinglePushNotification(deviceAddress, undefined as unknown as string, message)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "title",
				value: "undefined"
			}
		});
	});

	test("send single push notification with invalid message throws error", async () => {
		const storage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-message-messaging-entry"
		});
		const deviceAddress = "device123";
		const title = "Test Title";
		await expect(
			storage.sendSinglePushNotification(deviceAddress, title, undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "message",
				value: "undefined"
			}
		});
	});

	test("can send single push notification", async () => {
		const storageDevice = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-device-messaging-entry"
		});
		const storageMessage = new EntityStorageMessagingPushNotificationConnector({
			messagingEntryStorageConnectorType: "push-notifications-message-messaging-entry"
		});
		const applicationId = "app123";
		const deviceToken = "token123";
		const title = "Test Title";
		const message = "Test Message";
		const deviceAddress = await storageDevice.registerDevice(applicationId, deviceToken);
		const result = await storageMessage.sendSinglePushNotification(deviceAddress, title, message);
		expect(result).toBe(true);
		const entries = await EntityStorageConnectorFactory.get(
			"push-notifications-message-messaging-entry"
		).query();
		expect(entries.entities).toBeDefined();
		expect(entries.entities.length).toBe(1);
		expect((entries.entities[0] as PushNotificationMessageEntry).deviceAddress).toBe(deviceAddress);
		expect((entries.entities[0] as PushNotificationMessageEntry).title).toBe(title);
		expect((entries.entities[0] as PushNotificationMessageEntry).message).toBe(message);
	});
});
