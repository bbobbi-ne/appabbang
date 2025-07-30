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
  CommonCodeCreateData,
  CommonCodeCreatePayload,
  CommonCodeDeleteData,
  CommonCodeDetailData,
  CommonCodeListData,
  CommonCodeUpdateData,
  CommonCodeUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class CommonCode<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 모든 공통 코드 목록을 조회합니다. 최대 1000개까지 조회 가능합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags CommonCodes
   * @name CommonCodeList
   * @summary 공통 코드 목록 조회
   * @request GET:/common-code
   * @response `200` `CommonCodeListData` 공통 코드 목록 조회 성공
   */
  commonCodeList = (params: RequestParams = {}) =>
    this.http.request<CommonCodeListData, any>({
      path: `/common-code`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 공통 코드를 생성합니다. (권한: 관리자만)
   *
   * @tags CommonCodes
   * @name CommonCodeCreate
   * @summary 공통 코드 생성
   * @request POST:/common-code
   * @secure
   * @response `201` `CommonCodeCreateData` 공통 코드 생성 성공
   */
  commonCodeCreate = (
    data: CommonCodeCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<CommonCodeCreateData, any>({
      path: `/common-code`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 그룹의 공통 코드만 조회합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags CommonCodes
   * @name CommonCodeDetail
   * @summary 공통 코드 그룹별 조회
   * @request GET:/common-code/{groupName}
   * @response `200` `CommonCodeDetailData` 공통 코드 그룹별 조회 성공
   */
  commonCodeDetail = (
    groupName:
      | "user_role"
      | "bread_status"
      | "material_type"
      | "order_status"
      | "purchase_status"
      | "delivery_type"
      | "image_target_type"
      | "discount_type"
      | "provider_type"
      | "bank_code",
    params: RequestParams = {},
  ) =>
    this.http.request<CommonCodeDetailData, any>({
      path: `/common-code/${groupName}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description 기존 공통 코드의 정보를 수정합니다. (권한: 관리자만)
   *
   * @tags CommonCodes
   * @name CommonCodeUpdate
   * @summary 공통 코드 수정
   * @request PUT:/common-code/{no}
   * @secure
   * @response `200` `CommonCodeUpdateData` 공통 코드 수정 성공
   */
  commonCodeUpdate = (
    no: number,
    data: CommonCodeUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<CommonCodeUpdateData, any>({
      path: `/common-code/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 공통 코드를 삭제합니다. (권한: 관리자만)
   *
   * @tags CommonCodes
   * @name CommonCodeDelete
   * @summary 공통 코드 삭제
   * @request DELETE:/common-code/{no}
   * @secure
   * @response `204` `CommonCodeDeleteData` 공통 코드 삭제 성공
   */
  commonCodeDelete = (no: number, params: RequestParams = {}) =>
    this.http.request<CommonCodeDeleteData, any>({
      path: `/common-code/${no}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
