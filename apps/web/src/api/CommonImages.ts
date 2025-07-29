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
  DeleteDeleteData,
  DeleteDeletePayload,
  UploadCreateData,
  UploadCreatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class CommonImages<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Cloudinary에 업로드된 모든 이미지 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags CommonImages
   * @name CommonImagesList
   * @summary 공통 이미지 목록 조회
   * @request GET:/common-images
   * @secure
   * @response `200` `CommonImagesListData` 이미지 목록 조회 성공
   */
  commonImagesList = (params: RequestParams = {}) =>
    this.http.request<CommonImagesListData, any>({
      path: `/common-images`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Cloudinary에 이미지를 업로드합니다. (권한: 관리자만)
   *
   * @tags CommonImages
   * @name UploadCreate
   * @summary 공통 이미지 업로드
   * @request POST:/common-images/upload
   * @secure
   * @response `201` `UploadCreateData` 이미지 업로드 성공
   */
  uploadCreate = (data: UploadCreatePayload, params: RequestParams = {}) =>
    this.http.request<UploadCreateData, any>({
      path: `/common-images/upload`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * @description Cloudinary에서 이미지를 삭제합니다. (권한: 관리자만)
   *
   * @tags CommonImages
   * @name DeleteDelete
   * @summary 공통 이미지 삭제
   * @request DELETE:/common-images/delete
   * @secure
   * @response `204` `DeleteDeleteData` 이미지 삭제 성공
   */
  deleteDelete = (data: DeleteDeletePayload, params: RequestParams = {}) =>
    this.http.request<DeleteDeleteData, any>({
      path: `/common-images/delete`,
      method: "DELETE",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
