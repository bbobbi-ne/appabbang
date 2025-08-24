/**
 * 고객 정보 validate
 */
import { RequestHandler } from 'express';
import { validationResult, body } from 'express-validator';
import { AppError } from '@/types';

export const validate = (validators: RequestHandler[]): RequestHandler => {
  return (req, res, next) => {
    (async () => {
      for (const validator of validators) {
        const maybePromise = validator(req, res, () => {});
        if (maybePromise instanceof Promise) {
          await maybePromise;
        }
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      throw AppError.badRequest(errors.array()[0]?.msg);
    })().catch(next);
  };
};

const ID_VALIDATION = {
  key: 'id',
  length: {
    min: 5,
    max: 30,
    message: '아이디는 5~30자 이내로 입력해야 합니다.',
  },
  matches: {
    // 영문 대/소문자 + 숫자 조합, 5~30자
    value: /^[a-zA-Z0-9]{5,30}$/,
    message: '아이디는 영문 대/소문자 + 숫자 조합으로 5~30자 입력해야 합니다.',
  },
  string: { message: '아이디는 문자열로 입력해야 합니다.' },
  empty: { message: '아이디는 필수 입력항목입니다.' },
};

const NAME_VALIDATION = {
  key: 'name',
  length: {
    min: 2,
    max: 30,
    message: '이름은 2~30자 이내로 입력해야 합니다.',
  },
  matches: {
    // 한글 2~30자
    value: /^[가-힣]{2,30}$/,
    message: '이름은 한글 2~30자 입력 가능합니다.',
  },
  string: { message: '이름은 문자열로 입력해야 합니다.' },
  empty: { message: '이름을 입력하세요.' },
};

const EMAIL_VALIDATION = {
  key: 'email',
  length: {
    min: 1,
    max: 50,
    message: '이메일은 1~50자 이내로 입력해야 합니다.',
  },
  matches: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/g,
    message: '유효하는 이메일 형식이 아닙니다.',
  },
  string: { message: '이메일은 문자열로 입력해야 합니다.' },
  empty: { message: '이메일을 입력하세요.' },
};

const PASSWORD_VALIDATION = {
  key: 'pw',
  length: { min: 10, max: 30, message: '비밀번호는 10~30자 이내로 입력해야 합니다.' },
  matches: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,30}$/g,
    message:
      '비밀번호는 영문 대소문자 + 숫자 + 특수문자 포함, 10~30자리, 공백 제외하여 입력 가능합니다.',
  },
  string: { message: '비밀번호는 문자열로 입력해야 합니다.' },
  empty: { message: '비밀번호를 입력하세요.' },
};

const MOBILE_NUMBER_VALIDATION = {
  key: 'mobileNumber',
  matches: { value: /^01[016789]-?\d{3,4}-?\d{4}$/g, message: '유효한 휴대번호 양식이 아닙니다.' },
  string: { message: '휴대번호는 문자열로 입력해야 합니다.' },
  empty: { message: '휴대번호를 입력하세요.' },
};

const ADDRESS_VALIDATION = {
  key: 'address',
  length: {
    min: 1,
    max: 300,
    message: '주소는 1~300자 이내로 입력해야 합니다.',
  },
  string: { message: '주소는 문자열로 입력해야 합니다.' },
  empty: { message: '주소를 입력하세요.' },
};

const ADDRESS_DETAIL_VALIDATION = {
  key: 'addressDetail',
  length: {
    min: 1,
    max: 200,
    message: '상세주소는 1~200자 이내로 입력해야 합니다.',
  },
  string: { message: '상세주소는 문자열로 입력해야 합니다.' },
  empty: { message: '상세주소를 입력하세요.' },
};

const ZIPCODE_VALIDATION = {
  key: 'zipcode',
  length: {
    min: 1,
    max: 10,
    message: '우편번호는 1~10자 이내로 입력해야 합니다.',
  },
  string: { message: '우편번호는 문자열로 입력해야 합니다.' },
  empty: { message: '우편번호를 입력하세요.' },
};

/** 비밀번호 변경 전용 validation */
const UPDATE_PASSWORD_VALIDATION = {
  key: ['pw', 'pwModify'],
  length: { min: 10, max: 30, message: '비밀번호는 10~30자 이내로 입력해야 합니다.' },
  matches: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,30}$/g,
    message:
      '비밀번호는 영문 대소문자 + 숫자 + 특수문자 포함, 10~30자리, 공백 제외하여 입력 가능합니다.',
  },
  string: { message: '비밀번호는 문자열로 입력해야 합니다.' },
  empty: { message: '비밀번호를 입력하세요.' },
};

