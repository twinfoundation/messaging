// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EmailCustomType, EmailTemplateType, EmailRecipientType } from "./emailsTypes";

/**
 * Interface describing a messaging connector functionalities
 */
export interface IMessagingConnector extends IComponent {
	/**
	 * Email related functions
	 */

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

	/**
	 * SMS related functions
	 */

	/**
	 * Send a SMS message to a phone number.
	 * @param phoneNumber The recipient phone number.
	 * @param message The message to send.
	 * @returns If the SMS was sent successfully.
	 */
	sendSMS(phoneNumber: string, message: string): Promise<boolean>;

	/**
	 * Push notifications related functions
	 */

	/**
	 * Creates a platform application to push notifications to it.
	 * @param applicationName The name of the application.
	 * @param platformType The type of platform used for the push notifications.
	 * @param platformCredentials The credentials for the used platform.
	 * @returns The platform application address.
	 */
	createPlatformApplication(
		applicationName: string,
		platformType: string,
		platformCredentials: string
	): Promise<string>;

	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationAddress The application address.
	 * @param deviceToken The device token.
	 * @returns The device register address.
	 */
	registerDevice(applicationAddress: string, deviceToken: string): Promise<string>;

	/**
	 * Send a push notification to a device.
	 * @param deviceAddress The address of the device.
	 * @param title The title of the notification.
	 * @param message The message to send.
	 * @returns If the notification was sent successfully.
	 */
	sendSinglePushNotification(
		deviceAddress: string,
		title: string,
		message: string
	): Promise<boolean>;
}
