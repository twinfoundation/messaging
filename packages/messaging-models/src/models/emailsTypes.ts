// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The names of the messaging connectors functions.
 */

/**
 * The custom email type.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface EmailCustomType {
	/**
	 * The receiver email address.
	 */
	receiver: string;

	/**
	 * The email subject.
	 */
	subject: string;

	/**
	 * The email content in html format.
	 */
	content: string;
}

/**
 * The email template type.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface EmailTemplateType {
	/**
	 * The template name.
	 */
	name: string;

	/**
	 * The email subject.
	 */
	subject: string;

	/**
	 * The email language.
	 */
	language: string;

	/**
	 * The email content in html format.
	 */
	content: string;
}

/**
 * The email recipient type.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface EmailRecipientType {
	/**
	 * The recipient email.
	 */
	email: string;

	/**
	 * The recipient attributes.
	 */
	content: { key: string; value: string }[];
}
