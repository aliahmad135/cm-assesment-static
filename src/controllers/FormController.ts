import { User, UserFormData } from "../models/User.js";
import { FormValidator } from "../validators/FormValidator.js";
import { SupabaseService } from "../services/SupabaseService.js";

export class FormController {
  private validator: FormValidator;
  private supabaseService: SupabaseService;
  private currentStep: number = 1;
  private formData: Partial<UserFormData> = {};

  constructor(validator: FormValidator, supabaseService: SupabaseService) {
    this.validator = validator;
    this.supabaseService = supabaseService;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  async validateAndAdvance(
    data: Partial<UserFormData>
  ): Promise<{ success: boolean; errors: string[] }> {
    if (this.currentStep === 1) {
      const result = this.validator.validateStep1(data);
      if (result.isValid) {
        this.formData = { ...this.formData, ...data };
        this.currentStep = 2;
        return { success: true, errors: [] };
      }
      return { success: false, errors: result.errors };
    }

    return { success: false, errors: ["Invalid step"] };
  }

  async validateAndSubmit(
    data: Partial<UserFormData>
  ): Promise<{ success: boolean; errors: string[]; userId?: string }> {
    const result = this.validator.validateStep2(data);
    if (!result.isValid) {
      return { success: false, errors: result.errors };
    }

    const completeData = { ...this.formData, ...data } as UserFormData;

    try {
      const user = User.fromFormData(completeData);
      const { userId } = await this.supabaseService.submitRegistration(user);
      return { success: true, errors: [], userId };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Submission failed";
      return { success: false, errors: [message] };
    }
  }

  getFormData(): Partial<UserFormData> {
    return { ...this.formData };
  }
}
