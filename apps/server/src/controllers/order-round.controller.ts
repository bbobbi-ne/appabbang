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
 */
export async function create(req: Request, res: Response) {
  const { no, seq, name, breadNoList: breadNoListStr, startedAt, endedAt } = req.body;
  let breadNoListJson = JSON.parse(breadNoListStr); // json parsing
  // breadNoList에서 breadNo 값만 추출
  const breadNoList = breadNoListJson.map((bread: { breadNo: number }) => bread.breadNo);
  const model = { no, seq, name, breadNoList, startedAt, endedAt };
  const image = req.files?.image as UploadedFile[] | UploadedFile | undefined;
  let orderRound;

  // 주문차수로 등록하기 전, 현재 등록하려는 빵의 상태가 판매중(10), 출시예정(50)인지 검토하기
  const findResult = await OrderRoundService.findBreadStatus(breadNoList);
  if ('code' in findResult) return res.status(500).json(findResult);
  else null;

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
 */
export async function update(req: Request, res: Response) {
  const { no, seq, name, public_id, breadNoList: breadNoListStr, startedAt, endedAt } = req.body;
  let breadNoListJson = JSON.parse(breadNoListStr); // json parsing
  // breadNoList에서 breadNo 값만 추출
  const breadNoList = breadNoListJson.map((bread: { breadNo: number }) => bread.breadNo);
  const model = { no: Number(no), seq, name, public_id, breadNoList, startedAt, endedAt };
  const image = req.files?.image as UploadedFile[] | UploadedFile | undefined;
  let result;

  // 주문차수가 현재 존재하는지 확인
  const findRound = await OrderRoundService.getOrderRound(Number(no));
  if (!findRound)
    throw AppError.notFound('주문차수 정보를 찾을 수 없습니다. \n관리자 확인이 필요합니다.', {
      no,
      seq,
      name,
    });

  // 주문차수로 등록하기 전, 현재 등록하려는 빵의 상태가 판매중(10), 출시예정(50)인지 검토하기
  const findResult = await OrderRoundService.findBreadStatus(breadNoList);
  if ('code' in findResult) return res.status(500).json(findResult);
  else null;

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
