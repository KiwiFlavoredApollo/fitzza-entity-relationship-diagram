# Fitzza ERD

## Mermaid ERD

- [전체 ERD 보기](fitzza-erd.md): GitHub에서 Mermaid 다이어그램을 바로 표시합니다.
- [전체 Mermaid 소스](fitzza-erd.mmd): Mermaid 편집기에서 사용할 수 있습니다.
- [테이블 개요 (PK)](diagrams/mermaid/fitzza-overview.md)
- [도메인별 ERD](diagrams/mermaid): 12개 DB별 Markdown 및 `.mmd` 파일입니다. 참조하는 테이블의 DB를 기준으로 관계를 배치하며, 외부 참조 테이블도 함께 표시합니다.

`fitzza-erd.mmd`는 29개 테이블, 203개 컬럼, 53개 관계를 담은 원본입니다. PK/FK/UK, 카디널리티, 논리적·조건부 참조를 보존합니다. DB 구분은 소스 주석과 도메인별 파일로 제공합니다. 복합 UNIQUE와 원본 설명은 주석에, ENUM 값과 기본값 등은 컬럼 설명에 보존합니다. 원본에서 타입이 지정되지 않은 컬럼은 `UNSPECIFIED`로 표시합니다.

`fitzza-erd.mmd` 수정 후 다음 명령으로 Markdown과 도메인별 Mermaid 파일을 다시 생성합니다. 별도 패키지 설치는 필요 없습니다.

```sh
node scripts/generate_mermaid.mjs
```

Table specification snapshot: 2026-10-13. Source notes are preserved in Mermaid comments.

Items requiring clarification in the specification:

- Some VARCHAR lengths, ENUM values, and timestamp types are unspecified.
- `ai_fitting.completed_at` is NOT NULL even though a pending job has no completion time.
- `size_survey.order_item_id` has both a column UNIQUE constraint and a composite UNIQUE in its notes; both are preserved.
- Polymorphic references depend on their type discriminator and cannot be enforced by an ordinary FK to multiple tables.
- Child counts are shown as zero or more unless a shared primary key or UNIQUE FK enforces zero or one. Business minimums are not inferred.

