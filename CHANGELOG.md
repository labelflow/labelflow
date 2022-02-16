# Changelog

## [1.3.0](https://github.com/labelflow/labelflow/compare/1.2.3...1.3.0)

- Update text on workspace list empty state [`#891`](https://github.com/labelflow/labelflow/pull/891)
- Await refetchQueries when creating a new workspace [`#888`](https://github.com/labelflow/labelflow/pull/888)
- Update MigrateLocalDatasetsModal expiration date [`#885`](https://github.com/labelflow/labelflow/pull/885)
- Fix timeout on label export [`#863`](https://github.com/labelflow/labelflow/pull/863)
- Fix graphiql pages, centered spinners and dark mode spinners [`#875`](https://github.com/labelflow/labelflow/pull/875)
- Add temporary modal to warn about migrating local datasets [`#871`](https://github.com/labelflow/labelflow/pull/871)
- Add Jest tests coverage to CodeClimate [`#870`](https://github.com/labelflow/labelflow/pull/870)
- Use https://docs.labelflow.ai as documentation URL [`#845`](https://github.com/labelflow/labelflow/pull/845)
- Update texts in import modal [`#859`](https://github.com/labelflow/labelflow/pull/859)
- Add announcements in the app and website top bars [`#787`](https://github.com/labelflow/labelflow/pull/787)
- Fix labeling tools tests [`#842`](https://github.com/labelflow/labelflow/pull/842)
- Only build the working Storybook files until the service worker is fully dropped [`#849`](https://github.com/labelflow/labelflow/pull/849)
- Rework use-images-navigation hook tests [`#841`](https://github.com/labelflow/labelflow/pull/841)
- Fix dataset export tests [`#836`](https://github.com/labelflow/labelflow/pull/836)
- Remove labels without classes info from the export modal [`#830`](https://github.com/labelflow/labelflow/pull/830)
- Fix tests on import modal [`#838`](https://github.com/labelflow/labelflow/pull/838)
- Merge #803, #833 and #834 into enhancement/delete-service-worker [`#835`](https://github.com/labelflow/labelflow/pull/835)
- Generate types for web GraphQL queries and mutations [`#800`](https://github.com/labelflow/labelflow/pull/800)
- Fix typos in README and update our GitHub project URL [`#820`](https://github.com/labelflow/labelflow/pull/820)
- In website, use ghost variant on the GitHub button [`#814`](https://github.com/labelflow/labelflow/pull/814)
- Use exact package versions [`#809`](https://github.com/labelflow/labelflow/pull/809)
- Improve image upload performance [`#815`](https://github.com/labelflow/labelflow/pull/815)
- Make pagination footer ignore its parent padding [`#813`](https://github.com/labelflow/labelflow/pull/813)
- Paginate datasets [`#783`](https://github.com/labelflow/labelflow/pull/783)
- Fix inverted ternary in user avatar for color selection [`#802`](https://github.com/labelflow/labelflow/pull/802)
- Fix exports not working from datasets in workspaces [`#790`](https://github.com/labelflow/labelflow/pull/790)
- Don't redirect to lastVisitedWorkspaceSlug anymore and remove local workspace from the switcher [`#797`](https://github.com/labelflow/labelflow/pull/797)
- Make sure that the PaginationContext page and total properties are never smaller than 1 [`#795`](https://github.com/labelflow/labelflow/pull/795)
- Configure the createLabelClass mutation when calling useMutation [`#791`](https://github.com/labelflow/labelflow/pull/791)
- Fix env variable for sitemap to work correctly [`#792`](https://github.com/labelflow/labelflow/pull/792)
- Correctly write the GitHub name in its star button [`#788`](https://github.com/labelflow/labelflow/pull/788)
- Try to make sure that the sign-in modal is actually shown before clicking on its close button [`#784`](https://github.com/labelflow/labelflow/pull/784)
- Fix export modal loading data before being opened [`#752`](https://github.com/labelflow/labelflow/pull/752)
- Track click on a sign-in method and on manage billing [`#756`](https://github.com/labelflow/labelflow/pull/756)
- Add sitemap [`#743`](https://github.com/labelflow/labelflow/pull/743)
- Update website banner with the new online workspaces and IOG features [`#769`](https://github.com/labelflow/labelflow/pull/769)
- Fix bad aggregates count for workspace &gt; datasets queries [`#746`](https://github.com/labelflow/labelflow/pull/746)
- Change website NavBar GitHub link design [`#760`](https://github.com/labelflow/labelflow/pull/760)
- Paginate dataset image gallery [`#693`](https://github.com/labelflow/labelflow/pull/693)
- Switch /website footer layout orientation between horizontal on desktop and vertical on mobile [`#755`](https://github.com/labelflow/labelflow/pull/755)
- Optimise image pre loading on labelling interface [`#745`](https://github.com/labelflow/labelflow/pull/745)
- Correctly define parameters of the WelcomeWithoutCountDown story [`#750`](https://github.com/labelflow/labelflow/pull/750)
- Update error message when different signin method is used [`#726`](https://github.com/labelflow/labelflow/pull/726)

## [1.2.3](https://github.com/labelflow/labelflow/compare/1.2.2...1.2.3) - 2022-01-07

- Fix yolo export  [`#739`](https://github.com/labelflow/labelflow/pull/739)

## [1.2.2](https://github.com/labelflow/labelflow/compare/1.2.1...1.2.2) - 2022-01-07

- Increase default Cypress timeout to 60s [`#747`](https://github.com/labelflow/labelflow/pull/747)

## [1.2.1](https://github.com/labelflow/labelflow/compare/1.2.0...1.2.1) - 2022-01-06

- Update next to version 12.0.7 [`#744`](https://github.com/labelflow/labelflow/pull/744)
- Don't skip any Jest test [`#697`](https://github.com/labelflow/labelflow/pull/697)

## [1.2.0](https://github.com/labelflow/labelflow/compare/1.1.1...1.2.0) - 2022-01-06

- Add and optimize DB schema indexes [`#707`](https://github.com/labelflow/labelflow/pull/707)
- Factorise spinners through the app [`#692`](https://github.com/labelflow/labelflow/pull/692)
- Fix wrong url sent during sign in [`#734`](https://github.com/labelflow/labelflow/pull/734)
- Use JWT session tokens [`#717`](https://github.com/labelflow/labelflow/pull/717)
- Increase testing-library/react default timeout to 30s [`#740`](https://github.com/labelflow/labelflow/pull/740)
- Update members list max width [`#735`](https://github.com/labelflow/labelflow/pull/735)
- Trim white spaces around email addresses [`#732`](https://github.com/labelflow/labelflow/pull/732)
- Fix bug with being apparently signed out after error [`#729`](https://github.com/labelflow/labelflow/pull/729)
- * Disable non-determinist react-openlayers-fiber stories [`#704`](https://github.com/labelflow/labelflow/pull/704)
- Updated texts: trial period, upload modal [`#723`](https://github.com/labelflow/labelflow/pull/723)
- Fixed background of dataset class list rows [`#722`](https://github.com/labelflow/labelflow/pull/722)
- Fix bug creating duplicate label classes from modal [`#715`](https://github.com/labelflow/labelflow/pull/715)

## [1.1.1](https://github.com/labelflow/labelflow/compare/1.1.0...1.1.1) - 2021-12-31

- Display a more meaningful error message in the app when createWorkspace fails [`#714`](https://github.com/labelflow/labelflow/pull/714)

## [1.1.0](https://github.com/labelflow/labelflow/compare/1.0.27...1.1.0) - 2021-12-29

- Release Workspaces to Allow Team Collaboration and Auto Polygon to Boost Labeling Productivity [`#497`](https://github.com/labelflow/labelflow/pull/497)
- Define a unique key prop in class-selection-popover list [`#696`](https://github.com/labelflow/labelflow/pull/696)
- Enhance dataset classes page [`#648`](https://github.com/labelflow/labelflow/pull/648)
- Feature/batch image creation [`#662`](https://github.com/labelflow/labelflow/pull/662)
- Allow to delete online workspaces and factorize workspace name input [`#667`](https://github.com/labelflow/labelflow/pull/667)
- Virtualize label class list [`#695`](https://github.com/labelflow/labelflow/pull/695)
- COCO import bug fixes and improvements [`#671`](https://github.com/labelflow/labelflow/pull/671)
- Update label class color generator [`#673`](https://github.com/labelflow/labelflow/pull/673)
- Fix e2e tests flakiness [`#689`](https://github.com/labelflow/labelflow/pull/689)
- Update apollo-server version [`#682`](https://github.com/labelflow/labelflow/pull/682)
- Update tutorial images and labels [`#677`](https://github.com/labelflow/labelflow/pull/677)
- Update some wordings for release [`#674`](https://github.com/labelflow/labelflow/pull/674)
- Add metadata field for image in schema and resolvers [`#675`](https://github.com/labelflow/labelflow/pull/675)
- Update graphiql version [`#669`](https://github.com/labelflow/labelflow/pull/669)
- Feature/#594 auto polygon improvements [`#624`](https://github.com/labelflow/labelflow/pull/624)
- Improve linter configuration [`#656`](https://github.com/labelflow/labelflow/pull/656)
- Add spinner on loading datasets and add reusable card box component [`#668`](https://github.com/labelflow/labelflow/pull/668)
- Add end to end tests in online workspaces [`#651`](https://github.com/labelflow/labelflow/pull/651)
- Dark mode for workspace members list [`#655`](https://github.com/labelflow/labelflow/pull/655)
- Re-enable jest tests [`#652`](https://github.com/labelflow/labelflow/pull/652)
- Fix dataset import [`#642`](https://github.com/labelflow/labelflow/pull/642)
- Enhancement/make s3 client compatible with minio [`#638`](https://github.com/labelflow/labelflow/pull/638)
- Do not reload indefinitely the page when image loading does not work [`#614`](https://github.com/labelflow/labelflow/pull/614)
- Feature/aws connector [`#607`](https://github.com/labelflow/labelflow/pull/607)
- Increase IOG size limit [`#622`](https://github.com/labelflow/labelflow/pull/622)
- fix user invitation urls [`#618`](https://github.com/labelflow/labelflow/pull/618)
- create dedicated isWorkspaceSlugAlreadyTaken resolver and use it on t… [`#597`](https://github.com/labelflow/labelflow/pull/597)
- Add Minio for development [`#608`](https://github.com/labelflow/labelflow/pull/608)
- Fix bug when trying to upload many files [`#587`](https://github.com/labelflow/labelflow/pull/587)
- Different fixes before release of online workspaces [`#583`](https://github.com/labelflow/labelflow/pull/583)
- Bug/#578 fix online export [`#592`](https://github.com/labelflow/labelflow/pull/592)
- Feature/#508 iog workflows [`#570`](https://github.com/labelflow/labelflow/pull/570)
- Change loading indicator tooltip when uploading files [`#591`](https://github.com/labelflow/labelflow/pull/591)
- Feature/validate email address on signin modal [`#581`](https://github.com/labelflow/labelflow/pull/581)
- Feature/generate thumbnails [`#548`](https://github.com/labelflow/labelflow/pull/548)
- Feature/online workspaces bugs before release [`#574`](https://github.com/labelflow/labelflow/pull/574)
- Feature/fix local workspace settings and members [`#573`](https://github.com/labelflow/labelflow/pull/573)
- Feature/create a subscription per customer and integrate customer portal [`#541`](https://github.com/labelflow/labelflow/pull/541)
- Feature/invitation manager [`#558`](https://github.com/labelflow/labelflow/pull/558)
- Enable to sign in with email in preview deployments [`#557`](https://github.com/labelflow/labelflow/pull/557)
- Add information on env vars to readme [`#550`](https://github.com/labelflow/labelflow/pull/550)
- Fix downshift ref errors in workspace switcher [`#556`](https://github.com/labelflow/labelflow/pull/556)
- End to end tests for online workspaces [`#535`](https://github.com/labelflow/labelflow/pull/535)
- Enhancement/next 12 [`#546`](https://github.com/labelflow/labelflow/pull/546)
- Feature/make code more standard [`#540`](https://github.com/labelflow/labelflow/pull/540)
- Feature/compile sw with swc [`#542`](https://github.com/labelflow/labelflow/pull/542)
- Remove sign in feature flag [`#543`](https://github.com/labelflow/labelflow/pull/543)
- Invite new members in workspace [`#504`](https://github.com/labelflow/labelflow/pull/504)
- Redirect to last visited workspace [`#526`](https://github.com/labelflow/labelflow/pull/526)
- Add profile page [`#513`](https://github.com/labelflow/labelflow/pull/513)
- Standardised use of color gradient in user avatars [`#517`](https://github.com/labelflow/labelflow/pull/517)
- Feature/create workspace popover [`#512`](https://github.com/labelflow/labelflow/pull/512)
- Changes to adapt emails to new mockups [`#511`](https://github.com/labelflow/labelflow/pull/511)
- Bug/prisma singleton [`#503`](https://github.com/labelflow/labelflow/pull/503)
- Feature/#459 list workspace members [`#496`](https://github.com/labelflow/labelflow/pull/496)
- Feature/#463 workspace invitation email [`#494`](https://github.com/labelflow/labelflow/pull/494)
- Feature/workspace switcher [`#493`](https://github.com/labelflow/labelflow/pull/493)

## [1.0.27](https://github.com/labelflow/labelflow/compare/1.0.26...1.0.27) - 2021-12-28

- Make issues faster to create and cleanup pull-request template [`#698`](https://github.com/labelflow/labelflow/pull/698)
- Deploy schema in CI [`#657`](https://github.com/labelflow/labelflow/pull/657)
- Have strapi running on prod DB [`#645`](https://github.com/labelflow/labelflow/pull/645)

## [1.0.26](https://github.com/labelflow/labelflow/compare/1.0.25...1.0.26) - 2021-12-08

- Set correct value for `og:url` of articles [`#641`](https://github.com/labelflow/labelflow/pull/641)

## [1.0.25](https://github.com/labelflow/labelflow/compare/1.0.24...1.0.25) - 2021-12-08

- Images are not deleted in a deleted dataset [`#637`](https://github.com/labelflow/labelflow/pull/637)
- Create a new prod DB [`#636`](https://github.com/labelflow/labelflow/pull/636)
- Small changes on website [`#620`](https://github.com/labelflow/labelflow/pull/620)
- fix: rename `askgit` to `mergestat` to fix failing GitHub Action [`#619`](https://github.com/labelflow/labelflow/pull/619)
- Bug/fix facebook article preview [`#616`](https://github.com/labelflow/labelflow/pull/616)
- Open links in other tabs in website [`#605`](https://github.com/labelflow/labelflow/pull/605)
- Cron job to run once per day on the Linkedin to Orbit gitHub action [`#604`](https://github.com/labelflow/labelflow/pull/604)
- Create linkedin-orbit.yml [`#602`](https://github.com/labelflow/labelflow/pull/602)
- Replace usage of external url env var by hardcoded url for tests [`#590`](https://github.com/labelflow/labelflow/pull/590)
- Change banner [`#586`](https://github.com/labelflow/labelflow/pull/586)
- Change error thrown when user tries to create an invalid label [`#549`](https://github.com/labelflow/labelflow/pull/549)
- Feature/#518 mask iog [`#545`](https://github.com/labelflow/labelflow/pull/545)
- Refactor auto polygon tool and workflow [`#547`](https://github.com/labelflow/labelflow/pull/547)

## [1.0.24](https://github.com/labelflow/labelflow/compare/1.0.23...1.0.24) - 2021-10-21

- Enable to set classification class from shortcut [`#505`](https://github.com/labelflow/labelflow/pull/505)

## [1.0.23](https://github.com/labelflow/labelflow/compare/1.0.22...1.0.23) - 2021-10-11

- rename labelling to labeling [`#502`](https://github.com/labelflow/labelflow/pull/502)

## [1.0.22](https://github.com/labelflow/labelflow/compare/1.0.21...1.0.22) - 2021-10-11

- Feature/iog [`#180`](https://github.com/labelflow/labelflow/pull/180)

## [1.0.21](https://github.com/labelflow/labelflow/compare/1.0.20...1.0.21) - 2021-10-08

- Delete images [`#488`](https://github.com/labelflow/labelflow/pull/488)
- Feature/#462 mjml emails [`#489`](https://github.com/labelflow/labelflow/pull/489)

## [1.0.20](https://github.com/labelflow/labelflow/compare/1.0.19...1.0.20) - 2021-10-04

- Feature/split local workspace urls [`#472`](https://github.com/labelflow/labelflow/pull/472)
- Add legal pages in footer and cookie banner [`#486`](https://github.com/labelflow/labelflow/pull/486)

## [1.0.19](https://github.com/labelflow/labelflow/compare/1.0.18...1.0.19) - 2021-10-01

- Add Image classification [`#447`](https://github.com/labelflow/labelflow/pull/447)

## [1.0.18](https://github.com/labelflow/labelflow/compare/1.0.17...1.0.18) - 2021-10-01

- Padding and logo size updated in sign-in modal [`#483`](https://github.com/labelflow/labelflow/pull/483)

## [1.0.17](https://github.com/labelflow/labelflow/compare/1.0.16...1.0.17) - 2021-10-01

- Add access control to dataset [`#454`](https://github.com/labelflow/labelflow/pull/454)
- Enhancement/remove manual deploy of prs [`#479`](https://github.com/labelflow/labelflow/pull/479)

## [1.0.16](https://github.com/labelflow/labelflow/compare/1.0.15...1.0.16) - 2021-10-01

- Bug/#469 cannot rename dataset [`#476`](https://github.com/labelflow/labelflow/pull/476)
- Display blog post details in social media previews [`#478`](https://github.com/labelflow/labelflow/pull/478)
- Avoid shrinking export button [`#474`](https://github.com/labelflow/labelflow/pull/474)

## [1.0.15](https://github.com/labelflow/labelflow/compare/1.0.14...1.0.15) - 2021-09-30

- Add tracking event to export button [`#464`](https://github.com/labelflow/labelflow/pull/464)

## [1.0.14](https://github.com/labelflow/labelflow/compare/1.0.13...1.0.14) - 2021-09-27

- Add full screen mode [`#456`](https://github.com/labelflow/labelflow/pull/456)

## [1.0.13](https://github.com/labelflow/labelflow/compare/1.0.12...1.0.13) - 2021-09-24

- Disambiguate dataset name at export [`#465`](https://github.com/labelflow/labelflow/pull/465)

## [1.0.12](https://github.com/labelflow/labelflow/compare/1.0.11...1.0.12) - 2021-09-24

- Fix bug at build time when user does not have a Sentry token [`#466`](https://github.com/labelflow/labelflow/pull/466)

## [1.0.11](https://github.com/labelflow/labelflow/compare/1.0.10...1.0.11) - 2021-09-24

- Add backend resolver tests to CI [`#457`](https://github.com/labelflow/labelflow/pull/457)

## [1.0.10](https://github.com/labelflow/labelflow/compare/1.0.9...1.0.10) - 2021-09-23

- Feature/#227 import coco [`#455`](https://github.com/labelflow/labelflow/pull/455)

## [1.0.9](https://github.com/labelflow/labelflow/compare/1.0.8...1.0.9) - 2021-09-22

- Updates on export feature [`#448`](https://github.com/labelflow/labelflow/pull/448)

## [1.0.8](https://github.com/labelflow/labelflow/compare/1.0.7...1.0.8) - 2021-09-17

- Fix bug of errors being thrown in service worker from create dataset modal [`#450`](https://github.com/labelflow/labelflow/pull/450)

## [1.0.7](https://github.com/labelflow/labelflow/compare/1.0.6...1.0.7) - 2021-09-17

- Fix bug of error being thrown when clearing site data and reloading page [`#451`](https://github.com/labelflow/labelflow/pull/451)

## [1.0.6](https://github.com/labelflow/labelflow/compare/1.0.5...1.0.6) - 2021-09-17

- Feature/#317 cru workspaces [`#354`](https://github.com/labelflow/labelflow/pull/354)

## [1.0.5](https://github.com/labelflow/labelflow/compare/1.0.4...1.0.5) - 2021-09-15

- Make a more generic version of the coco exporter [`#417`](https://github.com/labelflow/labelflow/pull/417)

## [1.0.4](https://github.com/labelflow/labelflow/compare/1.0.3...1.0.4) - 2021-09-14

- Feature/responsive breadcrumbs [`#445`](https://github.com/labelflow/labelflow/pull/445)

## [1.0.3](https://github.com/labelflow/labelflow/compare/1.0.2...1.0.3) - 2021-09-13

- Track more actions in GA [`#443`](https://github.com/labelflow/labelflow/pull/443)
- Enhance cookie banner [`#442`](https://github.com/labelflow/labelflow/pull/442)
- Prefetch previous and next images [`#439`](https://github.com/labelflow/labelflow/pull/439)
- Fix bug in change class shortcut on azerty keyboards [`#440`](https://github.com/labelflow/labelflow/pull/440)

## [1.0.2](https://github.com/labelflow/labelflow/compare/1.0.1...1.0.2) - 2021-09-09

- Enhancement/release patches instead of minors [`#437`](https://github.com/labelflow/labelflow/pull/437)

## [1.0.1](https://github.com/labelflow/labelflow/compare/1.0.0...1.0.1) - 2021-09-09

- Bug/heavy images dont load without reload [`#435`](https://github.com/labelflow/labelflow/pull/435)
- Add clarity tracking code [`#428`](https://github.com/labelflow/labelflow/pull/428)
- Fix bump-version job in the CI [`#434`](https://github.com/labelflow/labelflow/pull/434)
- Add Sentry to capture exceptions in client, server and service worker [`#432`](https://github.com/labelflow/labelflow/pull/432)
- Add link to documentation in website [`#433`](https://github.com/labelflow/labelflow/pull/433)
- Feature/robustify app more [`#429`](https://github.com/labelflow/labelflow/pull/429)
- Feature/signin modal buttons [`#423`](https://github.com/labelflow/labelflow/pull/423)
- Fix Bug weird touch move on android on openlayers [`#425`](https://github.com/labelflow/labelflow/pull/425)
- Feature/remote server [`#349`](https://github.com/labelflow/labelflow/pull/349)
- Updated README.md for better view [`#414`](https://github.com/labelflow/labelflow/pull/414)
- Add versioning and GitHub releases [`#375`](https://github.com/labelflow/labelflow/pull/375)
- Feature/fix ci e2e [`#416`](https://github.com/labelflow/labelflow/pull/416)
- Feature/#315 nextauth [`#396`](https://github.com/labelflow/labelflow/pull/396)
- #314 file upload resolver for online storage [`#326`](https://github.com/labelflow/labelflow/pull/326)
- Implement the api/graphql server [`#330`](https://github.com/labelflow/labelflow/pull/330)
- Implement basic upload route [`#329`](https://github.com/labelflow/labelflow/pull/329)

## [1.0.0](https://github.com/labelflow/labelflow/compare/0.1.0...1.0.0) - 2021-09-02

- Enhancement/lighthouse fixes [`#411`](https://github.com/labelflow/labelflow/pull/411)
- Fix z index problems & cleanup navbar [`#410`](https://github.com/labelflow/labelflow/pull/410)
- Consistent names [`#407`](https://github.com/labelflow/labelflow/pull/407)
- Mobile improvements [`#404`](https://github.com/labelflow/labelflow/pull/404)
- change meta image [`#406`](https://github.com/labelflow/labelflow/pull/406)
- Image changes [`#405`](https://github.com/labelflow/labelflow/pull/405)
- Add Dark Color mode [`#400`](https://github.com/labelflow/labelflow/pull/400)
- Change first image of tutorial [`#402`](https://github.com/labelflow/labelflow/pull/402)
- websites changes [`#398`](https://github.com/labelflow/labelflow/pull/398)
- Make Service Worker faster to install [`#397`](https://github.com/labelflow/labelflow/pull/397)
- Make classes more discoverable & update insert example urls button [`#390`](https://github.com/labelflow/labelflow/pull/390)
- Better looking dnd [`#395`](https://github.com/labelflow/labelflow/pull/395)
- title change [`#394`](https://github.com/labelflow/labelflow/pull/394)
- website changes [`#393`](https://github.com/labelflow/labelflow/pull/393)
- Feature/update empty states with new icons [`#389`](https://github.com/labelflow/labelflow/pull/389)
- Add Github button at two places in the website [`#391`](https://github.com/labelflow/labelflow/pull/391)
- Welcome modal loading update [`#252`](https://github.com/labelflow/labelflow/pull/252)
- Enhancement/update tutorial images [`#392`](https://github.com/labelflow/labelflow/pull/392)
- Feature/website changes [`#377`](https://github.com/labelflow/labelflow/pull/377)
- Custom sorting of labelClasses [`#371`](https://github.com/labelflow/labelflow/pull/371)
- Feature/update images in tutorial dataset [`#386`](https://github.com/labelflow/labelflow/pull/386)
- Update bug_report.md [`#385`](https://github.com/labelflow/labelflow/pull/385)
- Fix dexie await promise bug [`#381`](https://github.com/labelflow/labelflow/pull/381)
- Feature/#352 update url with local [`#376`](https://github.com/labelflow/labelflow/pull/376)
- Bug/#360 cant modify invalid geometry [`#369`](https://github.com/labelflow/labelflow/pull/369)

## 0.1.0 - 2021-08-25

- Feature/add license and update readme [`#373`](https://github.com/labelflow/labelflow/pull/373)
- Website changes [`#374`](https://github.com/labelflow/labelflow/pull/374)
- Feature/#341 update dataset urls with their slugs [`#356`](https://github.com/labelflow/labelflow/pull/356)
- Enhance styling of videos [`#372`](https://github.com/labelflow/labelflow/pull/372)
- Export image of selected project only [`#370`](https://github.com/labelflow/labelflow/pull/370)
- Implement image size validation [`#362`](https://github.com/labelflow/labelflow/pull/362)
- Feature/#342 free cache when dataset is deleted [`#348`](https://github.com/labelflow/labelflow/pull/348)
- Changing blog page text [`#363`](https://github.com/labelflow/labelflow/pull/363)
- Feature/strapi updates [`#357`](https://github.com/labelflow/labelflow/pull/357)
- Feature/support menu [`#355`](https://github.com/labelflow/labelflow/pull/355)
- Clicking on "Product" redirects to the labelling interface [`#347`](https://github.com/labelflow/labelflow/pull/347)
- Upgrade to next js 11.1 [`#344`](https://github.com/labelflow/labelflow/pull/344)
- Quality/robustify db service worker [`#334`](https://github.com/labelflow/labelflow/pull/334)
- Add blog to website [`#340`](https://github.com/labelflow/labelflow/pull/340)
- Feature/#299 add slugs [`#339`](https://github.com/labelflow/labelflow/pull/339)
- Feature/google analytics dashboard [`#333`](https://github.com/labelflow/labelflow/pull/333)
- Rename projects to datasets [`#336`](https://github.com/labelflow/labelflow/pull/336)
- Merge app and website [`#332`](https://github.com/labelflow/labelflow/pull/332)
- Export images along with labels [`#318`](https://github.com/labelflow/labelflow/pull/318)
- feature/#312-custom-endpoint [`#324`](https://github.com/labelflow/labelflow/pull/324)
- User arrives on labelling interface on first connection [`#322`](https://github.com/labelflow/labelflow/pull/322)
- Edit label class name from projects page [`#319`](https://github.com/labelflow/labelflow/pull/319)
- Node.js backend poc [`#321`](https://github.com/labelflow/labelflow/pull/321)
- Research/repository [`#302`](https://github.com/labelflow/labelflow/pull/302)
- Add label coordinates in coco export [`#309`](https://github.com/labelflow/labelflow/pull/309)
- Update export modal to display the number of images [`#310`](https://github.com/labelflow/labelflow/pull/310)
- Update service worker modal interaction [`#306`](https://github.com/labelflow/labelflow/pull/306)
- Project delete [`#279`](https://github.com/labelflow/labelflow/pull/279)
- Reset selectedLabelClassId when projectId changes [`#304`](https://github.com/labelflow/labelflow/pull/304)
- Feature/#251 polygon labels [`#275`](https://github.com/labelflow/labelflow/pull/275)
- Fix: cannot edit label after refreshing the labelling page [`#305`](https://github.com/labelflow/labelflow/pull/305)
- Ignore strapi folder in lint job [`#303`](https://github.com/labelflow/labelflow/pull/303)
- Feature/#281 create the classes page [`#289`](https://github.com/labelflow/labelflow/pull/289)
- Fix lint issues in worker file [`#298`](https://github.com/labelflow/labelflow/pull/298)
- Remove workbox logs in dev [`#297`](https://github.com/labelflow/labelflow/pull/297)
- Put image gallery page under tab [`#288`](https://github.com/labelflow/labelflow/pull/288)
- Integrate projects to the app [`#269`](https://github.com/labelflow/labelflow/pull/269)
- Enhance optimistic response for label creation and update [`#286`](https://github.com/labelflow/labelflow/pull/286)
- Fix css preventing to scroll in modal body on small resolutions [`#277`](https://github.com/labelflow/labelflow/pull/277)
- Feature/#212 resize bounding box [`#241`](https://github.com/labelflow/labelflow/pull/241)
- Fixes graphql imports and fast refresh on some pages [`#276`](https://github.com/labelflow/labelflow/pull/276)
- Refactor bounding box [`#270`](https://github.com/labelflow/labelflow/pull/270)
- Feature/#96 edit project name [`#273`](https://github.com/labelflow/labelflow/pull/273)
- Feature/#176 change the coco export [`#271`](https://github.com/labelflow/labelflow/pull/271)
- Project gallery [`#265`](https://github.com/labelflow/labelflow/pull/265)
- Refactor Service worker + Image storage [`#263`](https://github.com/labelflow/labelflow/pull/263)
- Improve e2e tests [`#266`](https://github.com/labelflow/labelflow/pull/266)
- Fix class search bind with "/" [`#267`](https://github.com/labelflow/labelflow/pull/267)
- Fix breadcrumb ellipsis on really small screens [`#256`](https://github.com/labelflow/labelflow/pull/256)
- Move Coco code around [`#255`](https://github.com/labelflow/labelflow/pull/255)
- Debug page [`#253`](https://github.com/labelflow/labelflow/pull/253)
- Feature/modal project [`#248`](https://github.com/labelflow/labelflow/pull/248)
- Feature/seo [`#250`](https://github.com/labelflow/labelflow/pull/250)
- Navbar Logo navigates to root [`#249`](https://github.com/labelflow/labelflow/pull/249)
- Add right click possibility when using the draw interaction [`#231`](https://github.com/labelflow/labelflow/pull/231)
- Bug/welcome modal [`#247`](https://github.com/labelflow/labelflow/pull/247)
- Fix a bug where it was impossible to right click overlapping features [`#242`](https://github.com/labelflow/labelflow/pull/242)
- Feature/better bundle analyze [`#244`](https://github.com/labelflow/labelflow/pull/244)
- Update welcome modal [`#235`](https://github.com/labelflow/labelflow/pull/235)
- Fix for safari [`#232`](https://github.com/labelflow/labelflow/pull/232)
- Feature/#206 deterministic import [`#218`](https://github.com/labelflow/labelflow/pull/218)
- Add retries to cypress [`#229`](https://github.com/labelflow/labelflow/pull/229)
- Feature/cookie for first visit & error management [`#220`](https://github.com/labelflow/labelflow/pull/220)
- Feature/#202 esc cancel drawing [`#217`](https://github.com/labelflow/labelflow/pull/217)
-  Fix bug preventing image name to be displayed [`#221`](https://github.com/labelflow/labelflow/pull/221)
- Add optimistic response on bounding box creation and deletion [`#224`](https://github.com/labelflow/labelflow/pull/224)
- bundle analyzer [`#213`](https://github.com/labelflow/labelflow/pull/213)
- Fix labels not updating in the export modal [`#223`](https://github.com/labelflow/labelflow/pull/223)
- Resize bounding boxes to fit in the image and disable its creation if it is outside the image [`#215`](https://github.com/labelflow/labelflow/pull/215)
- Feature/#54 kb shortcut class selection [`#189`](https://github.com/labelflow/labelflow/pull/189)
- Clear selected label when changing current image [`#216`](https://github.com/labelflow/labelflow/pull/216)
- Fix bug preventing to select a feature in another feature [`#194`](https://github.com/labelflow/labelflow/pull/194)
- Center modals [`#211`](https://github.com/labelflow/labelflow/pull/211)
- Fix a bug that prevent to unzoom openlayers when zooming the browser [`#214`](https://github.com/labelflow/labelflow/pull/214)
- `"c"` key shortcut to change class [`#183`](https://github.com/labelflow/labelflow/pull/183)
- Implements crud of project entity [`#193`](https://github.com/labelflow/labelflow/pull/193)
- Bug/fix blinking labels [`#190`](https://github.com/labelflow/labelflow/pull/190)
- Add gallery component [`#179`](https://github.com/labelflow/labelflow/pull/179)
- Integrate label class selection menu [`#182`](https://github.com/labelflow/labelflow/pull/182)
- Change style of guides [`#177`](https://github.com/labelflow/labelflow/pull/177)
- Edit label class on right click [`#145`](https://github.com/labelflow/labelflow/pull/145)
- Control automatic modal states with query params [`#174`](https://github.com/labelflow/labelflow/pull/174)
- Add VS Code tasks [`#171`](https://github.com/labelflow/labelflow/pull/171)
- Manage image zoom [`#173`](https://github.com/labelflow/labelflow/pull/173)
- Feature/#74 export modal [`#165`](https://github.com/labelflow/labelflow/pull/165)
- Feature/home page [`#166`](https://github.com/labelflow/labelflow/pull/166)
- Add cursor guides when user is drawing a box [`#164`](https://github.com/labelflow/labelflow/pull/164)
- Change cursor depending on selected tool and hovered element [`#168`](https://github.com/labelflow/labelflow/pull/168)
- Robustify database in service worker [`#167`](https://github.com/labelflow/labelflow/pull/167)
- Add keyboard shortcut to select the bounding box tool [`#159`](https://github.com/labelflow/labelflow/pull/159)
- useQueryParams for import modal [`#157`](https://github.com/labelflow/labelflow/pull/157)
- Clear the undoredo store on image change [`#163`](https://github.com/labelflow/labelflow/pull/163)
- Allow schema introspection on apollo-server [`#162`](https://github.com/labelflow/labelflow/pull/162)
- Remove useless console logs [`#158`](https://github.com/labelflow/labelflow/pull/158)
- Select Bounding box and Delete label [`#143`](https://github.com/labelflow/labelflow/pull/143)
- Adding a button to close the import modal when all images are done up… [`#152`](https://github.com/labelflow/labelflow/pull/152)
- Bug/undo error [`#150`](https://github.com/labelflow/labelflow/pull/150)
- Add graphiql route on the web app [`#149`](https://github.com/labelflow/labelflow/pull/149)
- Bug/disappearing labels [`#151`](https://github.com/labelflow/labelflow/pull/151)
- Service Worker in webapp [`#113`](https://github.com/labelflow/labelflow/pull/113)
- Implement undo and redo actions for bounding box creation [`#134`](https://github.com/labelflow/labelflow/pull/134)
- Quality/#138 refactor labelling tool to fetch images [`#142`](https://github.com/labelflow/labelflow/pull/142)
- Class selection menu [`#141`](https://github.com/labelflow/labelflow/pull/141)
- Feature/upload as told by server [`#139`](https://github.com/labelflow/labelflow/pull/139)
- Standard upload [`#123`](https://github.com/labelflow/labelflow/pull/123)
- Feature/#76 export coco [`#137`](https://github.com/labelflow/labelflow/pull/137)
- Add DrawingTool component [`#117`](https://github.com/labelflow/labelflow/pull/117)
- Feature/#52 Class selection popover [`#89`](https://github.com/labelflow/labelflow/pull/89)
- update and delete labels resolvers [`#129`](https://github.com/labelflow/labelflow/pull/129)
- Quality/db types [`#127`](https://github.com/labelflow/labelflow/pull/127)
- Update feature_request.md [`#128`](https://github.com/labelflow/labelflow/pull/128)
- Create a helper to setup local database in tests [`#122`](https://github.com/labelflow/labelflow/pull/122)
- Check dependencies between issues once an hour only [`#121`](https://github.com/labelflow/labelflow/pull/121)
- Update dependent-issues.yml [`#120`](https://github.com/labelflow/labelflow/pull/120)
- Trying another syntax for every 5 minutes... [`#119`](https://github.com/labelflow/labelflow/pull/119)
- Update cron time of dependent issues script [`#118`](https://github.com/labelflow/labelflow/pull/118)
- Feature/#51 class entity [`#86`](https://github.com/labelflow/labelflow/pull/86)
- Zustand and undo middleware [`#90`](https://github.com/labelflow/labelflow/pull/90)
- Feature/labelling component [`#111`](https://github.com/labelflow/labelflow/pull/111)
- Feature/#31 crud label [`#84`](https://github.com/labelflow/labelflow/pull/84)
- Add keymap to top bar [`#107`](https://github.com/labelflow/labelflow/pull/107)
- Create drawing toolbar and factor nav toolbar [`#108`](https://github.com/labelflow/labelflow/pull/108)
- Create SECURITY.md [`#105`](https://github.com/labelflow/labelflow/pull/105)
- Create dependent-issues.yml [`#103`](https://github.com/labelflow/labelflow/pull/103)
- Update issue templates [`#93`](https://github.com/labelflow/labelflow/pull/93)
- keyboard shortcut previous next image [`#88`](https://github.com/labelflow/labelflow/pull/88)
- Feature/visualize image openlayers [`#83`](https://github.com/labelflow/labelflow/pull/83)
- Add import button into top bar [`#61`](https://github.com/labelflow/labelflow/pull/61)
- Image navigation [`#81`](https://github.com/labelflow/labelflow/pull/81)
- Enhancement/replace localforage with dexie [`#71`](https://github.com/labelflow/labelflow/pull/71)
- Fix image upload on test-images [`#82`](https://github.com/labelflow/labelflow/pull/82)
- Import React openlayers fiber [`#22`](https://github.com/labelflow/labelflow/pull/22)
- Add a Layout component with a Topbar component containing the logo [`#60`](https://github.com/labelflow/labelflow/pull/60)
- Add yarn script to check if codegen generate some diff [`#69`](https://github.com/labelflow/labelflow/pull/69)
- Enhancement/fix dependencies [`#19`](https://github.com/labelflow/labelflow/pull/19)
- Remove global dependency of storybook on chakra [`#68`](https://github.com/labelflow/labelflow/pull/68)
- Fix path to yarn.lock in github cache action [`#67`](https://github.com/labelflow/labelflow/pull/67)
- Create ImportImagesModal component [`#24`](https://github.com/labelflow/labelflow/pull/24)
- Store files in localForage [`#37`](https://github.com/labelflow/labelflow/pull/37)
- Fix yarn cache in CI [`#4`](https://github.com/labelflow/labelflow/pull/4)
- Add image CRUD (read, list and create) [`#36`](https://github.com/labelflow/labelflow/pull/36)
- Add cypress dashboard [`#49`](https://github.com/labelflow/labelflow/pull/49)
- CI improvements  [`#46`](https://github.com/labelflow/labelflow/pull/46)
- Update from feature/python-lint [`#40`](https://github.com/labelflow/labelflow/pull/40)
- Feature/enforce clean project management [`#38`](https://github.com/labelflow/labelflow/pull/38)
- Feature/#14 graphql server [`#23`](https://github.com/labelflow/labelflow/pull/23)
- Vercel github action [`#25`](https://github.com/labelflow/labelflow/pull/25)
- Small lint fix [`#21`](https://github.com/labelflow/labelflow/pull/21)
- Install storybook in the web-app package [`#20`](https://github.com/labelflow/labelflow/pull/20)
- Feature/client side graphql [`#11`](https://github.com/labelflow/labelflow/pull/11)
- merge website [`#5`](https://github.com/labelflow/labelflow/pull/5)
- Feature/docker python [`#3`](https://github.com/labelflow/labelflow/pull/3)
- Yarn v2 [`#2`](https://github.com/labelflow/labelflow/pull/2)
- Init labelflow project and labelflow web app [`#1`](https://github.com/labelflow/labelflow/pull/1)

This Changelog is generated using [`auto-changelog`](https://github.com/CookPete/auto-changelog).
