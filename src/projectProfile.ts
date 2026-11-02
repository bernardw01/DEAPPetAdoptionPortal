export type DeliveryStage = "Build" | "Validate" | "Ship" | "Deploy"

export const deliveryStages: DeliveryStage[] = ["Build", "Validate", "Ship", "Deploy"]

export function isExternalAction(stage: DeliveryStage): boolean {
  return stage === "Ship" || stage === "Deploy"
}
