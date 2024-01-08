/**
 * @packageDocumentation
 * @module api.functional.users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import type { IConnection, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { NOT_FOUND_USER } from "../../../common/error";
import type { ResponseForm } from "../../../common/response";
import type { CreateUserDto } from "../../../users/dto/create-user.dto";
import type { UpdateUserDto } from "../../../users/dto/update-user.dto";
import type { UserEntity } from "../../../users/entities/user.entity";
import { NestiaSimulator } from "../../utils/NestiaSimulator";

/**
 * 1-1 create user.
 * 
 * @tag 1 user
 * @returns created user info
 * 
 * @controller UsersController.postUser
 * @path POST /users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function postUser(
    connection: IConnection,
    dto: postUser.Input,
): Promise<postUser.Output> {
    return !!connection.simulate
        ? postUser.simulate(
              connection,
              dto,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...postUser.METADATA,
                  path: postUser.path(),
              } as const,
              dto,
          );
}
export namespace postUser {
    export type Input = Primitive<CreateUserDto>;
    export type Output = Primitive<CreateUserDto>;

    export const METADATA = {
        method: "POST",
        path: "/users",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (): string => {
        return `/users`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<CreateUserDto> =>
        typia.random<Primitive<CreateUserDto>>(g);
    export const simulate = async (
        connection: IConnection,
        dto: postUser.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(),
            contentType: "application/json",
        });
        assert.body(() => typia.assert(dto));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * 1-2 update user.
 * 
 * @tag 1 user
 * @param dto UpdateUserDto
 * @returns updated user
 * 
 * @controller UsersController.patchUser
 * @path PATCH /users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function patchUser(
    connection: IConnection,
    dto: patchUser.Input,
): Promise<patchUser.Output> {
    return !!connection.simulate
        ? patchUser.simulate(
              connection,
              dto,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...patchUser.METADATA,
                  path: patchUser.path(),
              } as const,
              dto,
          );
}
export namespace patchUser {
    export type Input = Primitive<UpdateUserDto>;
    export type Output = Primitive<UpdateUserDto>;

    export const METADATA = {
        method: "PATCH",
        path: "/users",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (): string => {
        return `/users`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<UpdateUserDto> =>
        typia.random<Primitive<UpdateUserDto>>(g);
    export const simulate = async (
        connection: IConnection,
        dto: patchUser.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(),
            contentType: "application/json",
        });
        assert.body(() => typia.assert(dto));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * 1-3 get user.
 * 
 * @tag 1 user
 * @param userId user id
 * @returns user info
 * 
 * @controller UsersController.getUser
 * @path GET /users/:userId
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getUser(
    connection: IConnection,
    userId: number,
): Promise<getUser.Output> {
    return !!connection.simulate
        ? getUser.simulate(
              connection,
              userId,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...getUser.METADATA,
                  path: getUser.path(userId),
              } as const,
          );
}
export namespace getUser {
    export type Output = Primitive<ResponseForm<UserEntity> | NOT_FOUND_USER>;

    export const METADATA = {
        method: "GET",
        path: "/users/:userId",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (userId: number): string => {
        return `/users/${encodeURIComponent(userId ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<ResponseForm<UserEntity> | NOT_FOUND_USER> =>
        typia.random<Primitive<ResponseForm<UserEntity> | NOT_FOUND_USER>>(g);
    export const simulate = async (
        connection: IConnection,
        userId: number,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(userId),
            contentType: "application/json",
        });
        assert.param("userId")(() => typia.assert(userId));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}