import express from 'express'
import { UrlController } from "../controllers/urlController.js";
import { UrlRepository } from "../repositories/urlRepository.js";
import { UrlService } from "../services/urlService.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router()


const urlRepository = new UrlRepository()
const urlService= new UrlService(urlRepository)
const urlController= new UrlController(urlService)

router.post("/shorten",authMiddleware,(req,res,next)=>urlController.createShortUrl(req,res,next))
router.get("/my-urls",authMiddleware,(req,res,next)=>urlController.getUserUrls(req,res,next))
router.get("/:shortId",(req,res,next)=>urlController.redirect(req,res,next))

export default router