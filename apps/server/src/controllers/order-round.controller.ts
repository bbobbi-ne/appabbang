import { Request, Response } from 'express';
import * as OrderRoundService from '@/services/order-round.service';
import { UploadedFile } from 'express-fileupload';
import { AppError } from '@/types';
import * as ImageService from '@/services/image.service';

/**
 * 주문차수 목록 조회
 */
export async function getList(_: Request, res: Response) {
  const list = await OrderRoundService.getOrderRoundList();
  res.status(200).json(list);
}

/**
 * 주문차수 상세 조회
 */
export async function getOne(req: Request, res: Response) {
  const no = Number(req.params.no);
  const orderRound = await OrderRoundService.getOrderRound(no);
  res.status(200).json(orderRound);
}

/**
 * 주문차수 등록
 * 주문차수 등록 시 현재 시작일자가 이 전에 등록된 주문차수 중 시작-종료일에 포함되어 있는지 확인한다. 만약 존재하면 등록불가.
 */
export async function create(req: Request, res: Response) {
  const model = {
    name: req.body.name,
    orderRoundBreads: JSON.parse(req.body.orderRoundBreads), // json parsing
    startedAt: new Date(req.body.startedAt),
    endedAt: new Date(req.body.endedAt),
    minOrderQty: Number(req.body.minOrderQty),
    maxOrderQty: Number(req.body.maxOrderQty),
  };
  const image = req.files?.image as UploadedFile[] | UploadedFile | undefined;
  let orderRound;

  // 시작일자가 포함된 주문차수 조회
  const ingOr = await OrderRoundService.selectStartedAtOrderRound(model.startedAt);
  if (ingOr)
    throw AppError.notFound(
      '주문차수를 등록할 수 없습니다. (이미 진행중인 주문차수가 존재합니다.)',
    );

  !image
    ? (orderRound = await OrderRoundService.createWithoutImage(model)) // 이미지 없는 주문차수 등록
    : (orderRound = await OrderRoundService.createWithImage(model, image)); // 이미지 있는 주문차수 등록

  'code' in orderRound
    ? res.status(500).json(orderRound) // error
    : res.status(201).json(orderRound); // success
}

/**
 * 주문차수 수정
 * 1) '주문차수' 항목은 수정할 수 없음.
 * 2) 주문차수-빵 테이블의 수정 프로세스는 삭제 -> 신규등록하는 로직
 * 3) 이미지 삭제는 별도의 API로 수행
 *
 * 주문차수 수정 시 현재 시작s일자가 이 전에 등록된 주문차수 중 시작-종료일에 포함되어 있는지 확인한다. 만약 존재하면 수정불가.
 */
export async function update(req: Request, res: Response) {
  const model = {
    no: Number(req.body.no),
    name: req.body.name,
    orderRoundBreads: JSON.parse(req.body.orderRoundBreads), // json parsing
    startedAt: new Date(req.body.startedAt),
    endedAt: new Date(req.body.endedAt),
    minOrderQty: Number(req.body.minOrderQty),
    maxOrderQty: Number(req.body.maxOrderQty),
  };
  const image = req.files?.image as UploadedFile[] | UploadedFile | undefined;
  let result;

  // 주문차수가 현재 존재하는지 확인
  const findRound = await OrderRoundService.getOrderRound(Number(model.no));
  if (!findRound)
    throw AppError.notFound('주문차수 정보를 찾을 수 없습니다. 관리자 확인이 필요합니다.');

  // 시작일자가 포함된 주문차수 조회
  const ingOr = await OrderRoundService.selectStartedAtOrderRoundUpdate(model.no, model.startedAt);
  if (ingOr)
    throw AppError.notFound(
      '주문차수를 수정할 수 없습니다. (이미 진행중인 주문차수가 존재합니다.)',
    );

  // 이미지 유무에 따른 주문차수 수정
  !image
    ? (result = await OrderRoundService.updateWithoutImage(model))
    : (result = await OrderRoundService.updateWithImage(model, image));

  'code' in result
    ? res.status(500).json(result) // error
    : res.status(200).json(result); // success
}

/**
 * 주문차수 내 이미지 별도 삭제 (완전삭제)
 */
export async function removeImage(req: Request, res: Response) {
  const { publicId } = req.body;

  await ImageService.remove([publicId]);
  res.sendStatus(204);
}

/**
 * 최신 주문차수 조회
 */
export async function getLatest(_: Request, res: Response) {
  const list = await OrderRoundService.getLatest();
  res.status(200).json(list);
}

/**
 * 현재일자에 진행중인 주문차수 조회
 */
export async function getNow(_: Request, res: Response) {
  const list = await OrderRoundService.getNow();
  res.status(200).json(list);
}
