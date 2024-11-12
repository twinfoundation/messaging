// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IMessagingConnector } from "../models/IMessagingConnector";

/**
 * Factory for creating entity storage connectors.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MessagingConnectorFactory = Factory.createFactory<IMessagingConnector>("messaging");