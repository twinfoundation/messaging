// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MessagingConnectorFactory } from "../src/factories/messagingConnectorFactory";
import type { IMessagingConnector } from "../src/models/IMessagingConnector";

describe("MessagingConnectorFactory", () => {
	test("can add an item to the factory", async () => {
		MessagingConnectorFactory.register(
			"my-messaging-connector",
			() => ({}) as unknown as IMessagingConnector
		);
	});
});
