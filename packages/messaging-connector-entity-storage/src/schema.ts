// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { EmailEntry } from "./entities/emailEntry";
import { PushNotificationDeviceEntry } from "./entities/pushNotificationDeviceEntry";
import { PushNotificationMessageEntry } from "./entities/pushNotificationMessageEntry";
import { SmsEntry } from "./entities/smsEntry";

/**
 * Initialize the schema for the messaging connector entity storage.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<EmailEntry>(), () =>
		EntitySchemaHelper.getSchema(EmailEntry)
	);

	EntitySchemaFactory.register(nameof<PushNotificationDeviceEntry>(), () =>
		EntitySchemaHelper.getSchema(PushNotificationDeviceEntry)
	);
	EntitySchemaFactory.register(nameof<PushNotificationMessageEntry>(), () =>
		EntitySchemaHelper.getSchema(PushNotificationMessageEntry)
	);

	EntitySchemaFactory.register(nameof<SmsEntry>(), () => EntitySchemaHelper.getSchema(SmsEntry));
}
