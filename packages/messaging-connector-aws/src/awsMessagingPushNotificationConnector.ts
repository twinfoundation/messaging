// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	CreatePlatformApplicationCommand,
	CreatePlatformEndpointCommand,
	ListEndpointsByPlatformApplicationCommand,
	type ListEndpointsByPlatformApplicationResponse,
	ListPlatformApplicationsCommand,
	PublishCommand,
	SNSClient
} from "@aws-sdk/client-sns";
import { GeneralError, Guards, Is } from "@twin.org/core";
import { type ILoggingConnector, LoggingConnectorFactory } from "@twin.org/logging-models";
import type { IMessagingPushNotificationsConnector } from "@twin.org/messaging-models";
import { nameof } from "@twin.org/nameof";
import type { IAwsConnectorConfig } from "./models/IAwsConnectorConfig";

/**
 * Class for connecting to the email messaging operations of the AWS services.
 */
export class AwsMessagingPushNotificationConnector implements IMessagingPushNotificationsConnector {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<AwsMessagingPushNotificationConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	protected readonly _logging?: ILoggingConnector;

	/**
	 * The configuration for the client connector.
	 * @internal
	 */
	private readonly _config: IAwsConnectorConfig;

	/**
	 * The Aws SNS client.
	 * @internal
	 */
	private readonly _client: SNSClient;

	/**
	 * A variable to store the application ids to the address because of the AWS usage.
	 * @internal
	 */
	private readonly _applicationMap: Map<string, string>;

