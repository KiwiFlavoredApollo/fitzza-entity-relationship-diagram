# Fitzza ERD

## Mermaid ERD

- [전체 ERD 보기](fitzza-erd.md): GitHub에서 Mermaid 다이어그램을 바로 표시합니다.
- [전체 Mermaid 소스](fitzza-erd.mmd): Mermaid 편집기에서 사용할 수 있습니다.
- [테이블 개요 (PK)](diagrams/mermaid/fitzza-overview.md)
- [도메인별 ERD](diagrams/mermaid): 12개 DB별 Markdown 및 `.mmd` 파일입니다. 참조하는 테이블의 DB를 기준으로 관계를 배치하며, 외부 참조 테이블도 함께 표시합니다.

기존 `fitzza-erd.puml`의 29개 테이블, 203개 컬럼, 53개 관계를 변환했습니다. PK/FK/UK, 카디널리티, 논리적·조건부 참조를 보존합니다. Mermaid는 PlantUML의 패키지 레이아웃을 지원하지 않으므로 DB 구분은 소스 주석과 도메인별 파일로 제공합니다. 복합 UNIQUE와 원본 설명은 주석에, ENUM 값과 기본값 등은 컬럼 설명에 보존합니다. 원본에서 타입이 지정되지 않은 컬럼은 `UNSPECIFIED`로 표시합니다.

원본 수정 후 다음 명령으로 Mermaid 파일을 다시 생성합니다. 별도 패키지 설치는 필요 없습니다.

```sh
node scripts/generate_mermaid.mjs
```

`fitzza-erd.puml` contains 29 tables and 203 columns from the [table specification](https://docs.google.com/spreadsheets/d/11iPQ3YFhEUBNp-2VAse4qQpHFEm6ymTOGz5_9-XCA6Y/edit#gid=448104477), read on 2026-10-13.

Tables are grouped by database domain. Solid lines represent specified FKs; dotted lines represent logical or conditional references. Unused fields and tables remain included. English table names without explicit names in the sheet are inferred. Source notes are preserved as PlantUML comments.

## 읽기 쉬운 도면

- [도메인 개요](diagrams/fitzza-overview.puml): 29개 테이블의 PK를 도메인별로 표시합니다. 전체 구조를 먼저 확인할 때 사용합니다.
- [도메인별 상세 도면](diagrams): 각 DB의 전체 컬럼과 관계를 표시합니다. 관계마다 독립된 패널에 참조 대상의 PK와 자식 테이블의 PK·참조 컬럼을 반복 표시합니다. 각 패널에 연결선이 하나만 있으므로 선이 공유되거나 서로 교차하지 않습니다. 패널 제목에 참조 컬럼과 조건을 표시하며, 자기 참조도 두 테이블로 나누어 표시합니다.
- [전체 상세 ERD](fitzza-erd.puml): 모든 컬럼과 관계를 한 장에서 확인하는 원본입니다.

각 관계는 **참조하는 테이블이 속한 DB의 상세 도면**에 표시됩니다. 예를 들어 상품과 리뷰의 관계는 `review_db.puml`에 있습니다. 12개 상세 도면을 합치면 원본의 53개 관계가 모두 포함됩니다. 개요 도면은 테이블 목록이므로, 관계 확인은 상세 도면을 사용하세요. 전체 ERD도 같은 관계 패널을 사용하며, `diagrams/fitzza-relations.iuml`은 생성기가 관리하는 포함 파일입니다.

수정은 `fitzza-erd.puml`에서 하고, Node.js로 도면을 다시 생성합니다. 별도 패키지 설치는 필요 없습니다.

```sh
node scripts/generate_views.mjs
```

모든 도면은 직각 연결선(`skinparam linetype ortho`)을 사용하며, 좌측 하단에 한글 범례를 표시합니다. 상세 도면은 테이블 간 간격을 넓혔습니다. SVG로 렌더링하면 확대하면서 컬럼과 관계를 읽기 편합니다. 태그 및 수동 실행 워크플로는 개요와 상세 도면도 함께 렌더링합니다.

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
