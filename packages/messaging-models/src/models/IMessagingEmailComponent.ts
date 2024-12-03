// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing an email messaging component.
 */
export interface IMessagingEmailComponent extends IComponent {
	/**
	 * Send a custom email.
	 * @param sender The sender email address.
	 * @param recipients An array of recipients email addresses.
	 * @param subject The subject of the email.
	 * @param content The html content of the email.
	 * @param userIdentity The user identity to use with email messaging operations.
	 * @param nodeIdentity The node identity to use with email messaging operations.
	 * @returns If the email was sent successfully.
	 */
	sendCustomEmail(
		sender: string,
		recipients: string[],
		subject: string,
		content: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<boolean>;
}
