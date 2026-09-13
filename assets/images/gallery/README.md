# ここに画像を置いてください（受け渡し用）

チャット添付も、**コミットへのコメント添付も届きません。**
コメント添付は `github.com/user-attachments/...` に保存され、
セッションのプロキシが `repos/{owner}/{repo}/...` 配下しか通さないため 403 になります。
**リポジトリ内のファイルとして置く**必要があります。

## いちばん簡単な方法（ブラウザだけ）

このリポジトリはデフォルトブランチが作業ブランチなので、ブランチ切り替えは不要です。

<https://github.com/miimamura/mimdesign-web/upload/claude/portfolio-images-inventory-f8k8j0/assets/images/gallery>

を開いて画像をドラッグ＆ドロップ → ページ下の **Commit changes** を押すだけです。
リンクが開けない場合は、リポジトリのトップから `assets` → `images` → `gallery` と辿り、
右上の **Add file ▾ → Upload files** を選んでください。

## コマンドで行う場合

```bash
git clone -b claude/portfolio-images-inventory-f8k8j0 https://github.com/miimamura/mimdesign-web.git
cd mimdesign-web
# このフォルダ（assets/images/gallery/）に画像を入れる
git add assets/images/gallery
git commit -m "add: 画像"
git push
```

push したら「置いた」と伝えてください。こちらで内容を見て判別し、WebP 化・配置まで行います。

## ファイル名

**何でも構いません**（`01.png` のような連番で結構です）。中身を見て判別します。
日本語のファイル名だけ避けてください（環境によって文字化けするため）。

## 置いた画像がどこへ行くか

| 画像の内容 | 配置先 |
|---|---|
| VANILLABEANS の販促制作物（ギフト特集・キャンペーン・ストーリーページ等） | `case.html` 第2幕のギャラリー（ブリーフ §5.4） |
| プチギフトバッグ（ミニバッグ）の商品写真 | `case.html` 3-2「プチギフトバッグ｜新規獲得の設計」 |
| コーポレートサイトのモックアップ | `work-corporate.html` の本文画像 |
| 案件サイトの追加キャプチャ（下層ページ等） | 各案件の詳細ページ |

## 補足

- 元データのまま置いてください。**リサイズ・圧縮はこちらで行います**（現状 PNG 1.2〜1.6MB → WebP 40〜60KB 程度になります）
- このフォルダは受け渡し用です。配置が済んだら整理します

## 処理済み（2026-09-13）

| 置かれたファイル | 配置先 |
|---|---|
| `pc_short.jpg` | `case.html` 第2幕ギャラリー（ブランドサイト） |
| `pc_short 11.03.28.jpg` | `case.html` 第2幕ギャラリー（観戦チケットキャンペーン） |
| `20231113_35828final.jpg` | `case.html` 3-2（プチギフトバッグの商品写真） |
| `pc_short_vd.jpg` | `case.html` 第3幕ギャラリー（Valentine's Day 2023） |
| `pc_short_wd.jpg` | `case.html` 第3幕ギャラリー（Spring Gift Collection 2023） |

支給5点はすべて配置済みです。

2023年と印字されている2点は、第2幕（2015-2020）の見出しの下だと年代が合わないため、
第3幕（2021-2024）に別のギャラリーとして置いています。

### まだ足りていないもの

- コーポレートサイトのフルモックアップ（`work-corporate.html` の本文用）
- 各案件サイトの下層ページキャプチャ
