# Fitzza ERD

`fitzza-erd.puml` contains 29 tables and 203 columns from the [table specification](https://docs.google.com/spreadsheets/d/11iPQ3YFhEUBNp-2VAse4qQpHFEm6ymTOGz5_9-XCA6Y/edit#gid=448104477), read on 2026-10-13.

Tables are grouped by database domain. Solid lines represent specified FKs; dotted lines represent logical or conditional references. Unused fields and tables remain included. English table names without explicit names in the sheet are inferred. Source notes are preserved as PlantUML comments.

Items requiring clarification in the specification:

- Some VARCHAR lengths, ENUM values, and timestamp types are unspecified.
- `ai_fitting.completed_at` is NOT NULL even though a pending job has no completion time.
- `size_survey.order_item_id` has both a column UNIQUE constraint and a composite UNIQUE in its notes; both are preserved.
- Polymorphic references depend on their type discriminator and cannot be enforced by an ordinary FK to multiple tables.
- Child counts are shown as zero or more unless a shared primary key enforces zero or one. Business minimums are not inferred.

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
