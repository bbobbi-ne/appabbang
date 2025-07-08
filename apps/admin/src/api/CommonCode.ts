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
  CommonCodeDeleteError,
  CommonCodeDetailData,
  CommonCodeDetailError,
  CommonCodeListData,
  CommonCodeListError,
  CommonCodeUpdateData,
  CommonCodeUpdateError,
  CommonCodeUpdatePayload,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class CommonCode<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * @description 모든 공통 코드 목록을 조회합니다. 최대 1000개까지 조회 가능합니다.
 *
 * @tags Common Code
 * @name CommonCodeList
 * @summary 공통 코드 목록 조회
 * @request GET:/common-code
 * @response `200` `CommonCodeListData` 공통 코드 목록 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  commonCodeList = (params: RequestParams = {}) =>
    this.request<CommonCodeListData, CommonCodeListError>({
      path: `/common-code`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description 새로운 공통 코드를 생성합니다.
   *
   * @tags Common Code
   * @name CommonCodeCreate
   * @summary 공통 코드 생성 (관리자 전용)
   * @request POST:/common-code
   * @secure
   * @response `201` `CommonCodeCreateData` 공통 코드 생성 성공
   * @response `401` `void` 인증 실패
   */
  commonCodeCreate = (data: CommonCodeCreatePayload, params: RequestParams = {}) =>
    this.request<CommonCodeCreateData, void>({
      path: `/common-code`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
 * @description 특정 그룹의 공통 코드만 조회합니다.
 *
 * @tags Common Code
 * @name CommonCodeDetail
 * @summary 공통 코드 그룹별 조회
 * @request GET:/common-code/{groupName}
 * @response `200` `CommonCodeDetailData` 공통 코드 그룹별 조회 성공
 * @response `400` `{
  \** @example "'INVALID_GROUP'은(는) 유효하지 않은 코드 그룹입니다. (그룹명: bread_status, user_role, material_type, order_status, purchase_status, delivery_type)" *\
    message?: string,
    details?: {
  \** @example "INVALID_GROUP" *\
    invalidGroupName?: string,
  \** @example ["bread_status","user_role","delivery_type"] *\
    validGroupNames?: (string)[],

},

}` 유효하지 않은 코드 그룹명
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  commonCodeDetail = (groupName: string, params: RequestParams = {}) =>
    this.request<CommonCodeDetailData, CommonCodeDetailError>({
      path: `/common-code/${groupName}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 기존 공통 코드의 정보를 수정합니다.
 *
 * @tags Common Code
 * @name CommonCodeUpdate
 * @summary 공통 코드 수정 (관리자 전용)
 * @request PUT:/common-code/{no}
 * @secure
 * @response `200` `CommonCodeUpdateData` 공통 코드 수정 성공
 * @response `400` `{
  \** @example "no 는 필수입니다" *\
    message?: string,

}` 잘못된 요청 (번호 누락)
 * @response `401` `void` 인증 실패
 */
  commonCodeUpdate = (no: number, data: CommonCodeUpdatePayload, params: RequestParams = {}) =>
    this.request<CommonCodeUpdateData, CommonCodeUpdateError>({
      path: `/common-code/${no}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
 * @description 특정 공통 코드를 삭제합니다.
 *
 * @tags Common Code
 * @name CommonCodeDelete
 * @summary 공통 코드 삭제 (관리자 전용)
 * @request DELETE:/common-code/{no}
 * @secure
 * @response `204` `CommonCodeDeleteData` 공통 코드 삭제 성공
 * @response `400` `{
  \** @example "no 는 필수입니다" *\
    message?: string,

}` 잘못된 요청 (번호 누락)
 * @response `401` `void` 인증 실패
 */
  commonCodeDelete = (no: number, params: RequestParams = {}) =>
    this.request<CommonCodeDeleteData, CommonCodeDeleteError>({
      path: `/common-code/${no}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}
