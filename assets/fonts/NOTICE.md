# 同梱フォントについて

## Jost

- ファイル：`jost-latin-var.woff2`（可変フォント／weight 400–700／latin サブセット／26KB）
- 制作：indestructible type*
- ライセンス：**SIL Open Font License 1.1**（再配布・ウェブ埋め込みともに許諾されている）
- 入手元：Google Fonts（`https://fonts.gstatic.com/s/jost/v20/92zatBhPNqw73oTd4g.woff2`）
- 上流：https://github.com/indestructible-type/Jost

### 自ホストにした理由

ブリーフ §4.2 が Jost を**数字とナビゲーションに限定**しているため、
`unicode-range` を数字に絞った `@font-face` を自前で宣言する必要がある。
Google Fonts が配信する CSS は `unicode-range` が固定で上書きできないため、フォントファイルを自ホストしている。

同じ1ファイルを2つのファミリー名で宣言している（`assets/css/style.css` 冒頭）。

| ファミリー名 | unicode-range | 用途 |
|---|---|---|
| `Jost` | 既定（latin 全体） | グローバルナビ |
| `JostNum` | `U+0025,U+002C,U+002E,U+0030-0039` | 本文中の数字・カンマ・小数点・% |

`JostNum` を本文のフォントスタック先頭に置くことで、**和文の中の数字だけが自動的に Jost になる。**
個別に `span` で囲む必要がないため、原稿を追記しても運用側の判断が発生しない。

### ライセンスの同梱（対応済み）

OFL 1.1 は、フォントを再配布する際にライセンス全文を同梱することを求めている。
上流リポジトリから取得して、このディレクトリに置いた。

| ファイル | 内容 |
|---|---|
| `OFL.txt` | 著作権表示 ＋ SIL Open Font License 1.1 全文（83行） |
| `AUTHORS.txt` | 著作者表示（indestructible type*） |

**この2ファイルは削除しないこと。** フォントファイルを配布する限り同梱が必要。

## Noto Sans JP

自ホストしていない。Google Fonts の CDN から読み込んでいる（`index.html`）。
和文フォントは全体で数 MB あり、Google 側が約 120 の `unicode-range` サブセットに分割して
必要な分だけ配信するため、自ホストより CDN のほうが軽い。
