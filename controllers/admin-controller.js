// const db=require('../models')
// const Restaurant=db.Restaurant
const { Restaurant } = require("../models");

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true, //把 Sequelize 包裝過的一大包物件轉換成格式比較單純的 JS 原生物件
    })
      .then((restaurants) => res.render("admin/restaurants", { restaurants }))
      .catch((err) => next(err));
  },
  createRestaurant: (req, res) => {
    return res.render("admin/create-restaurant");
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body; // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error("Restaurant name is required!"); // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示。即使前端有required，但前後端分離，後端必須自己也要控管。throw 讓我們可以在程式出錯時，終止執行此區塊的程式碼，並拋出客製化的錯誤訊息。
    Restaurant.create({
      //產生一個新的 Restaurant 物件實例，並存入資料庫
      name,
      tel,
      address,
      openingHours,
      description,
    })
      .then(() => {
        req.flash("success_messages", "restaurant was successfully created!"); // 在畫面顯示成功提示
        res.redirect("/admin/restaurants"); //新增完成後導回後台首頁
      })
      .catch((err) => next(err));
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, {
      //去資料庫用 id(PK) 找一筆資料
      raw: true, // 換成格式比較單純的 JS 原生物件
    })
      .then((restaurant) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!"); //  如果找不到，回傳錯誤訊息，後面不執行
        res.render("admin/restaurant", { restaurant });
      })
      .catch((err) => next(err));
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
    })
      .then((restaurant) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!");
        res.render("admin/edit-restaurant", { restaurant });
      })
      .catch((err) => next(err));
  },
  putRestaurant: (req, res, next) => {
    //用Sequelize的物件才有update語法，raw則沒
    const { name, tel, address, openingHours, description } = req.body;
    if (!name) throw new Error("Restaurant name is required!");
    Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!");
        return restaurant.update({
          name,
          tel,
          address,
          openingHours, //根據models所寫的，而不是sql資料庫的
          description,
        });
      })
      .then(() => {
        req.flash("success_messages", "restaurant was successfully to update");
        res.redirect("/admin/restaurants");
      })
      .catch((err) => next(err));
  },
};

module.exports = adminController;
