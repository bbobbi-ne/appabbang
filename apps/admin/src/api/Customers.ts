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
  CheckIdCreateData,
  CheckIdCreatePayload,
  ComepareCodeCreateData,
  ComepareCodeCreatePayload,
  CustomersCreateData,
  CustomersCreatePayload,
  CustomersDeleteData,
  CustomersDetailData,
  CustomersListData,
  CustomersUpdateData,
  EmailCreateData,
  EmailCreatePayload,
  IdEmailCreateData,
  IdEmailCreatePayload,
  PostCustomersData,
  PostCustomersPayload,
  SendEmailCreateData,
  SendEmailCreatePayload,
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
      format: "json",
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
   * @description 요청한 이메일로 서버에서 만든 인증번호를 전달합니다. (권한: 없음 - 누구나 접근가능)
   *
   * @tags Customers
   * @name SendEmailCreate
   * @summary 이메일 인증번호 전송
   * @request POST:/customers/send-email
   * @response `200` `SendEmailCreateData` 이메일 전송 성공
   */
  sendEmailCreate = (
    data: SendEmailCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<SendEmailCreateData, any>({
      path: `/customers/send-email`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 요청한 이메일을 조회합니다. (권한: 없음 - 누구나 접근가능)
   *
   * @tags Customers
   * @name EmailCreate
   * @summary 고객 이메일 조회
   * @request POST:/customers/email
   * @response `200` `EmailCreateData` 고객 이메일 조회 성공
   */
  emailCreate = (data: EmailCreatePayload, params: RequestParams = {}) =>
    this.http.request<EmailCreateData, any>({
      path: `/customers/email`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Customers
   * @name PostCustomers
   * @summary 입력한 이메일로 아이디를 조회합니다. (권한: 없음 - 누구나 접근가능)
   * @request POST:/customers/id
   * @response `200` `PostCustomersData` 고객의 이메일로 아이디 조회 성공
   */
  postCustomers = (data: PostCustomersPayload, params: RequestParams = {}) =>
    this.http.request<PostCustomersData, any>({
      path: `/customers/id`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Customers
   * @name IdEmailCreate
   * @summary 등록된 아이디와 이메일을 조회합니다. (권한: 없음 - 누구나 접근가능)
   * @request POST:/customers/id-email
   * @response `200` `IdEmailCreateData` 아이디와 이메일 조회 성공
   */
  idEmailCreate = (data: IdEmailCreatePayload, params: RequestParams = {}) =>
    this.http.request<IdEmailCreateData, any>({
      path: `/customers/id-email`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Customers
   * @name ComepareCodeCreate
   * @summary 입력한 인증코드와 해싱된 인증코드를 비교합니다. (권한: 없음 - 누구나 접근가능)
   * @request POST:/customers/comepare-code
   * @response `200` `ComepareCodeCreateData` 입력한 인증코드와 해싱된 인증코드 비교 성공
   */
  comepareCodeCreate = (
    data: ComepareCodeCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<ComepareCodeCreateData, any>({
      path: `/customers/comepare-code`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Customers
   * @name CheckIdCreate
   * @summary 중복체크를 위한 아이디를 조회합니다. (권한: 없음 - 누구나 접근가능)
   * @request POST:/customers/check/id
   * @response `200` `CheckIdCreateData` 아이디 조회 성공
   */
  checkIdCreate = (data: CheckIdCreatePayload, params: RequestParams = {}) =>
    this.http.request<CheckIdCreateData, any>({
      path: `/customers/check/id`,
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
