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
  AddressCreateError,
  AddressCreatePayload,
  AddressDeleteData,
  AddressDeleteError,
  AddressDetailData,
  AddressDetailError,
  AddressListData,
  AddressUpdateData,
  AddressUpdateError,
  AddressUpdatePayload,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Address<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 모든 주소 목록을 조회합니다.
   *
   * @tags Address
   * @name AddressList
   * @summary 주소 목록 조회
   * @request GET:/address
   * @response `200` `AddressListData` 주소 목록 조회 성공
   * @response `500` `void` 서버 오류
   */
  addressList = (params: RequestParams = {}) =>
    this.request<AddressListData, void>({
      path: `/address`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 새로운 주소를 생성합니다. 고객이 있어야 주소를 생성할 수 있습니다.
 *
 * @tags Address
 * @name AddressCreate
 * @summary 주소 생성
 * @request POST:/address
 * @response `201` `AddressCreateData` 주소 생성 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  addressCreate = (data: AddressCreatePayload, params: RequestParams = {}) =>
    this.request<AddressCreateData, AddressCreateError>({
      path: `/address`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description 특정 주소의 상세 정보를 조회합니다.
 *
 * @tags Address
 * @name AddressDetail
 * @summary 주소 상세 조회
 * @request GET:/address/{no}
 * @response `200` `AddressDetailData` 주소 상세 조회 성공
 * @response `400` `{
  \** @example "Address no is required" *\
    message?: string,

}` 잘못된 요청 (주소 번호 누락)
 * @response `404` `{
  \** @example "Address not found" *\
    message?: string,

}` 주소를 찾을 수 없음
 * @response `500` `void` 서버 오류
 */
  addressDetail = (no: number, params: RequestParams = {}) =>
    this.request<AddressDetailData, AddressDetailError>({
      path: `/address/${no}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 기존 주소의 정보를 수정합니다. (TODO- 본인만 수정 가능하도록 개선 예정)
 *
 * @tags Address
 * @name AddressUpdate
 * @summary 주소 수정
 * @request PUT:/address/{no}
 * @response `200` `AddressUpdateData` 주소 수정 성공
 * @response `400` `{
  \** @example "Address no is required" *\
    message?: string,

}` 잘못된 요청 (주소 번호 누락)
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  addressUpdate = (no: number, data: AddressUpdatePayload, params: RequestParams = {}) =>
    this.request<AddressUpdateData, AddressUpdateError>({
      path: `/address/${no}`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description 특정 주소를 삭제합니다. (TODO- 본인만 삭제 가능하도록 개선 예정)
 *
 * @tags Address
 * @name AddressDelete
 * @summary 주소 삭제
 * @request DELETE:/address/{no}
 * @response `204` `AddressDeleteData` 주소 삭제 성공
 * @response `400` `{
  \** @example "Address no is required" *\
    message?: string,

}` 잘못된 요청 (주소 번호 누락)
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  addressDelete = (no: number, params: RequestParams = {}) =>
    this.request<AddressDeleteData, AddressDeleteError>({
      path: `/address/${no}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
}
