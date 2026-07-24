/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that every payment provider adapter must satisfy.
 * Concrete adapters should extend this class (or at minimum implement all
 * methods with matching signatures).  Calling any method on the base class
 * directly throws, making missing implementations obvious at runtime.
 */
class PaymentAdapterInterface {
  /**
   * Initiate a payment session / order with the provider.
   *
   * @param {Object} params
   * @param {string} params.orderId        - Internal order identifier.
   * @param {number} params.amount         - Amount in the smallest currency unit (e.g. paise).
   * @param {string} params.currency       - ISO 4217 currency code (e.g. "INR").
   * @param {string} params.customerEmail  - Customer e-mail address.
   * @param {string} params.customerPhone  - Customer phone number.
   * @param {Object} [params.metadata]     - Arbitrary key/value pairs forwarded to the provider.
   *
   * @returns {Promise<{
   *   providerOrderId: string,
   *   providerSessionToken: string,
   *   redirectUrl: string|null,
   *   raw: Object
   * }>}
   */
  async initiatePayment(params) {
    throw new Error('PaymentAdapterInterface.initiatePayment() must be implemented by a concrete adapter.');
  }

  /**
   * Verify and capture a payment after the provider callback / webhook.
   *
   * @param {Object} params
   * @param {string} params.providerOrderId    - Provider-side order / session id.
   * @param {string} params.providerPaymentId  - Provider-side payment / transaction id.
   * @param {string} params.providerSignature  - Signature / hash supplied by the provider.
   * @param {Object} [params.metadata]         - Any extra fields forwarded by the provider.
   *
   * @returns {Promise<{
   *   success: boolean,
   *   status: string,
   *   providerPaymentId: string,
   *   raw: Object
   * }>}
   */
  async verifyPayment(params) {
    throw new Error('PaymentAdapterInterface.verifyPayment() must be implemented by a concrete adapter.');
  }

  /**
   * Fetch the current status of a payment from the provider.
   *
   * @param {Object} params
   * @param {string} params.providerOrderId - Provider-side order / session id.
   *
   * @returns {Promise<{
   *   status: string,
   *   amount: number,
   *   currency: string,
   *   raw: Object
   * }>}
   */
  async getPaymentStatus(params) {
    throw new Error('PaymentAdapterInterface.getPaymentStatus() must be implemented by a concrete adapter.');
  }

  /**
   * Initiate a refund for a previously captured payment.
   *
   * @param {Object} params
   * @param {string} params.providerPaymentId - Provider-side payment / transaction id.
   * @param {number} params.amount            - Amount to refund in the smallest currency unit.
   * @param {string} [params.reason]          - Human-readable refund reason.
   * @param {Object} [params.metadata]        - Arbitrary key/value pairs.
   *
   * @returns {Promise<{
   *   success: boolean,
   *   refundId: string,
   *   status: string,
   *   raw: Object
   * }>}
   */
  async initiateRefund(params) {
    throw new Error('PaymentAdapterInterface.initiateRefund() must be implemented by a concrete adapter.');
  }

  /**
   * Handle a raw webhook / callback payload from the provider and return a
   * normalised event object.
   *
   * @param {Object} payload     - Raw request body forwarded from the HTTP handler.
   * @param {Object} headers     - Raw request headers forwarded from the HTTP handler.
   *
   * @returns {Promise<{
   *   event: string,
   *   providerOrderId: string,
   *   providerPaymentId: string,
   *   status: string,
   *   raw: Object
   * }>}
   */
  async handleWebhook(payload, headers) {
    throw new Error('PaymentAdapterInterface.handleWebhook() must be implemented by a concrete adapter.');
  }
}

module.exports = PaymentAdapterInterface;
