// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IMessagingEmailConnector } from "../models/IMessagingEmailConnector";
import type { IMessagingPushNotificationsConnector } from "../models/IMessagingPushNotificationsConnector";
import type { IMessagingSmsConnector } from "../models/IMessagingSmsConnector";

/**
 * Factory for creating messaging email connectors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MessagingEmailConnectorFactory =
	Factory.createFactory<IMessagingEmailConnector>("messaging-email");

/**
 * Factory for creating messaging push notification connectors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MessagingPushNotificationsConnectorFactory =
	Factory.createFactory<IMessagingPushNotificationsConnector>("messaging-push-notifications");

/**
 * Factory for creating messaging sms connectors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MessagingSmsConnectorFactory =
	Factory.createFactory<IMessagingSmsConnector>("messaging-sms");
