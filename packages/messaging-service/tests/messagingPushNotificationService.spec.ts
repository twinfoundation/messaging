// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	MessagingPushNotificationsConnectorFactory,
	type IMessagingPushNotificationsConnector
} from "@twin.org/messaging-models";
import { MessagingPushNotificationService } from "../src/messagingPushNotificationService";

describe("MessagingPushNotificationService", () => {
	test("Can create an instance", async () => {
		MessagingPushNotificationsConnectorFactory.register(
			"messaging-push-notification",
			() => ({}) as unknown as IMessagingPushNotificationsConnector
		);
		const service = new MessagingPushNotificationService();
		expect(service).toBeDefined();
	});

	test("can construct", async () => {
		const service = new MessagingPushNotificationService();
		expect(service).toBeDefined();
	});

	test("throws error when registering a device with invalid applicationId", async () => {
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		await expect(
			service.registerDevice(undefined as unknown as string, "deviceToken")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "applicationId",
				value: "undefined"
			}
		});
	});

	test("throws error when registering a device with invalid deviceToken", async () => {
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		await expect(
			service.registerDevice("applicationId", undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceToken",
				value: "undefined"
			}
		});
	});

	test("can successfully register a device with valid inputs", async () => {
		MessagingPushNotificationsConnectorFactory.register(
			"messaging-push-notification",
			() =>
				({
					registerDevice: async () => "deviceId"
				}) as unknown as IMessagingPushNotificationsConnector
		);
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		const result = await service.registerDevice("applicationId", "deviceToken");

		expect(result).toBeDefined();
		expect(result.length).toBeGreaterThan(1);
	});

	test("throws error when sending a push notification with invalid deviceAddress", async () => {
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification(undefined as unknown as string, "title", "message")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceAddress",
				value: "undefined"
			}
		});
	});

	test("throws error when sending a push notification with invalid title", async () => {
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification("deviceAddress", undefined as unknown as string, "message")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "title",
				value: "undefined"
			}
		});
	});

	test("throws error when sending a push notification with invalid message", async () => {
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification("deviceAddress", "title", undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "message",
				value: "undefined"
			}
		});
	});

	test("can successfully send a push notification with valid inputs", async () => {
		MessagingPushNotificationsConnectorFactory.register(
			"messaging-push-notification",
			() =>
				({
					sendSinglePushNotification: async () => true
				}) as unknown as IMessagingPushNotificationsConnector
		);
		const service = new MessagingPushNotificationService({
			messagingConnectorType: "messaging-push-notification"
		});
		const result = await service.sendSinglePushNotification("deviceAddress", "title", "message");

		expect(result).toBe(true);
	});
});
