# mimdesign-web

今村美紗（Mim.design）ポートフォリオサイト。

既存のサービスサイト `mimdesign.site` とは**別物**。あちらは地域の小規模事業者向けの営業用、
こちらは業務委託案件の獲得を目的とした、発注側が判断材料として読むサイト。

## 現在の状態

**4ページ構成。** 静的 HTML/CSS のみ。ビルド不要、JavaScript なし。

| ページ | 内容 | 高さ(375px) |
|---|---|---|
| `index.html` | FV / できること / 制作実績 / 成果とヒストリー / プロフィール | 7.5画面 |
| `case.html` | VANILLABEANS 11年 全文＋目次＋図2点 | 13.3画面 |
| `now-saas.html` | 製造業向け BtoB SaaS | 7.0画面 |
| `now-medication.html` | BtoC 服薬管理アプリ | 5.4画面 |
| `work-farm.html` | 農園サイトリニューアル | 6.3画面 |
| `work-corporate.html` | コーポレートサイト制作 | 3.9画面 |
| `works.html` | 制作実績6本（治療院は非表示中）／詳細ページの親 | 5.6画面 |
| `approach.html` | 仕組みを渡して、手を離す | 5.5画面 |

トップは**ハブ**。長文は3つの下層ページに置き、トップには要点と数字だけ残している。

| # | セクション | 状態 |
|---|---|---|
| 1 | FV | 実装済み |
| 2 | Capability | 実装済み |
| 3 | Case Study（VANILLABEANS 11年） | 実装済み |
| 4 | 現在の領域（製造業 SaaS ／ 服薬管理アプリ） | 実装済み |
| 5 | About | 実装済み |

**未着手：** ケーススタディ第2幕のギャラリー（VANILLABEANS 販促9点が未取得）。

## 構成

```
index.html                  トップ（ハブ）。ビルド工程なし
case.html                   ケーススタディ全文＋目次
work-farm.html              農園サイトリニューアル
work-corporate.html         コーポレートサイト制作
now-saas.html               製造業向け BtoB SaaS
now-medication.html         BtoC 服薬管理アプリ
works.html                  制作実績一覧
approach.html               進め方
assets/
  css/style.css             トークン → ベース → 部品 → セクション の順
  fonts/
    jost-latin-var.woff2    Jost 可変（自ホスト）
    OFL.txt / AUTHORS.txt   ライセンス全文と著作者表示（削除しないこと）
    NOTICE.md               自ホストの理由と仕組み
  images/
    fv/                     FV 背景（WebP・48KB）
    brand/                  ロゴ（白＝暗部用／紺＝予備）、favicon
    about/                  プロフィール写真
    works/                  案件画像。<slug>.webp=モックアップ（元）
                            <slug>-screen.webp=画面の切り出し（ページで使用）
    now/                    SaaS・服薬セクションの図
    case/                   会員制度の3層図
docs/
  image-inventory.md        画像資産の棚卸し
  design-plan.md            カラー・タイポ・レイアウト方針
  layout-phase1.md          第1弾の詳細レイアウト仕様
  copy-draft-phase1.md      Capability / About の原稿
```

**docs/ は仕様と実装を一致させてある。** CSS を変えたら該当ドキュメントも直すこと。

## ローカルで見る

フォントは CORS 前提で読み込まれるため、**`file://` で開くと自ホストの Jost が読めない。**
必ず HTTP で配信すること。

```
python3 -m http.server 8000
# http://127.0.0.1:8000/
```

## 設計上、動かすと壊れるもの

| 箇所 | 理由 |
|---|---|
| `.fv h1` の `min(50px, calc((100vw - 32px) / 14.2))` | §3.1「スマホで1行」を満たす上限。**字間を緩めると折り返す**（現在 -.02em 前提）。12幅で検証済み |
| `--measure: 752px`（本文 720px） | 17px × 42文字。§4.3 の「40〜45文字」から出た値 |
| `--ink` `#0B1E5B` / `--paper-alt` `#F1F4F9` | 既存サイトからの継承値。変えると別ブランドに見える |
| 紺を面に使わないのは**本文側だけ** | FV とフッターは既存サイトと共通の暗部。差別化は本文の組み方で取る（`docs/design-plan.md` §7.2） |
| セクションの地色の並び | 装飾ではなく区分け。`now.html` で SaaS と服薬を別の地に置き、2本の切れ目を示している |
| `.wrap--wide`（992px）| 制作実績だけ本文幅を外している。「見る」セクションに行長ルールを当てない |
| `JostNum` の `unicode-range` | 数字だけを Jost にする仕組み。広げると和文中の英単語まで Jost になる |
| 「現在」ブロックの前32px / 後120px | 「つくった」で終わらず「残った」で終わる構造を余白で表している |
| `.stair` の `align-items: start` | `end` にすると段差が打ち消されて階段にならない |
| 制作実績の「現在進行中」を先頭に置くこと | Web サイト案件と並列にすると、いま一番見せたい領域が埋もれる（ブリーフの制作メモの警告） |
| 図の塗りが `--ink` の 7% であること | `--paper-alt` にすると `section--alt` の上で消える |
| `.fig-hide-sm` | モバイルで入りきらない図のラベルを隠す。情報は本文にある |
| 479px 以下のヘッダー折り返し | ナビ4項目とロゴが1行に収まらず、ロゴが 32px まで潰れる |
| `assets/fonts/OFL.txt` / `AUTHORS.txt` | OFL 1.1 が再配布時の同梱を義務づけている |
| `.work-brief` の `auto-fit` | 案件を1本抜いても列の枠が空かないようにするため |
| now-saas / now-medication の相互リンク | 2本セットで読ませる設計（制作メモ）を分割後も保つための装置 |
| 詳細ページのパンくずと戻り導線 | works.html を親とする階層を往復ともつなぐため |
| FV の職種行が白であること | 淡い青だと背景が中間調のため 4.04:1 で AA 未達になる |

詳細は `docs/design-plan.md` と `docs/layout-phase1.md`。

## 未確定

- ドメイン・ホスティング先
- Contact は**置かない方針で決着**（エージェント経由が前提のため）
- 介護・福祉とファッション EC アプリの説明文・画像（同 §8.4）
- 案件の追加キャプチャ。実サイトに到達できないため本人提供が必要（`docs/design-plan.md` §9.5）
- **SaaS の画像は公開前にクライアント確認を推奨**（§8 の守秘条件。同 §13.2）
- **ヘッダー／フッターが4ページに重複している。Astro 等への移行を検討する段階**（ブリーフ §7）
- トップから長文が外れたぶん、読ませる力は下がっている（`docs/design-plan.md` §10.6）
