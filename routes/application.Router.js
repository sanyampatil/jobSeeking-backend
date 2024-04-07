import express from 'express'
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication
} from '../controllers/applicationController.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/post', isAuthenticated, postApplication)
router.delete('/delete/:id', isAuthenticated, jobseekerDeleteApplication)
router.get('/jobseeker/getall', isAuthenticated, jobseekerGetAllApplications)
router.get('/employer/getall', isAuthenticated, employerGetAllApplications)

export default router
