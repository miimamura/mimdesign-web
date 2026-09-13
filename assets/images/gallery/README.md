# ここに画像を置いてください（受け渡し用）

チャット添付が届かないため、このフォルダ経由で受け渡します。

## 手順

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