	/**
	 * Create a new instance of AwsMessagingPushNotificationConnector.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.config The configuration for the AWS connector.
	 */
	constructor(options: { loggingConnectorType?: string; config: IAwsConnectorConfig }) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsConnectorConfig>(this.CLASS_NAME, nameof(options.config), options.config);
		Guards.stringValue(this.CLASS_NAME, nameof(options.config.endpoint), options.config.endpoint);
		Guards.stringValue(this.CLASS_NAME, nameof(options.config.region), options.config.region);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.config.accessKeyId),
			options.config.accessKeyId
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.config.secretAccessKey),
			options.config.secretAccessKey
		);
		Guards.arrayValue(
			this.CLASS_NAME,
			nameof(options.config.applicationsSettings),
			options.config.applicationsSettings
		);

		if (Is.stringValue(options.loggingConnectorType)) {
			this._logging = LoggingConnectorFactory.get(options.loggingConnectorType);
		}

		this._applicationMap = new Map<string, string>();
		this._config = options.config;
		this._client = new SNSClient({
			endpoint: this._config.endpoint,
			region: this._config.region,
			credentials: {
				accessKeyId: this._config.accessKeyId,
				secretAccessKey: this._config.secretAccessKey
			}
		});
	}

	/**
	 * The component needs to be started when the node is initialized.
	 * @param nodeIdentity The identity of the node starting the component.
	 * @param nodeLoggingConnectorType The node logging connector type, defaults to "node-logging".
	 * @returns Nothing.
	 */
	public async start(nodeIdentity: string, nodeLoggingConnectorType?: string): Promise<void> {
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "nodeStarting"
			});

			for (const app of this._config.applicationsSettings) {
				const {
					applicationId,
					pushNotificationsPlatformType,
					pushNotificationsPlatformCredentials
				} = app;
				try {
					const applicationAddress = await this.createPlatformApplication(
						applicationId,
						pushNotificationsPlatformType,
						pushNotificationsPlatformCredentials
					);
					this._applicationMap.set(applicationId, applicationAddress);
				} catch (err) {
					throw new GeneralError(
						this.CLASS_NAME,
						"applicationRegistrationFailed",
						{ property: "applicationId", value: applicationId },
						err
					);
				}
			}
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "applicationRegistrationFailed", undefined, err);
		}
	}

	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationId The application address.
	 * @param deviceToken The device token.
	 * @returns If the device was registered successfully.
	 */
	public async registerDevice(applicationId: string, deviceToken: string): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(applicationId), applicationId);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceToken), deviceToken);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "deviceRegistering"
			});

			const applicationArn = this._applicationMap.get(applicationId);
			if (!applicationArn) {
				throw new GeneralError(this.CLASS_NAME, "applicationIdNotFound", {
					property: "applicationId",
					value: applicationId
				});
			}

			const createEndpointParams = {
				PlatformApplicationArn: applicationArn,
				Token: deviceToken
			};
			const existingEndpointArn = await this.checkIfDeviceTokenExists(applicationArn, deviceToken);

			if (existingEndpointArn) {
				return existingEndpointArn;
			}
			const command = new CreatePlatformEndpointCommand(createEndpointParams);
			const data = await this._client.send(command);

			if (!data.EndpointArn) {
				throw new GeneralError(this.CLASS_NAME, "deviceTokenRegisterFailed", {
					property: "applicationId",
					value: applicationId
				});
			}
			return data.EndpointArn;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"deviceTokenRegisterFailed",
				{ property: "applicationId", value: applicationId },
				err
			);
		}
	}

	/**
	 * Send a push notification to a device.
	 * @param deviceAddress The address of the device.
	 * @param title The title of the notification.
	 * @param message The message to send.
	 * @returns If the notification was sent successfully.
	 */
	public async sendSinglePushNotification(
		deviceAddress: string,
		title: string,
		message: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(deviceAddress), deviceAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(title), title);
		Guards.stringValue(this.CLASS_NAME, nameof(message), message);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "pushNotificationSending"
			});
			const messagePackage = {
				default: message,
				GCM: JSON.stringify({
					notification: {
						title,
						body: message
					}
				})
			};
			const publishMessageParams = {
				Message: JSON.stringify(messagePackage),
				TargetArn: deviceAddress,
				MessageStructure: "json"
			};
			const command = new PublishCommand(publishMessageParams);
			const data = await this._client.send(command);
			if (data.$metadata.httpStatusCode !== 200) {
				await this._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "sendPushNotificationFailed"
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"sendPushNotificationFailed",
					{ value: deviceAddress },
					data
				);
			}
			return true;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"sendPushNotificationFailed",
				{ value: deviceAddress },
				err
			);
		}
	}

	/**
	 * Creates a platform application if it does not exist.
	 * @param applicationId The application identificator.
	 * @param platformType The type of platform used for the push notifications.
	 * @param platformCredentials The credentials for the used platform.
	 * @returns The platform application address.
	 */
	private async createPlatformApplication(
		applicationId: string,
		platformType: string,
		platformCredentials: string
	): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(applicationId), applicationId);
		Guards.stringValue(this.CLASS_NAME, nameof(platformType), platformType);
		Guards.stringValue(this.CLASS_NAME, nameof(platformCredentials), platformCredentials);
		try {
			const existingArn = await this.checkPlatformApplication(applicationId);
			if (existingArn) {
				this._applicationMap.set(applicationId, existingArn);
				return existingArn;
			}

			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "platformAppCreating"
			});

			const createParams = {
				Name: applicationId,
				Platform: platformType,
				Attributes: {
					PlatformCredential: platformCredentials
				}
			};

			const createCommand = new CreatePlatformApplicationCommand(createParams);
			const createData = await this._client.send(createCommand);
			if (createData.PlatformApplicationArn) {
				this._applicationMap.set(applicationId, createData.PlatformApplicationArn);
				return createData.PlatformApplicationArn;
			}
			throw new GeneralError(this.CLASS_NAME, "platformAppCreationFailed", undefined);
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "platformAppCreationFailed", undefined, err);
		}
	}

	/**
	 * Checks if the platform application exists.
	 * @param appName The name of the app.
	 * @returns The platform application address if it exists, otherwise undefined.
	 */
	private async checkPlatformApplication(appName: string): Promise<string | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(appName), appName);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "platformAppChecking"
			});
			const listCommand = new ListPlatformApplicationsCommand({});
			const data = await this._client.send(listCommand);
			if (data.PlatformApplications) {
				const existingApplication = data.PlatformApplications.find(app =>
					app.PlatformApplicationArn?.includes(appName)
				);

				if (existingApplication?.PlatformApplicationArn) {
					return existingApplication.PlatformApplicationArn;
				}
			}
			return undefined;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "platformAppCheckFailed", undefined, err);
		}
	}

	/**
	 * Checks if the device token exists in the platform application.
	 * @param applicationAddress The application address.
	 * @param deviceToken The device token.
	 * @returns The device address if it exists, otherwise undefined.
	 */
	private async checkIfDeviceTokenExists(
		applicationAddress: string,
		deviceToken: string
	): Promise<string | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(applicationAddress), applicationAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceToken), deviceToken);
		try {
			await this._logging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "deviceTokenChecking"
			});
			const command = new ListEndpointsByPlatformApplicationCommand({
				PlatformApplicationArn: applicationAddress
			});
			const data: ListEndpointsByPlatformApplicationResponse = await this._client.send(command);
			if (data.Endpoints) {
				const existingEndpoint = data.Endpoints.find(
					endpoint => endpoint.Attributes?.Token === deviceToken
				);

				if (existingEndpoint) {
					return existingEndpoint.EndpointArn;
				}
			}
			return undefined;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "deviceTokenCheckFailed", undefined, err);
		}
	}
}
