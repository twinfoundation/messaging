// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { TemplateEntry } from "./entities/templateEntry";

/**
 * Initialize the schema for the messaging service.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<TemplateEntry>(), () =>
		EntitySchemaHelper.getSchema(TemplateEntry)
	);
}
