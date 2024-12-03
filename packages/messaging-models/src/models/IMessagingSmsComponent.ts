// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing a SMS messaging component.
 */
export interface IMessagingSmsComponent extends IComponent {
	/**
	 * Send a SMS message to a phone number.
	 * @param phoneNumber The recipient phone number.
	 * @param message The message to send.
	 * @param userIdentity The user identity to use with SMS messaging operations.
	 * @param nodeIdentity The node identity to use with SMS messaging operations.
	 * @returns If the SMS was sent successfully.
	 */
	sendSMS(
		phoneNumber: string,
		message: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<boolean>;
}
