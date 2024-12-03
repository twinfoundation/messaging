// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	MessagingSmsConnectorFactory,
	type IMessagingSmsConnector
} from "@twin.org/messaging-models";
import { MessagingSmsService } from "../src/messagingSmsService";

describe("MessagingSmsService", () => {
	test("Can create an instance", async () => {
		MessagingSmsConnectorFactory.register(
			"messaging-sms",
			() => ({}) as unknown as IMessagingSmsConnector
		);
		const service = new MessagingSmsService();
		expect(service).toBeDefined();
	});

	test("can construct", async () => {
		const service = new MessagingSmsService();
		expect(service).toBeDefined();
	});

	test("throws error when sending sms with invalid phone number", async () => {
		const service = new MessagingSmsService({
			messagingConnectorType: "messaging-sms"
		});
		await expect(
			service.sendSMS(undefined as unknown as string, "<p>Test Content</p>")
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "phoneNumber",
				value: "undefined"
			}
		});
	});

	test("throws error when sending sms with invalid message", async () => {
		const service = new MessagingSmsService({
			messagingConnectorType: "messaging-sms"
		});
		await expect(
			service.sendSMS("1234567890", undefined as unknown as string)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "message",
				value: "undefined"
			}
		});
	});

	test("sends sms successfully with valid inputs", async () => {
		MessagingSmsConnectorFactory.register(
			"messaging-sms",
			() =>
				({
					sendSMS: async () => true
				}) as unknown as IMessagingSmsConnector
		);
		const service = new MessagingSmsService({
			messagingConnectorType: "messaging-sms"
		});
		const result = await service.sendSMS("1234567890", "Message");
		expect(result).toBe(true);
	});
});