/**
 * 회원가입 유효성 검증
 */
export const createCustomerValidator = [
  body(ID_VALIDATION.key)
    .notEmpty()
    .withMessage(ID_VALIDATION.empty.message)
    .matches(ID_VALIDATION.matches.value)
    .withMessage(ID_VALIDATION.matches.message)
    .isString()
    .withMessage(ID_VALIDATION.string.message)
    .isLength({ min: ID_VALIDATION.length.min, max: ID_VALIDATION.length.max })
    .withMessage(ID_VALIDATION.length.message)
    .trim()
    .escape(),

  body(NAME_VALIDATION.key)
    .notEmpty()
    .withMessage(NAME_VALIDATION.empty.message)
    .matches(NAME_VALIDATION.matches.value)
    .withMessage(NAME_VALIDATION.matches.message)
    .isString()
    .withMessage(NAME_VALIDATION.string.message)
    .isLength({ min: NAME_VALIDATION.length.min, max: NAME_VALIDATION.length.max })
    .withMessage(NAME_VALIDATION.length.message)
    .trim()
    .escape(),

  body(EMAIL_VALIDATION.key)
    .notEmpty()
    .withMessage(EMAIL_VALIDATION.empty.message)
    .matches(EMAIL_VALIDATION.matches.value)
    .withMessage(EMAIL_VALIDATION.matches.message)
    .isString()
    .withMessage(EMAIL_VALIDATION.string.message)
    .isLength({ min: EMAIL_VALIDATION.length.min, max: EMAIL_VALIDATION.length.max })
    .withMessage(EMAIL_VALIDATION.length.message)
    .trim(),

  body(PASSWORD_VALIDATION.key)
    .notEmpty()
    .withMessage(PASSWORD_VALIDATION.empty.message)
    .matches(PASSWORD_VALIDATION.matches.value)
    .withMessage(PASSWORD_VALIDATION.matches.message)
    .isString()
    .withMessage(PASSWORD_VALIDATION.string.message)
    .isLength({ min: PASSWORD_VALIDATION.length.min, max: PASSWORD_VALIDATION.length.max })
    .withMessage(PASSWORD_VALIDATION.length.message)
    .trim()
    .escape(),

  body(MOBILE_NUMBER_VALIDATION.key)
    .notEmpty()
    .withMessage(MOBILE_NUMBER_VALIDATION.empty.message)
    .matches(MOBILE_NUMBER_VALIDATION.matches.value)
    .withMessage(MOBILE_NUMBER_VALIDATION.matches.message)
    .trim()
    .escape(),

  body(ADDRESS_VALIDATION.key)
    .notEmpty()
    .withMessage(ADDRESS_VALIDATION.empty.message)
    .isString()
    .withMessage(ADDRESS_VALIDATION.string.message)
    .isLength({ min: ADDRESS_VALIDATION.length.min, max: ADDRESS_VALIDATION.length.max })
    .withMessage(ADDRESS_VALIDATION.length.message)
    .trim()
    .escape(),

  body(ADDRESS_DETAIL_VALIDATION.key)
    .notEmpty()
    .withMessage(ADDRESS_DETAIL_VALIDATION.empty.message)
    .isString()
    .withMessage(ADDRESS_DETAIL_VALIDATION.string.message)
    .isLength({
      min: ADDRESS_DETAIL_VALIDATION.length.min,
      max: ADDRESS_DETAIL_VALIDATION.length.max,
    })
    .withMessage(ADDRESS_DETAIL_VALIDATION.length.message)
    .trim()
    .escape(),

  body(ZIPCODE_VALIDATION.key)
    .notEmpty()
    .withMessage(ZIPCODE_VALIDATION.empty.message)
    .isString()
    .withMessage(ZIPCODE_VALIDATION.string.message)
    .isLength({
      min: ZIPCODE_VALIDATION.length.min,
      max: ZIPCODE_VALIDATION.length.max,
    })
    .withMessage(ZIPCODE_VALIDATION.length.message)
    .trim()
    .escape(),
];

/**
 * 로그인 유효성 검증
 */
