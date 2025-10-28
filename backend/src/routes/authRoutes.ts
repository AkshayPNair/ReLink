import express from "express"
import { AuthController } from "../controllers/authController.js"
import { UserRepository } from "../repositories/userRepository.js"
import { AuthService } from "../services/authService.js"

const router=express.Router()
const userRepository = new UserRepository()

const authService=new AuthService(userRepository)

const authController=new AuthController(authService)

router.post("/register",(req,res,next)=>authController.register(req,res, next))
router.post("/login",(req,res,next)=>authController.login(req,res,next))
router.post("/refresh",(req,res,next)=>authController.refresh(req,res,next))

export default router