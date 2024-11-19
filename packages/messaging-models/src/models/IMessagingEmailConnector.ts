// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EmailCustomType } from "./emailsTypes";

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

	/**
	 * Create custom template.
	 * @param template The email template information.
	 * @returns If the template was created successfully.
	 * createTemplate(template: EmailTemplateType): Promise<boolean>;
	 */

	/**
	 * Send a email with a template to multiple recipients.
	 * @param sender The sender email address.
	 * @param templateName The name of the template.
	 * @param recipients The recipients of the email and their values.
	 * @returns If the email was sent successfully.
	 * sendMassiveEmail(
	 * sender: string,
	 * templateName: string,
	 * recipients: EmailRecipientType[]
	 * ): Promise<boolean>;
	 */
}