export const loginCustomerValidator = [
  body(ID_VALIDATION.key)
    .notEmpty()
    .withMessage(ID_VALIDATION.empty.message)
    .matches(ID_VALIDATION.matches.value)
    .withMessage(ID_VALIDATION.matches.message)
    .isString()
    .withMessage(ID_VALIDATION.string.message)
    .isLength({ min: ID_VALIDATION.length.min, max: ID_VALIDATION.length.max })
    .withMessage(ID_VALIDATION.length.message)
    .trim()
    .escape(),
  body(PASSWORD_VALIDATION.key)
    .notEmpty()
    .withMessage(PASSWORD_VALIDATION.empty.message)
    .matches(PASSWORD_VALIDATION.matches.value)
    .withMessage(PASSWORD_VALIDATION.matches.message)
    .isString()
    .withMessage(PASSWORD_VALIDATION.string.message)
    .isLength({ min: PASSWORD_VALIDATION.length.min, max: PASSWORD_VALIDATION.length.max })
    .withMessage(PASSWORD_VALIDATION.length.message)
    .trim()
    .escape(),
];

export const sendEmailValidator = [
  body('email')
    .notEmpty()
    .withMessage('이메일을 입력하세요.')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g)
    .withMessage('유효한 이메일 형식이 아닙니다.')
    .isString()
    .withMessage('이메일은 문자열이어야 합니다.')
    .trim(),
];

/**
 * 고객정보 수정 유효성 검증
 */
export const updateCustomerValidator = [
  // body(NAME_VALIDATION.key)
  //   .notEmpty()
  //   .withMessage(NAME_VALIDATION.empty.message)
  //   .matches(NAME_VALIDATION.matches.value)
  //   .withMessage(NAME_VALIDATION.matches.message)
  //   .isString()
  //   .withMessage(NAME_VALIDATION.string.message)
  //   .isLength({ min: NAME_VALIDATION.length.min, max: NAME_VALIDATION.length.max })
  //   .withMessage(NAME_VALIDATION.length.message)
  //   .trim()
  //   .escape(),

  // body(MOBILE_NUMBER_VALIDATION.key)
  //   .notEmpty()
  //   .withMessage(MOBILE_NUMBER_VALIDATION.empty.message)
  //   .matches(MOBILE_NUMBER_VALIDATION.matches.value)
  //   .withMessage(MOBILE_NUMBER_VALIDATION.matches.message)
  //   .trim()
  //   .escape(),

  body(MOBILE_NUMBER_VALIDATION.key)
    .notEmpty()
    .withMessage(MOBILE_NUMBER_VALIDATION.empty.message)
    .matches(MOBILE_NUMBER_VALIDATION.matches.value)
    .withMessage(MOBILE_NUMBER_VALIDATION.matches.message)
    .trim()
    .escape(),
];

/**
 * 고객정보 수정 - 비밀번호 변경
 */
export const updateCustomerPwValidator = [
  body(UPDATE_PASSWORD_VALIDATION.key[0])
    .notEmpty()
    .withMessage(UPDATE_PASSWORD_VALIDATION.empty.message)
    .matches(UPDATE_PASSWORD_VALIDATION.matches.value)
    .withMessage(UPDATE_PASSWORD_VALIDATION.matches.message)
    .isString()
    .withMessage(UPDATE_PASSWORD_VALIDATION.string.message)
    .isLength({
      min: UPDATE_PASSWORD_VALIDATION.length.min,
      max: UPDATE_PASSWORD_VALIDATION.length.max,
    })
    .withMessage(UPDATE_PASSWORD_VALIDATION.length.message)
    .trim()
    .escape(),
  body(UPDATE_PASSWORD_VALIDATION.key[1])
    .notEmpty()
    .withMessage(UPDATE_PASSWORD_VALIDATION.empty.message)
    .matches(UPDATE_PASSWORD_VALIDATION.matches.value)
    .withMessage(UPDATE_PASSWORD_VALIDATION.matches.message)
    .isString()
    .withMessage(UPDATE_PASSWORD_VALIDATION.string.message)
    .isLength({
      min: UPDATE_PASSWORD_VALIDATION.length.min,
      max: UPDATE_PASSWORD_VALIDATION.length.max,
    })
    .withMessage(UPDATE_PASSWORD_VALIDATION.length.message)
    .trim()
    .escape(),
];
