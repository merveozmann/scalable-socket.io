const { register, login, getAllUsers ,getUserDetail} = require("../controller/userController");

const router = require("express").Router();

router.post("/register",register);
router.post("/login",login);
router.get("/allusers/:id",getAllUsers);
router.get("/getuserdetail/:id",getUserDetail);


module.exports=router;