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
  BreadsCreateData,
  BreadsCreatePayload,
  BreadsDeleteData,
  BreadsDeletePayload,
  BreadsDetailData,
  BreadsListData,
  BreadsUpdateData,
  BreadsUpdatePayload,
  ImageDeleteData,
  ImageDeletePayload,
  StatusUpdateData,
  StatusUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Breads<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 빵 목록을 조회합니다. (권한: 선택적 로그인 - 어드민은 추가 정보 제공)
   *
   * @tags Breads
   * @name BreadsList
   * @summary 빵 목록 조회
   * @request GET:/breads
   * @secure
   * @response `200` `BreadsListData` 빵 목록 조회 성공
   */
  breadsList = (params: RequestParams = {}) =>
    this.http.request<BreadsListData, any>({
      path: `/breads`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 빵을 등록합니다. 이미지 업로드가 선택적으로 가능합니다. (권한: 관리자만)
   *
   * @tags Breads
   * @name BreadsCreate
   * @summary 빵 등록
   * @request POST:/breads
   * @secure
   * @response `201` `BreadsCreateData` 빵 등록 성공
   */
  breadsCreate = (data: BreadsCreatePayload, params: RequestParams = {}) =>
    this.http.request<BreadsCreateData, any>({
      path: `/breads`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 여러 빵을 한 번에 삭제합니다. (권한: 관리자만)
   *
   * @tags Breads
   * @name BreadsDelete
   * @summary 빵 삭제 (여러건)
   * @request DELETE:/breads
   * @secure
   * @response `204` `BreadsDeleteData` 빵 삭제 성공
   */
  breadsDelete = (data: BreadsDeletePayload, params: RequestParams = {}) =>
    this.http.request<BreadsDeleteData, any>({
      path: `/breads`,
      method: "DELETE",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 빵의 상세 정보를 조회합니다. (권한: 선택적 로그인 - 어드민은 추가 정보 제공)
   *
   * @tags Breads
   * @name BreadsDetail
   * @summary 빵 상세 조회
   * @request GET:/breads/{no}
   * @secure
   * @response `200` `BreadsDetailData` 빵 상세 조회 성공
   */
  breadsDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<BreadsDetailData, any>({
      path: `/breads/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 빵의 정보를 수정합니다. 이미지 업로드가 선택적으로 가능합니다. (권한: 관리자만)
   *
   * @tags Breads
   * @name BreadsUpdate
   * @summary 빵 수정
   * @request PUT:/breads/{no}
   * @secure
   * @response `200` `BreadsUpdateData` 빵 수정 성공
   */
  breadsUpdate = (
    no: number,
    data: BreadsUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<BreadsUpdateData, any>({
      path: `/breads/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 빵의 상태만 수정합니다. (권한: 관리자만)
   *
   * @tags Breads
   * @name StatusUpdate
   * @summary 빵 상태 수정
   * @request PUT:/breads/{no}/status
   * @secure
   * @response `200` `StatusUpdateData` 빵 상태 수정 성공
   */
  statusUpdate = (
    no: number,
    data: StatusUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<StatusUpdateData, any>({
      path: `/breads/${no}/status`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 빵의 이미지를 삭제합니다. (권한: 관리자만)
   *
   * @tags Breads
   * @name ImageDelete
   * @summary 빵 이미지 삭제
   * @request DELETE:/breads/image
   * @secure
   * @response `204` `ImageDeleteData` 이미지 삭제 성공
   */
  imageDelete = (data: ImageDeletePayload, params: RequestParams = {}) =>
    this.http.request<ImageDeleteData, any>({
      path: `/breads/image`,
      method: "DELETE",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
