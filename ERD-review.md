# ERD 명세 대조 결과

점검일: 2026-10-13 (시트 최신 조회 기준)

원본: [테이블 명세서](https://docs.google.com/spreadsheets/d/11iPQ3YFhEUBNp-2VAse4qQpHFEm6ymTOGz5_9-XCA6Y/edit#gid=448104477)

대상: `fitzza-erd.puml`

## 대조 범위와 결과

시트의 A1:G300 및 B301:G1028을 읽었다. 명세 데이터는 4~206행에 있으며, 301행 이후 조회 범위는 비어 있다.

| 항목 | 결과 |
| --- | --- |
| DB 도메인 | 12개 일치 |
| 한글 테이블명 및 도메인 소속 | 29개 일치 |
| 컬럼명 및 순서 | 203개 일치, 누락·추가 없음 |
| 타입·길이·ENUM·NULL·기본값·자동 증가·PK·FK·UNIQUE | 203개 컬럼의 제약조건 문자열 일치 |
| 한글 컬럼명 및 비고 | 203개 행의 PlantUML 주석 일치 |
| 복합 UNIQUE | 5개 모두 비고와 일치 |
| 복합 PK | 조합-후보 매핑, 게시글 좋아요, 댓글 좋아요의 컬럼 표시 일치 |
| 참조 관계 | 일반 참조 44개 및 조건부 참조 9개 대조; 아래 2건 수정 |

`user_measurement_preference.user_id`의 `<<FK>>`는 F열에 추가된 원문이 아니라 G22의 `FK(users)`를 도식에 표시한 보조 표기이다.

## 수정한 관계선

1. **사용자 선호 실측 → 회원 (22행)**: 비고의 `FK(users)`에는 논리 FK라는 명시가 없다. 점선과 `[logical]`을 제거하고 일반 FK 실선으로 수정했다. 1:N은 유지했다.
2. **사이즈 설문 → 주문 항목 (204행)**: `order_item_id`에 단일 컬럼 UNIQUE가 있으므로 주문 항목 하나에 설문은 최대 하나이다. 주문 항목 기준 1:N을 1:0..1로 수정했다. 논리 FK 점선은 유지했다.

## 동일성의 범위

영문 물리 테이블명을 별도 컬럼으로 명시한 시트가 아니므로, ERD의 영문 테이블명은 비고의 참조명과 한글 이름을 바탕으로 정한 이름이다. 특히 `user_body_profile`, `user_measurement_preference`, `orders`, `recommendation_message`, `combo_candidate`, `size_survey` 등을 시트에서 확정한 물리 테이블명이라고 단정할 수 없다.

참조 대상이 없는 FK는 컬럼명과 주변 명세를 바탕으로 연결했다. 예를 들어 주문·게시글·가상피팅의 `user_id`는 회원, 가상피팅의 `combo_id`는 코디 조합으로 연결했다. 조건부 관계는 `item_type`, `shared_type`, 알림 `type`을 기준으로 비고를 시각화했다. 알림 `target_id`는 시트에 FK로 선언되지 않은 이동 대상이므로 점선 참조이다.

각 테이블의 최소 자식 수는 별도 제약으로 명시되지 않아 0으로 표현했다. 공유 PK와 단일 UNIQUE FK의 최대 자식 수는 1로 표현했다. 비고에만 있는 업무 규칙은 소스 주석에 보존되어 있으며 모두 이미지에 표시되는 것은 아니다.

## 원본 명세에서 확인이 필요한 항목

- 9행 등 일부 `created_at`에는 타입이 없고 DEFAULT와 NOT NULL만 있다.
- 15행 `personal_color`는 ENUM 값 목록이 없다. 일부 VARCHAR는 길이가 없다.
- 200행 가상피팅 `completed_at`은 NOT NULL이다. 대기·실패 작업에서 값 처리 방식 확인이 필요하다.
- 204행 `order_item_id`에는 단일 UNIQUE와 비고의 복합 UNIQUE(user_id, order_item_id)가 함께 있다. 둘 다 유지했으며, 단일 UNIQUE가 더 강한 제약이다.
- 130행 알림 채널, 143행 `push_status`, 15행 `personal_color`는 미사용이나 원본에 있어 유지했다.

위 항목은 ERD 전사 오류가 아니라 원본의 미정·확인 사항이다. 시트는 수정하지 않았다. 이번 점검은 소스 내용과 관계 의미에 대한 점검이며 PlantUML 이미지 렌더링 검증은 포함하지 않는다.
