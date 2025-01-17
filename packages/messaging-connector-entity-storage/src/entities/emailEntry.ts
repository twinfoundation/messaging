// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import { entity, property } from "@twin.org/entity";

/**
 * Call defining an email entry.
 */
@entity()
export class EmailEntry {
	/**
	 * The id.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The sender email address.
	 */
	@property({ type: "string" })
	public sender!: string;

	/**
	 * The recipient email addresses.
	 */
	@property({ type: "array", itemType: "string" })
	public recipients!: string[];

	/**
	 * The timestamp of the email entry.
	 */
	@property({ type: "integer" })
	public ts!: number;

	/**
	 * The message.
	 */
	@property({ type: "string" })
	public message!: string;

	/**
	 * The subject.
	 */
	@property({ type: "string" })
	public subject!: string;

	/**
	 * The status.
	 */
	@property({ type: "string" })
	public status!: string;

	/**
	 * The error.
	 */
	@property({ type: "object" })
	public error?: IError;
}
