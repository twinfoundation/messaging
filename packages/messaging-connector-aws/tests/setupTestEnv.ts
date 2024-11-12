// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import path from "node:path";
import { Guards } from "@twin.org/core";
import * as dotenv from "dotenv";
import type { IAwsSESConnectorConfig } from "../src/models/IAwsSESConnectorConfig";

dotenv.config({ path: [path.join(__dirname, ".env"), path.join(__dirname, ".env.dev")] });

console.debug("Setting up test environment from .env and .env.dev files");

Guards.stringValue("TestEnv", "TEST_AWS_ENDPOINT", process.env.TEST_AWS_ENDPOINT);
Guards.stringValue("TestEnv", "TEST_AWS_REGION", process.env.TEST_AWS_REGION);
Guards.stringValue("TestEnv", "TEST_AWS_KEY_ID", process.env.TEST_AWS_KEY_ID);
Guards.stringValue("TestEnv", "TEST_AWS_KEY_SECRET", process.env.TEST_AWS_KEY_SECRET);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const TEST_AWS_CONFIG: IAwsSESConnectorConfig = {
	endpoint: process.env.TEST_AWS_ENDPOINT,
	region: process.env.TEST_AWS_REGION,
	accessKeyId: process.env.TEST_AWS_KEY_ID,
	secretAccessKey: process.env.TEST_AWS_KEY_SECRET
};