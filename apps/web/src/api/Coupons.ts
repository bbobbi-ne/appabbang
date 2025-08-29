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
  CouponsCreateData,
  CouponsCreatePayload,
  CouponsDeleteData,
  CouponsDetailData,
  CouponsListResult,
  CouponsUpdateData,
  CouponsUpdatePayload,
  IssueCreateData,
  IssueCreateError,
  IssueCreatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Coupons<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 모든 쿠폰 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags Coupons
   * @name CouponsList
   * @summary 쿠폰 목록 조회
   * @request GET:/coupons
   * @secure
   * @response `200` `CouponsListResult` 쿠폰 목록 조회 성공
   */
  couponsList = (params: RequestParams = {}) =>
    this.http.request<CouponsListResult, any>({
      path: `/coupons`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 쿠폰을 생성합니다. (권한: 관리자만)
   *
   * @tags Coupons
   * @name CouponsCreate
   * @summary 쿠폰 생성
   * @request POST:/coupons
   * @secure
   * @response `201` `CouponsCreateData` 쿠폰 생성 성공
   */
  couponsCreate = (data: CouponsCreatePayload, params: RequestParams = {}) =>
    this.http.request<CouponsCreateData, any>({
      path: `/coupons`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 쿠폰의 상세 정보를 조회합니다. (권한: 관리자만)
   *
   * @tags Coupons
   * @name CouponsDetail
   * @summary 쿠폰 상세 조회
   * @request GET:/coupons/{no}
   * @secure
   * @response `200` `CouponsDetailData` 쿠폰 상세 조회 성공
   */
  couponsDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<CouponsDetailData, any>({
      path: `/coupons/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 쿠폰의 정보를 수정합니다. 첫 로그인 쿠폰이거나 이미 발급된 쿠폰이 있을 경우 이름만 수정 가능합니다. (권한: 관리자만)
   *
   * @tags Coupons
   * @name CouponsUpdate
   * @summary 쿠폰 수정
   * @request PUT:/coupons/{no}
   * @secure
   * @response `200` `CouponsUpdateData` 쿠폰 수정 성공
   */
  couponsUpdate = (
    no: number,
    data: CouponsUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<CouponsUpdateData, any>({
      path: `/coupons/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 쿠폰을 삭제합니다. 첫 로그인 쿠폰(no=1)이나 고객에게 발급된 쿠폰은 삭제할 수 없습니다. (권한: 관리자만)
   *
   * @tags Coupons
   * @name CouponsDelete
   * @summary 쿠폰 삭제
   * @request DELETE:/coupons/{no}
   * @secure
   * @response `204` `CouponsDeleteData` 쿠폰 삭제 성공
   */
  couponsDelete = (no: number, params: RequestParams = {}) =>
    this.http.request<CouponsDeleteData, any>({
      path: `/coupons/${no}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
 * @description 특정 쿠폰을 선택된 고객들에게 발급합니다. (권한: 관리자만)
 *
 * @tags Coupons
 * @name IssueCreate
 * @summary 쿠폰 발급
 * @request POST:/coupons/{no}/issue
 * @secure
 * @response `200` `IssueCreateData` 쿠폰 발급 성공
 * @response `400` `{
  \**
   * 에러 메시지
   * @example "고객번호는 필수입니다"
   *\
    error?: string,

}` 잘못된 요청 (고객 번호가 누락되었거나 잘못된 형식)
 * @response `404` `void` 쿠폰을 찾을 수 없음
 */
  issueCreate = (
    no: number,
    data: IssueCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<IssueCreateData, IssueCreateError>({
      path: `/coupons/${no}/issue`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
