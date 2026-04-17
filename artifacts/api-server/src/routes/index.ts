import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import companiesRouter from "./companies";
import applicationsRouter from "./applications";
import categoriesRouter from "./categories";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(companiesRouter);
router.use(applicationsRouter);
router.use(categoriesRouter);
router.use(statsRouter);

export default router;
