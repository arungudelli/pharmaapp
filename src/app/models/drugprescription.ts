import { Drug } from "./drug";
import { DrugUsageInfo } from "./DrugUsageInfo";

export interface DrugPrescription {
    drug: Drug;
    drugUsage: DrugUsageInfo
}