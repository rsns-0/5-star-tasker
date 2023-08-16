import {deepLResponseSchema} from "./deepL"
import { z } from "zod";

export type DeepLData = z.infer<typeof deepLResponseSchema>