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
  PutMy2Data,
  PutMy2Payload,
  PutMyData,
  PutMyPayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class My<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 현재 로그인한 고객의 정보를 조회합니다. (권한: 고객만)
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
   * @name PutMy
   * @summary 내 정보 수정
   * @request PUT:/my
   * @secure
   * @response `200` `PutMyData` 내 정보 수정 성공
   */
  putMy = (data: PutMyPayload, params: RequestParams = {}) =>
    this.http.request<PutMyData, any>({
      path: `/my`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 로그인한 고객의 비밀번호를 변경합니다. (권한: 고객만)
   *
   * @tags My
   * @name PutMy2
   * @summary 비밀번호 변경
   * @request PUT:/my/pw
   * @originalName putMy
   * @duplicate
   * @secure
   * @response `200` `PutMy2Data` 비밀번호 변경 성공
   */
  putMy2 = (data: PutMy2Payload, params: RequestParams = {}) =>
    this.http.request<PutMy2Data, any>({
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
}
