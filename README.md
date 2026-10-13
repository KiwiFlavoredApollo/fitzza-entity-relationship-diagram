# Fitzza ERD

## Mermaid ERD

- [전체 ERD 보기](fitzza-erd.md): GitHub에서 Mermaid 다이어그램을 바로 표시합니다.
- [전체 Mermaid 소스](fitzza-erd.mmd): Mermaid 편집기에서 사용할 수 있습니다.
- [테이블 개요 (PK)](diagrams/mermaid/fitzza-overview.mmd)
- [도메인별 ERD](diagrams/mermaid): 12개 DB별 `.mmd` 파일입니다. 참조하는 테이블의 DB를 기준으로 관계를 배치하며, 외부 참조 테이블도 함께 표시합니다.

`fitzza-erd.mmd`는 29개 테이블, 203개 컬럼, 53개 관계를 담은 원본입니다. PK/FK/UK, 카디널리티, 논리적·조건부 참조를 보존합니다. DB 구분은 소스 주석과 도메인별 파일로 제공합니다. 복합 UNIQUE와 원본 설명은 주석에, ENUM 값과 기본값 등은 컬럼 설명에 보존합니다. 원본에서 타입이 지정되지 않은 컬럼은 `UNSPECIFIED`로 표시합니다.

`fitzza-erd.mmd` 수정 후 다음 명령으로 전체 ERD Markdown과 도메인별 Mermaid 파일을 다시 생성합니다. `diagrams` 아래에는 `.mmd` 파일만 생성합니다. 별도 패키지 설치는 필요 없습니다.

```sh
node scripts/generate_mermaid.mjs
```

Table specification snapshot: 2026-10-13. Source notes are preserved in Mermaid comments.

## 버전 태그의 PNG 이미지 생성

[Render Mermaid PNG](.github/workflows/render-mermaid.yml) 워크플로는 `v1.0.0`처럼 `v` 다음에 숫자가 오는 태그가 푸시되면 실행됩니다. 워크플로 파일을 포함한 커밋에 태그를 생성하세요.

```sh
git tag v1.0.0
git push origin v1.0.0
```

태그의 전체 ERD, 테이블 개요, 12개 도메인 ERD를 PNG로 렌더링합니다. 한글 폰트와 흰 배경을 사용하며 이미지는 `build/images/`에 생성합니다. Mermaid CLI 사용법은 [공식 문서](https://github.com/mermaid-js/mermaid-cli)를 참고하세요.

연결선은 ELK 레이아웃으로 수평·수직 경로를 사용합니다. 모서리와 교차점에는 렌더러의 기본 둥근 처리와 교차 표시가 적용됩니다. Actions는 ELK를 내장한 Mermaid CLI 12.0.0을 사용하며, `.mmd` 소스에도 `layout: elk` 설정을 포함합니다. Markdown 미리보기의 모양은 해당 서비스의 Mermaid 버전과 ELK 지원에 따라 달라질 수 있으므로, 배포 결과는 Release의 PNG로 확인하세요. 레이아웃 지원은 [Mermaid 공식 문서](https://mermaid.js.org/config/layouts)를 참고하세요.

**Actions → Render Mermaid PNG → 실행 결과 → Artifacts**에서 `mermaid-png-<실행 번호>`를 다운로드하면 됩니다. 보관 기간은 30일이며 저장소의 보관 정책이 적용됩니다. GitHub Actions 아티팩트 저장 방식은 [공식 문서](https://github.com/actions/upload-artifact)에 설명되어 있습니다. 기본 브랜치에서는 **Run workflow**로 수동 실행할 수도 있습니다.

버전 태그 실행에서는 PNG 파일을 **Releases → 해당 버전 → Assets**에도 첨부합니다. 해당 태그의 Release가 없으면 생성하며, 이미 있으면 PNG를 추가합니다. 재실행 시 같은 이름의 첨부 파일을 교체합니다. `v1.0.0-rc.1`처럼 하이픈을 포함하는 태그의 새 Release는 사전 릴리스로 표시합니다. 브랜치에서 수동 실행하면 Actions 아티팩트만 저장하고, 버전 태그를 선택해 수동 실행하면 Release에도 업로드합니다.

Release 생성과 첨부에는 기본 `GITHUB_TOKEN`의 `contents: write` 권한을 사용하므로 별도 토큰 설정은 필요 없습니다. [Release 생성](https://cli.github.com/manual/gh_release_create) 및 [파일 첨부](https://cli.github.com/manual/gh_release_upload)는 GitHub CLI로 처리합니다.

전체 이미지를 한 번에 받으려면 **Releases → 해당 버전 → Assets → `fitzza-entity-relationship-diagram-<버전 태그>.zip`**을 다운로드하세요. 예를 들어 `v0.0.1` 태그는 `fitzza-entity-relationship-diagram-v0.0.1.zip`을 생성합니다. ZIP에는 전체 ERD, 테이블 개요, 도메인별 PNG가 디렉토리 구조와 함께 포함됩니다. 개별 PNG도 계속 첨부하며 ZIP은 Actions 아티팩트에도 포함합니다. 브랜치에서 수동 실행하면 태그 대신 브랜치 이름을 사용하며, 파일명에 사용할 수 없는 문자는 하이픈으로 바꿉니다.

렌더링은 커밋된 `.mmd` 파일을 사용합니다. `diagrams` 아래에 Markdown 파일을 생성하지 않으며, 렌더링 실패 시 워크플로가 실패합니다.

Items requiring clarification in the specification:

- Some VARCHAR lengths, ENUM values, and timestamp types are unspecified.
- `ai_fitting.completed_at` is NOT NULL even though a pending job has no completion time.
- `size_survey.order_item_id` has both a column UNIQUE constraint and a composite UNIQUE in its notes; both are preserved.
- Polymorphic references depend on their type discriminator and cannot be enforced by an ordinary FK to multiple tables.
- Child counts are shown as zero or more unless a shared primary key or UNIQUE FK enforces zero or one. Business minimums are not inferred.

