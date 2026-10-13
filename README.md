# Fitzza ERD

`fitzza-erd.puml` contains 29 tables and 203 columns from the [table specification](https://docs.google.com/spreadsheets/d/11iPQ3YFhEUBNp-2VAse4qQpHFEm6ymTOGz5_9-XCA6Y/edit#gid=448104477), read on 2026-10-13.

Tables are grouped by database domain. Solid lines represent specified FKs; dotted lines represent logical or conditional references. Unused fields and tables remain included. English table names without explicit names in the sheet are inferred. Source notes are preserved as PlantUML comments.

## 읽기 쉬운 도면

- [도메인 개요](diagrams/fitzza-overview.puml): 29개 테이블의 PK와 도메인 내부 관계만 표시합니다. 전체 구조를 먼저 확인할 때 사용합니다.
- [도메인별 상세 도면](diagrams): 각 DB의 전체 컬럼과 관계를 표시합니다. 외부 테이블은 연한 보라색으로 참조 키만 표시해 긴 연결선을 줄입니다.
- [전체 상세 ERD](fitzza-erd.puml): 모든 컬럼과 관계를 한 장에서 확인하는 원본입니다.

각 관계는 **참조하는 테이블이 속한 DB의 상세 도면**에 표시됩니다. 예를 들어 상품과 리뷰의 관계는 `review_db.puml`에 있습니다. 12개 상세 도면을 합치면 원본의 53개 관계가 모두 포함됩니다. 개요 도면에서는 도메인 간 관계를 생략하므로, 관계 확인은 상세 도면을 사용하세요.

수정은 `fitzza-erd.puml`에서 하고, Node.js로 도면을 다시 생성합니다. 별도 패키지 설치는 필요 없습니다.

```sh
node scripts/generate_views.mjs
```

상세 도면은 직각 라우팅 대신 기본 연결선을 사용하고 테이블 간 간격을 넓혔습니다. SVG로 렌더링하면 확대하면서 컬럼과 관계를 읽기 편합니다. 태그 및 수동 실행 워크플로는 개요와 상세 도면도 함께 렌더링합니다.

Items requiring clarification in the specification:

- Some VARCHAR lengths, ENUM values, and timestamp types are unspecified.
- `ai_fitting.completed_at` is NOT NULL even though a pending job has no completion time.
- `size_survey.order_item_id` has both a column UNIQUE constraint and a composite UNIQUE in its notes; both are preserved.
- Polymorphic references depend on their type discriminator and cannot be enforced by an ordinary FK to multiple tables.
- Child counts are shown as zero or more unless a shared primary key or UNIQUE FK enforces zero or one. Business minimums are not inferred.

## Generate images on tag push

Commit `.github/workflows/render-plantuml.yml` and the PlantUML files to your GitHub repository before tagging:

```sh
git tag v1.0.0
git push origin v1.0.0
```

The workflow validates all `.puml` files, renders SVG and PNG with Korean font support, and uploads an artifact named `plantuml-images-<run number>`. Download it from **Actions → Render PlantUML → the run → Artifacts**. Artifacts are retained for 30 days, subject to repository retention limits. Manual runs are available through **Run workflow** on the default branch.

The workflow renders committed PlantUML source; it does not refresh the Google Sheet. No additional secrets are required, and repository access is read-only.

## Local rendering

Download PlantUML 1.2026.8 from the official releases and use Java 21:

```sh
java -jar plantuml-1.2026.8.jar -charset UTF-8 -checkonly fitzza-erd.puml
java -jar plantuml-1.2026.8.jar -charset UTF-8 -tsvg fitzza-erd.puml
java -DPLANTUML_LIMIT_SIZE=32768 -Xmx2g -jar plantuml-1.2026.8.jar -charset UTF-8 -tpng fitzza-erd.puml
```

SVG is recommended for zooming into the complete diagram.
