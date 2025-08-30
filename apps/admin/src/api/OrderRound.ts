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
  CurrentListData,
  GetOrderRoundData,
  ImageDeleteBody,
  IsOpenListData,
  LatestListData,
  OpenDetailData,
  OrderRoundCreateData,
  OrderRoundCreatePayload,
  OrderRoundDetailData,
  OrderRoundListData,
  OrderRoundUpdateData,
  OrderRoundUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class OrderRound<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 모든 주문차수 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags OrderRound
   * @name OrderRoundList
   * @summary 주문차수 목록 조회
   * @request GET:/order-round
   * @secure
   * @response `200` `OrderRoundListData` 주문차수 목록 조회 성공
   */
  orderRoundList = (params: RequestParams = {}) =>
    this.http.request<OrderRoundListData, any>({
      path: `/order-round`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 새로운 주문차수를 등록합니다. 이미지 업로드가 선택적으로 가능합니다.
   *
   * @tags OrderRound
   * @name OrderRoundCreate
   * @summary 주문차수 등록
   * @request POST:/order-round
   * @secure
   * @response `201` `OrderRoundCreateData` 주문차수 등록 성공
   * @response `500` `void` 주문차수 등록 실패(등록과정 중 오류가 발생할 경우)
   */
  orderRoundCreate = (
    data: OrderRoundCreatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<OrderRoundCreateData, void>({
      path: `/order-round`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 최신 주문차수의 상세 정보를 조회합니다. 권한(선택적 로그인)
   *
   * @tags OrderRound
   * @name LatestList
   * @summary 최신 주문차수 조회
   * @request GET:/order-round/latest
   * @secure
   * @response `200` `LatestListData` 최신 주문차수 상세 조회 성공
   */
  latestList = (params: RequestParams = {}) =>
    this.http.request<LatestListData, any>({
      path: `/order-round/latest`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재일시에 진행되는 상세 정보를 조회합니다. 권한(선택적 로그인)
   *
   * @tags OrderRound
   * @name GetOrderRound
   * @summary 현재일시에 진행되는 주문차수 조회
   * @request GET:/order-round/now
   * @secure
   * @response `200` `GetOrderRoundData` 현재일시에 진행되는 주문차수 상세 조회 성공
   */
  getOrderRound = (params: RequestParams = {}) =>
    this.http.request<GetOrderRoundData, any>({
      path: `/order-round/now`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문차수의 상세 정보를 조회합니다. (권한: 선택적 로그인)
   *
   * @tags OrderRound
   * @name OrderRoundDetail
   * @summary 주문차수 상세 조회
   * @request GET:/order-round/{no}
   * @secure
   * @response `200` `OrderRoundDetailData` 주문차수 상세 조회 성공
   */
  orderRoundDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<OrderRoundDetailData, any>({
      path: `/order-round/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 주문차수의 정보를 수정합니다. 이미지 업로드가 선택적으로 가능합니다. (권한: 관리자만)
   *
   * @tags OrderRound
   * @name OrderRoundUpdate
   * @summary 주문차수 수정
   * @request PUT:/order-round/{no}
   * @secure
   * @response `200` `OrderRoundUpdateData` 주문차수 수정 성공
   * @response `500` `void` 주문차수 수정 실패(수정과정 중 오류가 발생함)
   */
  orderRoundUpdate = (
    no: number,
    data: OrderRoundUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<OrderRoundUpdateData, void>({
      path: `/order-round/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 현재 진행중인 주문차수 또는 다음 주문차수를 조회합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags OrderRound
   * @name CurrentList
   * @summary 현재 주문차수 조회 (now or next)
   * @request GET:/order-round/current
   * @response `200` `CurrentListData` 현재 주문차수 조회 성공
   */
  currentList = (params: RequestParams = {}) =>
    this.http.request<CurrentListData, any>({
      path: `/order-round/current`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문차수가 현재 오픈되어 있는지 확인하고 정보를 조회합니다.
   *
   * @tags OrderRound
   * @name OpenDetail
   * @summary 오픈된 특정 주문차수 조회
   * @request GET:/order-round/open/{no}
   * @secure
   * @response `200` `OpenDetailData` 오픈된 주문차수 조회 성공
   */
  openDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<OpenDetailData, any>({
      path: `/order-round/open/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문차수가 현재 진행중인지 확인합니다.
   *
   * @tags OrderRound
   * @name IsOpenList
   * @summary 주문차수가 진행중인지 확인
   * @request GET:/order-round/{no}/is-open
   * @secure
   * @response `200` `IsOpenListData` 주문차수 진행 상태 확인 성공
   */
  isOpenList = (no: number, params: RequestParams = {}) =>
    this.http.request<IsOpenListData, any>({
      path: `/order-round/${no}/is-open`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문차수의 이미지를 삭제합니다. (권한: 관리자만)
   *
   * @tags OrderRound
   * @name ImageDelete
   * @summary 주문차수 이미지 삭제
   * @request DELETE:/order-round/image
   * @secure
   */
  imageDelete = (data: ImageDeleteBody, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/order-round/image`,
      method: "DELETE",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
