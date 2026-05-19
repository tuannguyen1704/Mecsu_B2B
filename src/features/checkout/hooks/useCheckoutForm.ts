import { useState, useCallback, useMemo, useEffect } from 'react';
import { CartItem } from '@features/cart';
import {
  CheckoutFormData,
  CheckoutFormErrors,
  CheckoutTotals,
  ShippingMethod,
} from '../types/checkout';
import { isValidEmail, isValidPhone } from '@utils/validators';

const STORAGE_KEY = 'mecsu_checkout_form';

export const INITIAL_FORM_DATA: CheckoutFormData = {
  fullName: '',
  phone: '',
  email: '',
  companyName: '',
  taxCode: '',
  needVatInvoice: false,
  vatCompanyName: '',
  vatTaxCode: '',
  vatAddress: '',
  vatEmail: '',
  province: '',
  district: '',
  ward: '',
  address: '',
  deliveryNote: '',
  shippingMethod: 'standard',
  paymentMethod: 'bank',
  poNumber: '',
  internalCode: '',
  purchaseNote: '',
  purchaseOrderFile: null,
};

/**
 * Hook for managing checkout form state and validation
 */
export function useCheckoutForm(items: CartItem[]) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saveAddressAsDefault, setSaveAddressAsDefault] = useState(false);

  // Calculate totals
  const totals = useMemo((): CheckoutTotals => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate shipping fee
    let shippingFee = 0;
    if (formData.shippingMethod === 'pickup') {
      shippingFee = 0;
    } else if (formData.shippingMethod === 'fast') {
      shippingFee = 45000;
    } else {
      // standard
      shippingFee = subtotal > 1000000 ? 0 : 35000;
    }

    // Check if business customer
    const isBusinessCustomer = Boolean(formData.companyName?.trim());
    const vatAmount = subtotal * 0.1;
    const b2bDiscount =
      isBusinessCustomer && subtotal > 5000000 ? subtotal * 0.05 : 0;
    const grandTotal = subtotal + shippingFee + vatAmount - b2bDiscount;

    return {
      subtotal,
      shippingFee,
      vatAmount,
      b2bDiscount,
      grandTotal,
    };
  }, [items, formData]);

  // Check if business customer
  const isBusinessCustomer = useMemo(
    () => Boolean(formData.companyName?.trim()),
    [formData.companyName]
  );

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...INITIAL_FORM_DATA, ...parsed, purchaseOrderFile: null });
      }
    } catch (e) {
      console.warn('Failed to load checkout form from storage');
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const { purchaseOrderFile, ...safeData } = formData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    } catch (e) {
      console.warn('Failed to save checkout form to storage');
    }
  }, [formData]);

  // Validate single field
  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case 'fullName':
          if (!value.trim()) return 'Vui lòng nhập họ tên';
          if (value.trim().length < 2) return 'Họ tên quá ngắn';
          return undefined;

        case 'phone':
          if (!value.trim()) return 'Vui lòng nhập số điện thoại';
          if (!isValidPhone(value))
            return 'Số điện thoại không hợp lệ (9-11 chữ số)';
          return undefined;

        case 'email':
          if (value && !isValidEmail(value)) return 'Email không hợp lệ';
          return undefined;

        case 'companyName':
          if (isBusinessCustomer && !value.trim())
            return 'Vui lòng nhập tên công ty';
          return undefined;

        case 'address':
          if (!value.trim()) return 'Vui lòng nhập địa chỉ chi tiết';
          return undefined;

        case 'vatCompanyName':
          if (formData.needVatInvoice && !value.trim())
            return 'Vui lòng nhập tên công ty trên hóa đơn';
          return undefined;

        default:
          return undefined;
      }
    },
    [isBusinessCustomer, formData.needVatInvoice]
  );

  // Update field value
  const updateField = useCallback(
    (name: keyof CheckoutFormData, value: any) => {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };

        // Clear dependent fields when province/district changes
        if (name === 'province') {
          newData.district = '';
          newData.ward = '';
        }
        if (name === 'district') {
          newData.ward = '';
        }

        return newData;
      });

      // Validate if field was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  // Handle field blur (mark as touched and validate)
  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, formData[name as keyof CheckoutFormData] as string || '');
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [formData, validateField]
  );

  // Touch all required fields for step
  const touchStepFields = useCallback(
    (stepNumber: number) => {
      if (stepNumber === 1) {
        const requiredFields = [
          'fullName',
          'phone',
          'province',
          'district',
          'ward',
          'address',
        ];
        if (isBusinessCustomer) {
          requiredFields.push('companyName');
        }

        const newTouched: Record<string, boolean> = {};
        requiredFields.forEach((f) => (newTouched[f] = true));
        setTouched(newTouched);

        return requiredFields.every((field) => {
          const error = validateField(
            field,
            formData[field as keyof CheckoutFormData] as string || ''
          );
          return !error;
        });
      }
      return true;
    },
    [formData, isBusinessCustomer, validateField]
  );

  // Check if step 1 is valid
  const isStep1Valid = useMemo(() => {
    const requiredFields = [
      'fullName',
      'phone',
      'province',
      'district',
      'ward',
      'address',
    ];
    if (isBusinessCustomer) {
      requiredFields.push('companyName');
    }

    for (const field of requiredFields) {
      const value = formData[field as keyof CheckoutFormData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        return false;
      }
    }

    // Check validation errors
    for (const field of requiredFields) {
      const error = validateField(
        field,
        formData[field as keyof CheckoutFormData] as string || ''
      );
      if (error) return false;
    }

    return true;
  }, [formData, isBusinessCustomer, validateField]);

  // Navigation
  const nextStep = useCallback(() => {
    if (step === 1) {
      if (!touchStepFields(1)) return;
    }
    if (step < 3) setStep(step + 1);
  }, [step, touchStepFields]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouched({});
    setStep(1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Auto-fill from user profile
  const autofillFromUser = useCallback(
    (
      user: {
        fullName: string;
        phone: string;
        email: string;
        defaultAddress?: {
          province: string;
          district: string;
          ward: string;
          streetAddress: string;
          deliveryNote: string;
        };
      }
    ) => {
      if (!user) return;

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        phone: prev.phone || user.phone,
        email: prev.email || user.email,
        province: prev.province || user.defaultAddress?.province || '',
        district: prev.district || user.defaultAddress?.district || '',
        ward: prev.ward || user.defaultAddress?.ward || '',
        address: prev.address || user.defaultAddress?.streetAddress || '',
        deliveryNote:
          prev.deliveryNote || user.defaultAddress?.deliveryNote || '',
      }));
    },
    []
  );

  return {
    // State
    step,
    formData,
    errors,
    touched,
    totals,
    isBusinessCustomer,
    isStep1Valid,
    saveAddressAsDefault,
    setSaveAddressAsDefault,

    // Actions
    updateField,
    handleBlur,
    nextStep,
    prevStep,
    resetForm,
    setFormData,
    setErrors,
    setStep,
    setTouched,
    autofillFromUser,
  };
}

export type UseCheckoutFormReturn = ReturnType<typeof useCheckoutForm>;
