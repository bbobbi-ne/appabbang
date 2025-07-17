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
  ActiveListData,
  DeliveryMethodsCreateData,
  DeliveryMethodsCreatePayload,
  DeliveryMethodsDeleteData,
  DeliveryMethodsDetailData,
  DeliveryMethodsListData,
  DeliveryMethodsUpdateData,
  DeliveryMethodsUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class DeliveryMethods<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 배송 방법 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags DeliveryMethods
   * @name DeliveryMethodsList
   * @summary 배송 방법 목록 조회
   * @request GET:/delivery-methods
   * @secure
   * @response `200` `DeliveryMethodsListData` 배송 방법 목록 조회 성공
   */
  deliveryMethodsList = (params: RequestParams = {}) =>
    this.http.request<DeliveryMethodsListData, any>({
      path: `/delivery-methods`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 배송 방법을 생성합니다. (권한: 관리자만)
   *
   * @tags DeliveryMethods
   * @name DeliveryMethodsCreate
   * @summary 배송 방법 생성
   * @request POST:/delivery-methods
   * @secure
   * @response `201` `DeliveryMethodsCreateData` 배송 방법 생성 성공
   */
  deliveryMethodsCreate = (
    data: DeliveryMethodsCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<DeliveryMethodsCreateData, any>({
      path: `/delivery-methods`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 활성화된 배송 방법만 조회합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags DeliveryMethods
   * @name ActiveList
   * @summary 활성화된 배송 방법 목록 조회
   * @request GET:/delivery-methods/active
   * @response `200` `ActiveListData` 활성화된 배송 방법 목록 조회 성공
   */
  activeList = (params: RequestParams = {}) =>
    this.http.request<ActiveListData, any>({
      path: `/delivery-methods/active`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description 특정 배송 방법의 상세 정보를 조회합니다. (권한: 관리자만)
   *
   * @tags DeliveryMethods
   * @name DeliveryMethodsDetail
   * @summary 배송 방법 상세 조회
   * @request GET:/delivery-methods/{no}
   * @secure
   * @response `200` `DeliveryMethodsDetailData` 배송 방법 상세 조회 성공
   */
  deliveryMethodsDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<DeliveryMethodsDetailData, any>({
      path: `/delivery-methods/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 배송 방법의 정보를 수정합니다. (권한: 관리자만)
   *
   * @tags DeliveryMethods
   * @name DeliveryMethodsUpdate
   * @summary 배송 방법 수정
   * @request PUT:/delivery-methods/{no}
   * @secure
   * @response `200` `DeliveryMethodsUpdateData` 배송 방법 수정 성공
   */
  deliveryMethodsUpdate = (
    no: number,
    data: DeliveryMethodsUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<DeliveryMethodsUpdateData, any>({
      path: `/delivery-methods/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 배송 방법을 삭제합니다. (권한: 관리자만)
   *
   * @tags DeliveryMethods
   * @name DeliveryMethodsDelete
   * @summary 배송 방법 삭제
   * @request DELETE:/delivery-methods/{no}
   * @secure
   * @response `204` `DeliveryMethodsDeleteData` 배송 방법 삭제 성공
   */
  deliveryMethodsDelete = (no: number, params: RequestParams = {}) =>
    this.http.request<DeliveryMethodsDeleteData, any>({
      path: `/delivery-methods/${no}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
