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
  LoginCreateData,
  LoginCreatePayload,
  RefreshCreateData,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 관리자 또는 고객이 로그인을 수행합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags Auth
   * @name LoginCreate
   * @summary 로그인
   * @request POST:/auth/login
   * @response `200` `LoginCreateData` 로그인 성공
   */
  loginCreate = (data: LoginCreatePayload, params: RequestParams = {}) =>
    this.http.request<LoginCreateData, any>({
      path: `/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 클라이언트의 정보를 조회합니다. (권한: 로그인 필요 - 관리자/고객 모두)
   *
   * @tags Auth
   * @name GetAuth
   * @summary 내 정보 조회
   * @request GET:/auth/me
   * @secure
   * @response `200` `GetAuthData` 사용자 정보 조회 성공
   */
  getAuth = (params: RequestParams = {}) =>
    this.http.request<GetAuthData, any>({
      path: `/auth/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 쿠키의 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags Auth
   * @name RefreshCreate
   * @summary 액세스 토큰 재발급
   * @request POST:/auth/refresh
   * @response `200` `RefreshCreateData` 액세스 토큰 재발급 성공
   */
  refreshCreate = (params: RequestParams = {}) =>
    this.http.request<RefreshCreateData, any>({
      path: `/auth/refresh`,
      method: "POST",
      format: "json",
      ...params,
    });
}
