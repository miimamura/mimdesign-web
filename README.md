# mimdesign-web

今村美紗（Mim.design）ポートフォリオサイト。

既存のサービスサイト `mimdesign.site` とは**別物**。あちらは地域の小規模事業者向けの営業用、
こちらは業務委託案件の獲得を目的とした、発注側が判断材料として読むサイト。

## 現在の状態

**2ページ構成。** 静的 HTML/CSS のみ。ビルド不要、JavaScript なし。

| ページ | 内容 |
|---|---|
| `index.html` | FV / Capability / Case Study / 現在の領域 / 制作実績への導線 / About |
| `works.html` | 制作実績6本（メイン4本＋別枠2本） |

| # | セクション | 状態 |
|---|---|---|
| 1 | FV | 実装済み |
| 2 | Capability | 実装済み |
| 3 | Case Study（VANILLABEANS 11年） | 実装済み |
| 4 | 現在の領域（製造業 SaaS ／ 服薬管理アプリ） | 実装済み |
| 5 | About | 実装済み |

**未着手：** Approach セクション、自作図3点、ケーススタディ第2幕のギャラリー。

## 構成

```
index.html                  トップ。ビルド工程なし
works.html                  制作実績一覧
assets/
  css/style.css             トークン → ベース → 部品 → セクション の順
  fonts/
    jost-latin-var.woff2    Jost 可変（自ホスト）／NOTICE.md にライセンス
  images/
    fv/                     FV 背景（WebP・48KB）
    brand/                  ロゴ（白＝暗部用／紺＝予備）、favicon
    about/                  プロフィール写真
    works/                  案件画像4点（works.html で使用）
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
| セクションの地色の並び | 装飾ではなく区分け。SaaS と服薬を同じ地に置いて「2本で1領域」に見せている |
| `JostNum` の `unicode-range` | 数字だけを Jost にする仕組み。広げると和文中の英単語まで Jost になる |
| 「現在」ブロックの前32px / 後120px | 「つくった」で終わらず「残った」で終わる構造を余白で表している |

詳細は `docs/design-plan.md` と `docs/layout-phase1.md`。

## 未確定

- ドメイン・ホスティング先
- Contact（不採用。連絡手段がページ上にない。`docs/layout-phase1.md` §4.5 参照）
- 介護・福祉とファッション EC アプリの説明文・画像（`docs/design-plan.md` §8.4）
- ヘッダー／フッターが2ページに重複している。ページが増えるなら Astro 等の検討時期（ブリーフ §7）
