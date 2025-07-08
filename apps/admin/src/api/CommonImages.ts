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
  CommonImagesListData,
  CommonImagesListError,
  DeleteDeleteData,
  DeleteDeleteError,
  DeleteDeletePayload,
  UploadCreateData,
  UploadCreateError,
  UploadCreatePayload,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class CommonImages<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * @description Cloudinary에 업로드된 모든 이미지 목록을 조회합니다.
 *
 * @tags Common Images
 * @name CommonImagesList
 * @summary 공통 이미지 목록 조회
 * @request GET:/common-images
 * @response `200` `CommonImagesListData` 이미지 목록 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  commonImagesList = (params: RequestParams = {}) =>
    this.request<CommonImagesListData, CommonImagesListError>({
      path: `/common-images`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description Cloudinary에 이미지를 업로드합니다.
 *
 * @tags Common Images
 * @name UploadCreate
 * @summary 공통 이미지 업로드
 * @request POST:/common-images/upload
 * @response `201` `UploadCreateData` 이미지 업로드 성공
 * @response `400` `{
  \** @example "이미지를 업로드해주세요." *\
    message?: string,

}` 이미지 파일이 없음
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  uploadCreate = (data: UploadCreatePayload, params: RequestParams = {}) =>
    this.request<UploadCreateData, UploadCreateError>({
      path: `/common-images/upload`,
      method: 'POST',
      body: data,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
 * @description Cloudinary에서 이미지를 삭제합니다.
 *
 * @tags Common Images
 * @name DeleteDelete
 * @summary 공통 이미지 삭제
 * @request DELETE:/common-images/delete
 * @response `204` `DeleteDeleteData` 이미지 삭제 성공
 * @response `400` `{
  \** @example "publicIds 배열이 필요합니다." *\
    message?: string,

}` 잘못된 요청 (publicIds 배열이 없음)
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  deleteDelete = (data: DeleteDeletePayload, params: RequestParams = {}) =>
    this.request<DeleteDeleteData, DeleteDeleteError>({
      path: `/common-images/delete`,
      method: 'DELETE',
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
