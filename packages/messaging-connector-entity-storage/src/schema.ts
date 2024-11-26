// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { EmailEntry } from "./entities/emailEntry";

/**
 * Initialize the schema for the messaging connector entity storage.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<EmailEntry>(), () =>
		EntitySchemaHelper.getSchema(EmailEntry)
	);
}
