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
  AddressesCreateData,
  AddressesCreatePayload,
  AddressesDeleteData,
  AddressesDetailData,
  AddressesListData,
  AddressesUpdateData,
  AddressesUpdatePayload,
  GetMyData,
  OrdersAddressListData,
  OrdersAddressUpdateData,
  OrdersAddressUpdatePayload,
  OrdersCancelPartialUpdateData,
  OrdersCancelPartialUpdatePayload,
  OrdersDeliveryListData,
  OrdersDetailResult,
  OrdersListResult,
  SummaryListData,
  UpdateMyPasswordData,
  UpdateMyPasswordPayload,
  UpdateMyProfileData,
  UpdateMyProfilePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class My<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 현재 로그인한 고객의 상세정보를 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name GetMy
   * @summary 내 정보 조회
   * @request GET:/my
   * @secure
   * @response `200` `GetMyData` 내 정보 조회 성공
   */
  getMy = (params: RequestParams = {}) =>
    this.http.request<GetMyData, any>({
      path: `/my`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 고객의 정보를 수정합니다. (권한: 고객만)
   *
   * @tags My
   * @name UpdateMyProfile
   * @summary 내 정보 수정
   * @request PUT:/my
   * @secure
   * @response `200` `UpdateMyProfileData` 내 정보 수정 성공
   */
  updateMyProfile = (
    data: UpdateMyProfilePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<UpdateMyProfileData, any>({
      path: `/my`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 고객의 요약 정보를 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name SummaryList
   * @summary 내 정보 조회
   * @request GET:/my/summary
   * @secure
   * @response `200` `SummaryListData` 내 정보 조회 성공
   */
  summaryList = (params: RequestParams = {}) =>
    this.http.request<SummaryListData, any>({
      path: `/my/summary`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 고객의 비밀번호를 변경합니다. (권한: 고객만)
   *
   * @tags My
   * @name UpdateMyPassword
   * @summary 비밀번호 변경
   * @request PUT:/my/pw
   * @secure
   * @response `200` `UpdateMyPasswordData` 비밀번호 변경 성공
   */
  updateMyPassword = (
    data: UpdateMyPasswordPayload,
    params: RequestParams = {},
  ) =>
    this.http.request<UpdateMyPasswordData, any>({
      path: `/my/pw`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 배송지 목록을 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name AddressesList
   * @summary 배송지 목록 조회
   * @request GET:/my/addresses
   * @secure
   * @response `200` `AddressesListData` 배송지 목록 조회 성공
   */
  addressesList = (params: RequestParams = {}) =>
    this.http.request<AddressesListData, any>({
      path: `/my/addresses`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 배송지를 등록합니다. (권한: 고객만)
   *
   * @tags My
   * @name AddressesCreate
   * @summary 배송지 등록
   * @request POST:/my/addresses
   * @secure
   * @response `201` `AddressesCreateData` 배송지 등록 성공
   */
  addressesCreate = (
    data: AddressesCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<AddressesCreateData, any>({
      path: `/my/addresses`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 특정 배송지의 상세 정보를 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name AddressesDetail
   * @summary 배송지 상세 조회
   * @request GET:/my/addresses/{no}
   * @secure
   * @response `200` `AddressesDetailData` 배송지 상세 조회 성공
   */
  addressesDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<AddressesDetailData, any>({
      path: `/my/addresses/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 배송지를 수정합니다. (권한: 고객만)
   *
   * @tags My
   * @name AddressesUpdate
   * @summary 배송지 수정
   * @request PUT:/my/addresses/{no}
   * @secure
   * @response `200` `AddressesUpdateData` 배송지 수정 성공
   */
  addressesUpdate = (
    no: number,
    data: AddressesUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<AddressesUpdateData, any>({
      path: `/my/addresses/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 배송지를 삭제합니다. (권한: 고객만)
   *
   * @tags My
   * @name AddressesDelete
   * @summary 배송지 삭제
   * @request DELETE:/my/addresses/{no}
   * @secure
   * @response `204` `AddressesDeleteData` 배송지 삭제 성공
   */
  addressesDelete = (no: number, params: RequestParams = {}) =>
    this.http.request<AddressesDeleteData, any>({
      path: `/my/addresses/${no}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description 로그인한 고객의 주문 목록을 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name OrdersList
   * @summary 내 주문 목록 조회
   * @request GET:/my/orders
   * @secure
   * @response `200` `OrdersListResult` 주문 목록 조회 성공
   */
  ordersList = (params: RequestParams = {}) =>
    this.http.request<OrdersListResult, any>({
      path: `/my/orders`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문의 상세 정보를 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name OrdersDetail
   * @summary 내 주문 상세 조회
   * @request GET:/my/orders/{no}
   * @secure
   * @response `200` `OrdersDetailResult` 주문 상세 조회 성공
   */
  ordersDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<OrdersDetailResult, any>({
      path: `/my/orders/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 주문을 취소합니다. (권한: 고객만)
   *
   * @tags My
   * @name OrdersCancelPartialUpdate
   * @summary 내 주문 취소
   * @request PATCH:/my/orders/{no}/cancel
   * @secure
   * @response `200` `OrdersCancelPartialUpdateData` 주문 취소 성공
   */
  ordersCancelPartialUpdate = (
    no: number,
    data: OrdersCancelPartialUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<OrdersCancelPartialUpdateData, any>({
      path: `/my/orders/${no}/cancel`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 주문 배송 정보를 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name OrdersDeliveryList
   * @summary 내 주문 배송(수령) 조회
   * @request GET:/my/orders/{no}/delivery
   * @secure
   * @response `200` `OrdersDeliveryListData` 주문 배송 조회 성공
   */
  ordersDeliveryList = (no: number, params: RequestParams = {}) =>
    this.http.request<OrdersDeliveryListData, any>({
      path: `/my/orders/${no}/delivery`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문의 배송지 정보를 조회합니다. (권한: 고객만)
   *
   * @tags My
   * @name OrdersAddressList
   * @summary 주문내역의 배송지 조회
   * @request GET:/my/orders/{no}/address
   * @secure
   * @response `200` `OrdersAddressListData` 배송지 조회 성공
   */
  ordersAddressList = (no: number, params: RequestParams = {}) =>
    this.http.request<OrdersAddressListData, any>({
      path: `/my/orders/${no}/address`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문의 배송지를 수정합니다. (권한: 고객만)
   *
   * @tags My
   * @name OrdersAddressUpdate
   * @summary 주문내역의 배송지 수정
   * @request PUT:/my/orders/{no}/address
   * @secure
   * @response `200` `OrdersAddressUpdateData` 배송지 수정 성공
   */
  ordersAddressUpdate = (
    no: number,
    data: OrdersAddressUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<OrdersAddressUpdateData, any>({
      path: `/my/orders/${no}/address`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
