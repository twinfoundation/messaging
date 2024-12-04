// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";

/**
 * Call defining a template message entry.
 */
@entity()
export class TemplateEntry {
	/**
	 * The id.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The title.
	 */
	@property({ type: "string" })
	public title!: string;

	/**
	 * The content.
	 */
	@property({ type: "string" })
	public content!: string;

	/**
	 * The timestamp of the template entry.
	 */
	@property({ type: "integer" })
	public ts!: number;
}
