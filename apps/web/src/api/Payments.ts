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
  PaidUpdateData,
  PaidUpdatePayload,
  PaymentsDetailData,
  PaymentsListData,
  RefundUpdateData,
  RefundUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Payments<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 모든 결제 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags Payments
   * @name PaymentsList
   * @summary 결제 목록 조회
   * @request GET:/payments
   * @secure
   * @response `200` `PaymentsListData` 결제 목록 조회 성공
   */
  paymentsList = (params: RequestParams = {}) =>
    this.http.request<PaymentsListData, any>({
      path: `/payments`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 결제의 상세 정보를 조회합니다. (권한: 관리자만)
   *
   * @tags Payments
   * @name PaymentsDetail
   * @summary 결제 상세 조회
   * @request GET:/payments/{no}
   * @secure
   * @response `200` `PaymentsDetailData` 결제 상세 조회 성공
   */
  paymentsDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<PaymentsDetailData, any>({
      path: `/payments/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 결제의 입금 확인 상태를 변경합니다. (권한: 관리자만)
   *
   * @tags Payments
   * @name PaidUpdate
   * @summary 결제 입금 확인 변경
   * @request PUT:/payments/{no}/paid
   * @secure
   * @response `200` `PaidUpdateData` 결제 입금 확인 완료
   */
  paidUpdate = (
    no: number,
    data: PaidUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<PaidUpdateData, any>({
      path: `/payments/${no}/paid`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 결제의 환불 확인 상태를 변경합니다. (권한: 관리자만)
   *
   * @tags Payments
   * @name RefundUpdate
   * @summary 결제 환불 확인 변경
   * @request PUT:/payments/{no}/refund
   * @secure
   * @response `200` `RefundUpdateData` 결제 환불 취소 완료
   */
  refundUpdate = (
    no: number,
    data: RefundUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<RefundUpdateData, any>({
      path: `/payments/${no}/refund`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
