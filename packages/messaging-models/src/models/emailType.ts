// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
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
