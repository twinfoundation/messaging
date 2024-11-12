// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EmailCustomType, EmailTemplateType, EmailRecipientType } from "./emailsTypes";

/**
 * Interface describing a messaging connector functionalities
 */
export interface IMessagingConnector extends IComponent {
	/**
	 * Send a custom email.
	 * @param info The information of the email to send.
	 * @returns If the email was sent successfully.
	 */
	sendCustomEmail(info: EmailCustomType): Promise<boolean>;

	/**
	 * Create custom template.
	 * @param info The email template information.
	 * @returns If the template was created successfully.
	 */
	createTemplate(info: EmailTemplateType): Promise<boolean>;

	/**
	 * Send a email with a template to multiple recipients.
	 * @param templateName The name of the template.
	 * @param recipients The recipients of the email and their values.
	 * @returns If the email was sent successfully.
	 */
	sendMassiveEmail(templateName: string, recipients: EmailRecipientType[]): Promise<boolean>;
}
