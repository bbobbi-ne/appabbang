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
  AddressCreateData,
  AddressCreatePayload,
  AddressDeleteData,
  AddressDetailData,
  AddressListData,
  AddressUpdateData,
  AddressUpdatePayload,
  CustomersCreateData,
  CustomersCreatePayload,
  CustomersDeleteData,
  CustomersDetailData,
  CustomersListData,
  CustomersUpdateData,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Customers<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 모든 고객 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name CustomersList
   * @summary 고객 목록 조회
   * @request GET:/customers
   * @secure
   * @response `200` `CustomersListData` 고객 목록 조회 성공
   */
  customersList = (params: RequestParams = {}) =>
    this.http.request<CustomersListData, any>({
      path: `/customers`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 새로운 고객을 생성합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags Customers
   * @name CustomersCreate
   * @summary 고객 생성 (회원가입)
   * @request POST:/customers
   * @response `201` `CustomersCreateData` 고객 생성 성공
   */
  customersCreate = (
    data: CustomersCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<CustomersCreateData, any>({
      path: `/customers`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 고객의 상세 정보를 조회합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name CustomersDetail
   * @summary 고객 상세 조회
   * @request GET:/customers/{no}
   * @secure
   * @response `200` `CustomersDetailData` 고객 상세 조회 성공
   */
  customersDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<CustomersDetailData, any>({
      path: `/customers/${no}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 기존 고객의 정보를 수정합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name CustomersUpdate
   * @summary 고객 수정
   * @request PUT:/customers/{no}
   * @secure
   * @response `200` `CustomersUpdateData` 고객 수정 성공
   */
  customersUpdate = (no: number, params: RequestParams = {}) =>
    this.http.request<CustomersUpdateData, any>({
      path: `/customers/${no}`,
      method: "PUT",
      secure: true,
      ...params,
    });
  /**
   * @description 특정 고객을 삭제합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name CustomersDelete
   * @summary 고객 삭제
   * @request DELETE:/customers/{no}
   * @secure
   * @response `204` `CustomersDeleteData` 고객 삭제 성공
   */
  customersDelete = (no: number, params: RequestParams = {}) =>
    this.http.request<CustomersDeleteData, any>({
      path: `/customers/${no}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 특정 고객의 주소 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name AddressList
   * @summary 고객 주소 목록 조회
   * @request GET:/customers/{no}/address
   * @secure
   * @response `200` `AddressListData` 고객 주소 목록 조회 성공
   */
  addressList = (no: number, params: RequestParams = {}) =>
    this.http.request<AddressListData, any>({
      path: `/customers/${no}/address`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 고객의 새로운 주소를 생성합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name AddressCreate
   * @summary 고객 주소 생성
   * @request POST:/customers/{no}/address
   * @secure
   * @response `201` `AddressCreateData` 고객 주소 생성 성공
   */
  addressCreate = (
    no: number,
    data: AddressCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<AddressCreateData, any>({
      path: `/customers/${no}/address`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 고객의 특정 주소 상세 정보를 조회합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name AddressDetail
   * @summary 고객 주소 상세 조회
   * @request GET:/customers/{no}/address/{addressNo}
   * @secure
   * @response `200` `AddressDetailData` 고객 주소 상세 조회 성공
   */
  addressDetail = (no: number, addressNo: number, params: RequestParams = {}) =>
    this.http.request<AddressDetailData, any>({
      path: `/customers/${no}/address/${addressNo}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 고객의 특정 주소 정보를 수정합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name AddressUpdate
   * @summary 고객 주소 수정
   * @request PUT:/customers/{no}/address/{addressNo}
   * @secure
   * @response `200` `AddressUpdateData` 고객 주소 수정 성공
   */
  addressUpdate = (
    no: number,
    addressNo: number,
    data: AddressUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<AddressUpdateData, any>({
      path: `/customers/${no}/address/${addressNo}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 고객의 특정 주소를 삭제합니다. (권한: 관리자만)
   *
   * @tags Customers
   * @name AddressDelete
   * @summary 고객 주소 삭제
   * @request DELETE:/customers/{no}/address/{addressNo}
   * @secure
   * @response `204` `AddressDeleteData` 고객 주소 삭제 성공
   */
  addressDelete = (no: number, addressNo: number, params: RequestParams = {}) =>
    this.http.request<AddressDeleteData, any>({
      path: `/customers/${no}/address/${addressNo}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
