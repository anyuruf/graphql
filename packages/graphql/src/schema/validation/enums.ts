/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GraphQLEnumType } from "graphql";
import { RelationshipQueryDirectionOption } from "../../constants";

export const CallbackOperationEnum = new GraphQLEnumType({
    name: "CallbackOperation",
    values: {
        CREATE: {},
        UPDATE: {},
    },
});

export const ExcludeOperationEnum = new GraphQLEnumType({
    name: "ExcludeOperation",
    values: {
        CREATE: {},
        READ: {},
        UPDATE: {},
        DELETE: {},
    },
});

export const RelationshipDirectionEnum = new GraphQLEnumType({
    name: "RelationshipDirection",
    values: {
        IN: {},
        OUT: {},
    },
});
export const RelationshipQueryDirectionEnum = new GraphQLEnumType({
    name: "RelationshipQueryDirection",
    values: {
        [RelationshipQueryDirectionOption.DEFAULT_DIRECTED]: {},
        [RelationshipQueryDirectionOption.DEFAULT_UNDIRECTED]: {},
        [RelationshipQueryDirectionOption.DIRECTED_ONLY]: {},
        [RelationshipQueryDirectionOption.UNDIRECTED_ONLY]: {},
    },
});

export const SortDirection = new GraphQLEnumType({
    name: "SortDirection",
    values: {
        ASC: {},
        DESC: {},
    },
});

export const TimestampOperationEnum = new GraphQLEnumType({
    name: "TimestampOperation",
    values: {
        CREATE: {},
        UPDATE: {},
    },
});
