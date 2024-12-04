// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import { entity, property } from "@twin.org/entity";

/**
 *
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

	/**
	 * The error.
	 */
	@property({ type: "object" })
	public error?: IError;
}
