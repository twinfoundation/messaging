// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	CreatePlatformApplicationCommand,
	CreatePlatformEndpointCommand,
	CreateTopicCommand,
	ListEndpointsByPlatformApplicationCommand,
	type ListEndpointsByPlatformApplicationResponse,
	ListPlatformApplicationsCommand,
	ListSubscriptionsByTopicCommand,
	ListTopicsCommand,
	PublishCommand,
	SNSClient,
	SubscribeCommand
} from "@aws-sdk/client-sns";
import { GeneralError, Guards } from "@twin.org/core";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
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
	 * The configuration for the SNS connector.
	 * @internal
	 */
	private readonly _snsConfig: IAwsConnectorConfig;

	/**
	 * The Aws SNS client.
	 * @internal
	 */
	private readonly _snsClient: SNSClient;

	/**
	 * Create a new instance of IAwsConnectorConfig.
	 * @param options The options for the connector.
	 * @param options.loggingConnectorType The type of logging connector to use, defaults to no logging.
	 * @param options.snsConfig The configuration for the SNS connector.
	 */
	constructor(options: { loggingConnectorType?: string; snsConfig: IAwsConnectorConfig }) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object<IAwsConnectorConfig>(
			this.CLASS_NAME,
			nameof(options.snsConfig),
			options.snsConfig
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.snsConfig.endpoint),
			options.snsConfig.endpoint
		);
		Guards.stringValue(this.CLASS_NAME, nameof(options.snsConfig.region), options.snsConfig.region);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.snsConfig.accessKeyId),
			options.snsConfig.accessKeyId
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.snsConfig.secretAccessKey),
			options.snsConfig.secretAccessKey
		);

		this._snsConfig = options.snsConfig;
		this._snsClient = new SNSClient({
			endpoint: this._snsConfig.endpoint,
			region: this._snsConfig.region,
			credentials: {
				accessKeyId: this._snsConfig.accessKeyId,
				secretAccessKey: this._snsConfig.secretAccessKey
			}
		});
	}

	/**
	 * Creates a platform application if it does not exist.
	 * @param appName The name of the app.
	 * @param platformType The type of platform used for the push notifications.
	 * @param platformCredentials The credentials for the used platform.
	 * @returns The platform application address.
	 */
	public async createPlatformApplication(
		appName: string,
		platformType: string,
		platformCredentials: string
	): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(appName), appName);
		Guards.stringValue(this.CLASS_NAME, nameof(platformType), platformType);
		Guards.stringValue(this.CLASS_NAME, nameof(platformCredentials), platformCredentials);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			const existingArn = await this.checkPlatformApplication(appName);
			if (existingArn) {
				return existingArn;
			}

			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "platformAppCreating"
			});

			const createParams = {
				Name: appName,
				Platform: platformType,
				Attributes: {
					PlatformCredential: platformCredentials
				}
			};

			const createCommand = new CreatePlatformApplicationCommand(createParams);
			const createData = await this._snsClient.send(createCommand);
			if (createData.PlatformApplicationArn) {
				return createData.PlatformApplicationArn;
			}
			throw new GeneralError(this.CLASS_NAME, "platformAppCreationFailed", undefined);
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "platformAppCreationFailed", undefined, err);
		}
	}

	/**
	 * Registers a device to an specific app in order to send notifications to it.
	 * @param applicationAddress The application address.
	 * @param deviceToken The device token.
	 * @returns If the device was registered successfully.
	 */
	public async registerDevice(applicationAddress: string, deviceToken: string): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(applicationAddress), applicationAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceToken), deviceToken);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "deviceRegistering"
			});

			const createEndpointParams = {
				PlatformApplicationArn: applicationAddress,
				Token: deviceToken
			};
			const existingEndpointArn = await this.checkIfDeviceTokenExists(
				applicationAddress,
				deviceToken
			);
			if (existingEndpointArn) {
				return existingEndpointArn;
			}
			const command = new CreatePlatformEndpointCommand(createEndpointParams);
			const data = await this._snsClient.send(command);
			if (!data.EndpointArn) {
				throw new GeneralError(this.CLASS_NAME, "deviceTokenRegisterFailed", {
					property: "applicationAddress",
					value: applicationAddress
				});
			}
			return data.EndpointArn;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"deviceTokenRegisterFailed",
				{ property: "applicationAddress", value: applicationAddress },
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
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
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
			const data = await this._snsClient.send(command);
			if (data.$metadata.httpStatusCode !== 200) {
				await nodeLogging?.log({
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
	 * Creates a topic if it does not exist.
	 * @param topicName The name of the topic.
	 * @returns The topic address.
	 */
	public async createTopic(topicName: string): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(topicName), topicName);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "topicCreating"
			});
			const existingTopicArn = await this.checkIfTopicExists(topicName);
			if (existingTopicArn) {
				return existingTopicArn;
			}
			const command = new CreateTopicCommand({ Name: topicName });
			const data = await this._snsClient.send(command);
			if (data.TopicArn) {
				return data.TopicArn;
			}
			throw new GeneralError(this.CLASS_NAME, "createTopicFailed", { value: topicName }, data);
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "createTopicFailed", { value: topicName }, err);
		}
	}

	/**
	 * Subscribes a device to a topic.
	 * @param topicAddress The address of the topic.
	 * @param deviceAddress The address of the device.
	 * @returns True if the subscription was successful.
	 */
	public async subscribeToTopic(topicAddress: string, deviceAddress: string): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(topicAddress), topicAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceAddress), deviceAddress);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "topicSubscribing"
			});
			const existingSubscriptionArn = await this.checkIfSubscriptionExists(
				topicAddress,
				deviceAddress
			);
			if (existingSubscriptionArn) {
				return true;
			}
			const params = {
				TopicArn: topicAddress,
				Protocol: "application",
				Endpoint: deviceAddress
			};
			const command = new SubscribeCommand(params);
			const data = await this._snsClient.send(command);
			if (data?.SubscriptionArn) {
				return true;
			}
			throw new GeneralError(
				this.CLASS_NAME,
				"subscribeToTopicFailed",
				{ topic: topicAddress, device: deviceAddress },
				data
			);
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"subscribeToTopicFailed",
				{ topic: topicAddress, device: deviceAddress },
				err
			);
		}
	}

	/**
	 * Publishes a message to a topic.
	 * @param topicAddress The address of the topic.
	 * @param title The title of the message.
	 * @param message The message to send.
	 * @returns If the message was published successfully to the topic.
	 */
	public async publishToTopic(
		topicAddress: string,
		title: string,
		message: string
	): Promise<boolean> {
		Guards.stringValue(this.CLASS_NAME, nameof(topicAddress), topicAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(title), title);
		Guards.stringValue(this.CLASS_NAME, nameof(message), message);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "topicPublishing"
			});
			const messageParams = {
				default: message,
				GCM: JSON.stringify({
					notification: {
						title,
						body: message
					}
				})
			};
			const publishMessageParams = {
				Message: JSON.stringify(messageParams),
				TopicArn: topicAddress,
				MessageStructure: "json"
			};

			const command = new PublishCommand(publishMessageParams);
			const data = await this._snsClient.send(command);
			if (data.$metadata.httpStatusCode !== 200) {
				await nodeLogging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "sendTopicPushNotificationFailed"
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"sendTopicPushNotificationFailed",
					{ topic: topicAddress },
					data
				);
			}
			return true;
		} catch (err) {
			throw new GeneralError(
				this.CLASS_NAME,
				"sendTopicPushNotificationFailed",
				{ topic: topicAddress },
				err
			);
		}
	}

	/**
	 * Checks if the platform application exists.
	 * @param appName The name of the app.
	 * @returns The platform application address if it exists, otherwise undefined.
	 */
	private async checkPlatformApplication(appName: string): Promise<string | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(appName), appName);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "platformAppChecking"
			});
			const listCommand = new ListPlatformApplicationsCommand({});
			const data = await this._snsClient.send(listCommand);
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
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "deviceTokenChecking"
			});
			const command = new ListEndpointsByPlatformApplicationCommand({
				PlatformApplicationArn: applicationAddress
			});
			const data: ListEndpointsByPlatformApplicationResponse = await this._snsClient.send(command);
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

	/**
	 * Checks if the topic exists in the application.
	 * @param topicName The topic name.
	 * @returns The topic address if it exists, otherwise undefined.
	 */
	private async checkIfTopicExists(topicName: string): Promise<string | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(topicName), topicName);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "topicChecking"
			});
			const command = new ListTopicsCommand({});
			const data = await this._snsClient.send(command);

			if (data.Topics) {
				const existingTopic = data.Topics.find(topic => topic.TopicArn?.endsWith(`:${topicName}`));

				if (existingTopic?.TopicArn) {
					return existingTopic.TopicArn;
				}
			}
			return undefined;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "deviceTokenCheckFailed", undefined, err);
		}
	}

	/**
	 * Checks if the subscription exists for a given topic and device.
	 * @param topicAddress The address of the topic.
	 * @param deviceAddress The address of the device.
	 * @returns The subscription address if it exists, otherwise undefined.
	 */
	private async checkIfSubscriptionExists(
		topicAddress: string,
		deviceAddress: string
	): Promise<string | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(topicAddress), topicAddress);
		Guards.stringValue(this.CLASS_NAME, nameof(deviceAddress), deviceAddress);
		const nodeLogging = LoggingConnectorFactory.getIfExists(this.CLASS_NAME ?? "node-logging");
		try {
			await nodeLogging?.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "subscriptionChecking"
			});
			const command = new ListSubscriptionsByTopicCommand({
				TopicArn: topicAddress
			});
			const data = await this._snsClient.send(command);

			const existingSubscription = data.Subscriptions?.find(
				subscription =>
					subscription.Protocol === "application" && subscription.Endpoint === deviceAddress
			);

			if (existingSubscription) {
				return existingSubscription.SubscriptionArn;
			}
			return undefined;
		} catch (err) {
			throw new GeneralError(this.CLASS_NAME, "subscriptionCheckFailed", undefined, err);
		}
	}
}
