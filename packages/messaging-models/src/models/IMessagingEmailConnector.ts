// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing the email messaging connector functionalities
 */
export interface IMessagingEmailConnector extends IComponent {
	/**
	 * Send a custom email.
	 * @param sender The sender email address.
	 * @param receivers An array of receivers email addresses.
	 * @param subject The subject of the email.
	 * @param content The html content of the email.
	 * @returns If the email was sent successfully.
	 */
	sendCustomEmail(
		sender: string,
		receivers: string[],
		subject: string,
		content: string
	): Promise<boolean>;
}
