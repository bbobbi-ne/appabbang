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
  GetSampleData,
  GetSampleError,
  SampleCreateData,
  SampleCreateError,
  SampleCreatePayload,
  SampleDeleteData,
  SampleDeleteError,
  SampleDetailData,
  SampleDetailError,
  SampleListData,
  SampleListError,
  SampleUpdateData,
  SampleUpdateError,
  SampleUpdatePayload,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class Sample<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * @description 샘플 데이터 목록을 조회합니다.
 *
 * @tags Sample
 * @name SampleList
 * @summary 샘플 목록 조회
 * @request GET:/sample
 * @response `200` `SampleListData` 샘플 목록 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  sampleList = (params: RequestParams = {}) =>
    this.request<SampleListData, SampleListError>({
      path: `/sample`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 새로운 샘플 데이터를 생성합니다.
 *
 * @tags Sample
 * @name SampleCreate
 * @summary 샘플 생성
 * @request POST:/sample
 * @response `201` `SampleCreateData` 샘플 생성 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  sampleCreate = (data: SampleCreatePayload, params: RequestParams = {}) =>
    this.request<SampleCreateData, SampleCreateError>({
      path: `/sample`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description 전체 샘플 데이터 목록을 조회합니다.
 *
 * @tags Sample
 * @name GetSample
 * @summary 전체 샘플 목록 조회
 * @request GET:/sample/all
 * @response `200` `GetSampleData` 전체 샘플 목록 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  getSample = (params: RequestParams = {}) =>
    this.request<GetSampleData, GetSampleError>({
      path: `/sample/all`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 특정 샘플 데이터의 상세 정보를 조회합니다.
 *
 * @tags Sample
 * @name SampleDetail
 * @summary 샘플 상세 조회
 * @request GET:/sample/{no}
 * @response `200` `SampleDetailData` 샘플 상세 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  sampleDetail = (no: number, params: RequestParams = {}) =>
    this.request<SampleDetailData, SampleDetailError>({
      path: `/sample/${no}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 특정 샘플 데이터를 수정합니다.
 *
 * @tags Sample
 * @name SampleUpdate
 * @summary 샘플 수정
 * @request PUT:/sample/{no}
 * @response `200` `SampleUpdateData` 샘플 수정 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  sampleUpdate = (no: number, data: SampleUpdatePayload, params: RequestParams = {}) =>
    this.request<SampleUpdateData, SampleUpdateError>({
      path: `/sample/${no}`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description 특정 샘플 데이터를 삭제합니다.
 *
 * @tags Sample
 * @name SampleDelete
 * @summary 샘플 삭제
 * @request DELETE:/sample/{no}
 * @response `204` `SampleDeleteData` 샘플 삭제 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  sampleDelete = (no: number, params: RequestParams = {}) =>
    this.request<SampleDeleteData, SampleDeleteError>({
      path: `/sample/${no}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
}
