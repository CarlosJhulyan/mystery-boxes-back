import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import { env } from '@/config/env';

const client = new MercadoPagoConfig({ accessToken: env.MP_ACCESS_TOKEN });
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

export interface PreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: 'PEN';
}

export interface PreferencePayer {
  email: string;
  name: string;
}

export interface CreatePreferenceResult {
  init_point: string;
  sandbox_init_point: string;
  preference_id: string;
}

export interface PaymentStatusResult {
  status: string;
  status_detail: string;
  external_reference: string | null;
}

/**
 * Crea una preference de MercadoPago Checkout Pro.
 */
export async function createPreference(
  items: PreferenceItem[],
  payer: PreferencePayer,
  orderId: string
): Promise<CreatePreferenceResult> {
  const response = await preferenceClient.create({
    body: {
      // any cast: MP SDK v3 Items type requires 'id', but it's not enforced at runtime
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id,
      })) as any,
      payer: {
        email: payer.email,
        name: payer.name,
      },
      external_reference: orderId,
      back_urls: {
        success: `${env.FRONTEND_URL}/payment/success`,
        failure: `${env.FRONTEND_URL}/payment/failure`,
        pending: `${env.FRONTEND_URL}/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${env.BACKEND_URL}/api/v1/payments/webhook`,
    },
  });

  return {
    init_point: response.init_point ?? '',
    sandbox_init_point: response.sandbox_init_point ?? '',
    preference_id: response.id ?? '',
  };
}

/**
 * Obtiene el estado de un pago de MercadoPago por su ID.
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
  // El SDK v2 espera un objeto con id como número o string según la versión
  const response = await paymentClient.get({ id: paymentId } as any);

  return {
    status: (response as any).status ?? 'unknown',
    status_detail: (response as any).status_detail ?? '',
    external_reference: (response as any).external_reference ?? null,
  };
}
