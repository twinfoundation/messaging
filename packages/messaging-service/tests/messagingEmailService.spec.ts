// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	MessagingEmailConnectorFactory,
	type IMessagingEmailConnector
} from "@twin.org/messaging-models";
import { MessagingEmailService } from "../src/messagingEmailService";

describe("MessagingEmailService", () => {
	test("Can create an instance", async () => {
		MessagingEmailConnectorFactory.register(
			"messaging-email",
			() => ({}) as unknown as IMessagingEmailConnector
		);
		const service = new MessagingEmailService();
		expect(service).toBeDefined();
	});

	test("can construct", async () => {
		const service = new MessagingEmailService();
		expect(service).toBeDefined();
	});

	test("throws error when sending email with invalid sender", async () => {
		const service = new MessagingEmailService({
			messagingConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				undefined as unknown as string,
				["recipient@example.com"],
				"Test Subject",
				"<p>Test Content</p>"
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
		const service = new MessagingEmailService({
			messagingConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				undefined as unknown as string[],
				"Test Subject",
				"<p>Test Content</p>"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "recipients",
				value: "undefined"
			}
		});
	});

	test("throws error when sending email with invalid subject", async () => {
		const service = new MessagingEmailService({
			messagingConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				undefined as unknown as string,
				"<p>Test Content</p>"
			)
		).rejects.toMatchObject({
			name: "GuardError",
			properties: {
				property: "subject",
				value: "undefined"
			}
		});
	});

	test("throws error when sending email with invalid content", async () => {
		const service = new MessagingEmailService({
			messagingConnectorType: "messaging-email"
		});
		await expect(
			service.sendCustomEmail(
				"sender@example.com",
				["recipient@example.com"],
				"Test Subject",
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

	test("sends email successfully with valid inputs", async () => {
		MessagingEmailConnectorFactory.register(
			"messaging-email",
			() =>
				({
					sendCustomEmail: async () => true
				}) as unknown as IMessagingEmailConnector
		);
		const service = new MessagingEmailService({
			messagingConnectorType: "messaging-email"
		});
		const result = await service.sendCustomEmail(
			"sender@example.com",
			["recipient@example.com"],
			"Test Subject",
			"<p>Test Content</p>"
		);
		expect(result).toBe(true);
	});
});
