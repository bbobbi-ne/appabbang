/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  GetAuthData,
  GetAuthError,
  LoginCreateData,
  LoginCreateError,
  LoginCreatePayload,
  RefreshCreateData,
  RefreshCreateError,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * @description 사용자 로그인을 수행합니다.
 *
 * @tags Auth
 * @name LoginCreate
 * @summary 로그인
 * @request POST:/auth/login
 * @response `200` `LoginCreateData` 로그인 성공
 * @response `401` `{
  \** @example "Invalid credentials" *\
    message?: string,

}` 인증 실패 (잘못된 ID 또는 비밀번호)
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  loginCreate = (data: LoginCreatePayload, params: RequestParams = {}) =>
    this.request<LoginCreateData, LoginCreateError>({
      path: `/auth/login`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description 현재 로그인한 사용자의 정보를 조회합니다.
 *
 * @tags Auth
 * @name GetAuth
 * @summary 내 정보 조회
 * @request GET:/auth/me
 * @secure
 * @response `200` `GetAuthData` 사용자 정보 조회 성공
 * @response `401` `{
  \** @example "Unauthorized" *\
    message?: string,

}` 인증 실패
 * @response `404` `{
  \** @example "User not found" *\
    message?: string,

}` 사용자를 찾을 수 없음
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  getAuth = (params: RequestParams = {}) =>
    this.request<GetAuthData, GetAuthError>({
      path: `/auth/me`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * @description 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 *
 * @tags Auth
 * @name RefreshCreate
 * @summary 액세스 토큰 재발급
 * @request POST:/auth/refresh
 * @response `200` `RefreshCreateData` 액세스 토큰 재발급 성공
 * @response `401` `{
  \** @example "Refresh token missing" *\
    message?: string,

}` 리프레시 토큰 누락
 * @response `403` `{
  \** @example "Invalid refresh token" *\
    message?: string,

}` 유효하지 않은 리프레시 토큰
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  refreshCreate = (params: RequestParams = {}) =>
    this.request<RefreshCreateData, RefreshCreateError>({
      path: `/auth/refresh`,
      method: 'POST',
      format: 'json',
      ...params,
    });
}
