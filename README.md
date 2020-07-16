# star_line_bot_admin

透過Vue.js，使用AJAX與後端交互資料，提供一個界面供管理人員新增女星資料

[Demo](https://superj80820.github.io/projects/star_line_bot_admin)

<img src="https://imgur.com/fb25FIT.jpg" width="800">

## Node version

`10.11.0`

## 使用技術

* Vue.js: 採用Vue CLI架設SPA架構
* Element-ui: 透過這個組件庫來製作整體前端
* axios: 使用此套件來與後端API做交互
* vuex: 用來儲存對後端API索取的User token，以供不同View使用
* vue-lazyload: 讓圖片可以在滑動到時才載入，可以始大量圖片的頁面不一次載入，以增加效能
* vue-router: 控管不同頁面的路由

## 初始化專案

```
docker-compose run web npm install
```

## 開發

```
docker-compose up
```

## 參考

[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)