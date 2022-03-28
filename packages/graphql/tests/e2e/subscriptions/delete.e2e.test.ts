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

import { Driver } from "neo4j-driver";
import supertest, { Response } from "supertest";
import { Neo4jGraphQL } from "../../../src/classes";
import { generateUniqueType } from "../../utils/graphql-types";
import { ApolloTestServer, TestGraphQLServer } from "../setup/apollo-server";
import { TestSubscriptionsPlugin } from "../../utils/TestSubscriptionPlugin";
import { WebSocketClient, WebSocketTestClient } from "../setup/ws-client";
import neo4j from "../../integration/neo4j";

describe("Delete Subscription", () => {
    let driver: Driver;

    const typeMovie = generateUniqueType("Movie");

    let server: TestGraphQLServer;
    let wsClient: WebSocketClient;

    beforeAll(async () => {
        const typeDefs = `
         type ${typeMovie} {
             title: String
         }
         `;

        driver = await neo4j();

        const neoSchema = new Neo4jGraphQL({
            typeDefs,
            driver,
            plugins: {
                subscriptions: new TestSubscriptionsPlugin(),
            } as any,
        });

        server = new ApolloTestServer(neoSchema);
        await server.start();
        wsClient = new WebSocketTestClient(server.wsPath);
    });

    afterAll(async () => {
        await server.close();
        await driver.close();
        await wsClient.close();
    });

    test("delete subscription", async () => {
        const session = driver.session();
        try{
            await session.run(`CREATE (:${typeMovie.name} {title: "my-title"})`);
        } finally {
            session.close();
        }
        await wsClient.subscribe(`
                            subscription {
                                ${typeMovie.operations.subscribe.deleted} {
                                    ${typeMovie.operations.subscribe.payload.deleted} {
                                        title
                                    }
                                }
                            }
                            `);

        await deleteMovie("my-title");

        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "my-title" },
                },
            },
        ]);
    });

    async function deleteMovie(title: string): Promise<Response> {
        const result = await supertest(server.path)
            .post("")
            .send({
                query: `
                    mutation {
                        ${typeMovie.operations.delete}(where: {title: "${title}"}) {
                            nodesDeleted
                        }
                    }
                `,
            })
            .expect(200);
        return result;
    }
});
