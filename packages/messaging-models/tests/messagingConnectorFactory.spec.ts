// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	MessagingEmailConnectorFactory,
	MessagingPushNotificationsConnectorFactory,
	MessagingSmsConnectorFactory
} from "../src/factories/messagingConnectorFactory";
import type { IMessagingEmailConnector } from "../src/models/IMessagingEmailConnector";
import type { IMessagingPushNotificationsConnector } from "../src/models/IMessagingPushNotificationsConnector";
import type { IMessagingSmsConnector } from "../src/models/IMessagingSmsConnector";

describe("MessagingEmailConnectorFactory", () => {
	test("can add an email messaging item to the factory", async () => {
		MessagingEmailConnectorFactory.register(
			"my-messaging-MessagingEmailConnectorFactory",
			() => ({}) as unknown as IMessagingEmailConnector
		);
	});
});

describe("MessagingPushNotificationsConnectorFactory", () => {
	test("can add a push notification messaging item to the factory", async () => {
		MessagingPushNotificationsConnectorFactory.register(
			"my-messaging-MessagingPushNotificationsConnectorFactory",
			() => ({}) as unknown as IMessagingPushNotificationsConnector
		);
	});
});

describe("MessagingSmsConnectorFactory", () => {
	test("can add a sms messaging item to the factory", async () => {
		MessagingSmsConnectorFactory.register(
			"my-messaging-MessagingSmsConnectorFactory",
			() => ({}) as unknown as IMessagingSmsConnector
		);
	});
});
