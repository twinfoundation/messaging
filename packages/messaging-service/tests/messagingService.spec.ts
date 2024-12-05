// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import {
	MessagingEmailConnectorFactory,
	MessagingPushNotificationsConnectorFactory,
	MessagingSmsConnectorFactory,
	type IMessagingEmailConnector,
	type IMessagingPushNotificationsConnector,
	type IMessagingSmsConnector
} from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import { TemplateEntry } from "../src/entities/templateEntry";
import { MessagingService } from "../src/messagingService";

describe("MessagingService", () => {
	test("Can create an instance", async () => {
		MessagingEmailConnectorFactory.register(
			"messaging-email",
			() => ({}) as unknown as IMessagingEmailConnector
		);
		MessagingPushNotificationsConnectorFactory.register(
			"messaging-push-notification",
			() => ({}) as unknown as IMessagingPushNotificationsConnector
		);
		MessagingSmsConnectorFactory.register(
			"messaging-sms",
			() => ({}) as unknown as IMessagingSmsConnector
		);
		EntityStorageConnectorFactory.register(
			"template-entry",
			() => ({}) as unknown as IEntityStorageConnector
		);
		const service = new MessagingService();
		expect(service).toBeDefined();
	});

	test("can construct", async () => {
		const service = new MessagingService();
		expect(service).toBeDefined();
	});

	test("throws error when sending email with invalid sender", async () => {
		const service = new MessagingService({
			messagingEmailConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				undefined as unknown as string,
				["recipient@example.com"],
				"templateId",
				{ name: "name" },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "sender",
				value: "undefined"
			}
		});
	});

	test("throws error when sending email with invalid recipients", async () => {
		const service = new MessagingService({
			messagingEmailConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				undefined as unknown as string[],
				"templateId",
				{ name: "name" },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "recipients",
				value: "undefined"
			}
		});
	});

	test("throws error when sending email with invalid templateId", async () => {
		const service = new MessagingService({
			messagingEmailConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				undefined as unknown as string,
				{ name: "name" },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "templateId",
				value: "undefined"
			}
		});
	});

	test("throws error when sending email with invalid data", async () => {
		const service = new MessagingService({
			messagingEmailConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				"templateId",
				undefined as unknown as { [key: string]: string },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "data",
				value: "undefined"
			}
		});
	});

	test("throws error when sending email with invalid locale", async () => {
		const service = new MessagingService({
			messagingEmailConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				"templateId",
				{},
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "locale",
				value: "undefined"
			}
		});
	});

	test("throws error when sending an email without defining the Email connector", async () => {
		const service = new MessagingService();
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				"templateId",
				{ name: "name" },
				"en"
			)
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				property: "emailMessagingConnector",
				value: "undefined"
			}
		});
	});

	test("sends email successfully with valid inputs", async () => {
		MessagingEmailConnectorFactory.register(
			"messaging-email",
			() =>
				({
					sendCustomEmail: async () => true
				}) as unknown as IMessagingEmailConnector
		);
		const mockStorage = {
			get: async (templateId: string) => ({
				id: templateId,
				title: "Test Title",
				content: "Hello, {{name}}"
			})
		} as unknown as IEntityStorageConnector;

		EntityStorageConnectorFactory.register("template-entry", () => mockStorage);
		const service = new MessagingService({
			messagingEmailConnectorType: "messaging-email"
		});
		const result = await service.sendCustomEmail(
			"sender@example.com",
			["recipient@example.com"],
			"templateId",
			{ name: "name" },
			"en"
		);
		expect(result).toBe(true);
	});

	test("throws error when registering device with invalid applicationId", async () => {
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
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

	test("throws error when registering device with invalid deviceToken", async () => {
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
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

	test("throws error when registering a device without defining the Push Notification connector", async () => {
		const service = new MessagingService();
		await expect(service.registerDevice("applicationId", "deviceToken")).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				property: "pushNotificationMessagingConnector",
				value: "undefined"
			}
		});
	});

	test("registers device successfully with valid inputs", async () => {
		MessagingPushNotificationsConnectorFactory.register(
			"messaging-push-notification",
			() =>
				({
					registerDevice: async () => "deviceRegistered"
				}) as unknown as IMessagingPushNotificationsConnector
		);
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
		});
		const result = await service.registerDevice("applicationId", "deviceToken");
		expect(result).toBe("deviceRegistered");
	});

	test("throws error when sending push notification with invalid deviceAddress", async () => {
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification(
				undefined as unknown as string,
				"templateId",
				{ name: "name" },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "deviceAddress",
				value: "undefined"
			}
		});
	});

	test("throws error when sending push notification with invalid templateId", async () => {
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification(
				"deviceAddress",
				undefined as unknown as string,
				{ name: "name" },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "templateId",
				value: "undefined"
			}
		});
	});

	test("throws error when sending push notification with invalid data", async () => {
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification(
				"deviceAddress",
				"templateId",
				undefined as unknown as { [key: string]: string },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "data",
				value: "undefined"
			}
		});
	});

	test("throws error when sending push notification with invalid locale", async () => {
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
		});
		await expect(
			service.sendSinglePushNotification(
				"deviceAddress",
				"templateId",
				{ name: "name" },
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "locale",
				value: "undefined"
			}
		});
	});

	test("throws error when sending a push notification without defining the Push Notification connector", async () => {
		const service = new MessagingService();
		await expect(
			service.sendSinglePushNotification("deviceAddress", "templateId", { name: "name" }, "en")
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				property: "pushNotificationMessagingConnector",
				value: "undefined"
			}
		});
	});

	test("sends push notification successfully with valid inputs", async () => {
		MessagingPushNotificationsConnectorFactory.register(
			"messaging-push-notification",
			() =>
				({
					sendSinglePushNotification: async () => true
				}) as unknown as IMessagingPushNotificationsConnector
		);
		const mockStorage = {
			get: async (templateId: string) => ({
				id: templateId,
				title: "Test Title",
				content: "Hello, {{name}}"
			})
		} as unknown as IEntityStorageConnector;

		EntityStorageConnectorFactory.register("template-entry", () => mockStorage);
		const service = new MessagingService({
			messagingPushNotificationConnectorType: "messaging-push-notification"
		});
		const result = await service.sendSinglePushNotification(
			"deviceAddress",
			"templateId",
			{ name: "name" },
			"en"
		);
		expect(result).toBe(true);
	});

	test("throws error when sending SMS with invalid phoneNumber", async () => {
		const service = new MessagingService({
			messagingSmsConnectorType: "messaging-sms"
		});
		await expect(
			service.sendSMS(undefined as unknown as string, "templateId", { name: "name" }, "en")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "phoneNumber",
				value: "undefined"
			}
		});
	});

	test("throws error when sending SMS with invalid templateId", async () => {
		const service = new MessagingService({
			messagingSmsConnectorType: "messaging-sms"
		});
		await expect(
			service.sendSMS("1234567890", undefined as unknown as string, { name: "name" }, "en")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "templateId",
				value: "undefined"
			}
		});
	});

	test("throws error when sending SMS with invalid data", async () => {
		const service = new MessagingService({
			messagingSmsConnectorType: "messaging-sms"
		});
		await expect(
			service.sendSMS(
				"1234567890",
				"templateId",
				undefined as unknown as { [key: string]: string },
				"en"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "data",
				value: "undefined"
			}
		});
	});

	test("throws error when sending SMS with invalid locale", async () => {
		const service = new MessagingService({
			messagingSmsConnectorType: "messaging-sms"
		});
		await expect(
			service.sendSMS("1234567890", "templateId", { name: "name" }, undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "locale",
				value: "undefined"
			}
		});
	});

	test("throws error when sending SMS without defining the SMS connector", async () => {
		const service = new MessagingService();
		await expect(
			service.sendSMS("1234567890", "templateId", { name: "name" }, "en")
		).rejects.toMatchObject({
			name: "GeneralError",
			properties: {
				property: "smsMessagingConnector",
				value: "undefined"
			}
		});
	});

	test("sends SMS successfully with valid inputs", async () => {
		MessagingSmsConnectorFactory.register(
			"messaging-sms",
			() =>
				({
					sendSMS: async () => true
				}) as unknown as IMessagingSmsConnector
		);
		const mockStorage = {
			get: async (templateId: string) => ({
				id: templateId,
				title: "Test Title",
				content: "Hello, {{name}}"
			})
		} as unknown as IEntityStorageConnector;

		EntityStorageConnectorFactory.register("template-entry", () => mockStorage);
		const service = new MessagingService({
			messagingSmsConnectorType: "messaging-sms"
		});
		const result = await service.sendSMS("1234567890", "templateId", { name: "name" }, "en");
		expect(result).toBe(true);
	});

	test("throws error when creating or updating template with invalid templateId", async () => {
		const service = new MessagingService();
		await expect(
			service.createOrUpdateTemplate(
				undefined as unknown as string,
				"en",
				"Test Title",
				"Test Content"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "templateId",
				value: "undefined"
			}
		});
	});

	test("throws error when creating or updating template with invalid locale", async () => {
		const service = new MessagingService();
		await expect(
			service.createOrUpdateTemplate(
				"templateId",
				undefined as unknown as string,
				"Test Title",
				"Test Content"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "locale",
				value: "undefined"
			}
		});
	});

	test("throws error when creating or updating template with invalid title", async () => {
		const service = new MessagingService();
		await expect(
			service.createOrUpdateTemplate(
				"templateId",
				"en",
				undefined as unknown as string,
				"Test Content"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "title",
				value: "undefined"
			}
		});
	});

	test("throws error when creating or updating template with invalid content", async () => {
		const service = new MessagingService();
		await expect(
			service.createOrUpdateTemplate(
				"templateId",
				"en",
				"Test Title",
				undefined as unknown as string
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "content",
				value: "undefined"
			}
		});
	});

	test("creates or updates template successfully with valid inputs", async () => {
		EntitySchemaFactory.register(nameof<TemplateEntry>(), () =>
			EntitySchemaHelper.getSchema(TemplateEntry)
		);
		EntityStorageConnectorFactory.register(
			"template-entry",
			() =>
				new MemoryEntityStorageConnector<TemplateEntry>({
					entitySchema: nameof<TemplateEntry>()
				})
		);
		const service = new MessagingService();
		const result = await service.createOrUpdateTemplate(
			"templateId",
			"en",
			"Test Title",
			"Test Content"
		);
		expect(result).toBe(true);
	});
});
