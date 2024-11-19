// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EmailCustomType } from "./emailType";

/**
 * Interface describing the email messaging connector functionalities
 */
export interface IMessagingEmailConnector extends IComponent {
	/**
	 * Send a custom email.
	 * @param sender The sender email address.
	 * @param info The information of the email to send.
	 * @returns If the email was sent successfully.
	 */
	sendCustomEmail(sender: string, info: EmailCustomType): Promise<boolean>;
}
