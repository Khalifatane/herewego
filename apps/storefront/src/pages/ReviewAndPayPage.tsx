import { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import reviewAndPayData from '@/data/review-and-pay.json'
import OrderSummaryCard from '@/components/OrderSummaryCard'
import { buildReviewSnapshot, loadCheckoutDraft, saveReviewOrder } from '@/lib/checkout.js'
import { useCart } from '@/hooks/useCart'

export default function ReviewAndPayPage() {
  const navigate = useNavigate()
  const draft = (loadCheckoutDraft() || {}) as Record<string, any>
  const { steps, backLink, sections, orderSummary, payButton } = reviewAndPayData
  const { formattedTotal } = useCart()
  const shippingAddressSection = sections.find((section) => section.type === 'shippingAddress') as any
  const shippingMethodSection = sections.find((section) => section.type === 'shippingMethod') as any
  const contactSection = sections.find((section) => section.type === 'contactDetails') as any
  const paymentSection = sections.find((section) => section.type === 'payment') as any

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const paymentMethod = String(formData.get('payment') || draft.paymentMethod || 'Card')
    const reviewSnapshot = buildReviewSnapshot(draft, paymentMethod)

    saveReviewOrder(reviewSnapshot)
    navigate('/order-confirmation')
  }

  const shippingAddress = {
    name: draft.fullName || shippingAddressSection?.address?.name || '',
    street: [draft.address1, draft.address2].filter(Boolean).join(', ') || shippingAddressSection?.address?.street || '',
    city: draft.city || shippingAddressSection?.address?.city || '',
    state: draft.state || shippingAddressSection?.address?.state || '',
    country: draft.country || shippingAddressSection?.address?.country || '',
    phone: draft.phone || shippingAddressSection?.address?.phone || '',
  }

  const shippingMethodLabel = draft.shippingMethodLabel || shippingMethodSection?.method?.label || ''
  const shippingMethodPrice = Number(draft.shippingAmount || 0) > 0 ? '1 500 FCFA' : shippingMethodSection?.method?.price || 'Calculated at checkout'
  const email = draft.email || contactSection?.email || ''
  const savedMethods = paymentSection?.savedMethods || []
  const otherMethods = paymentSection?.otherMethods || []
  const payButtonLabel = `Pay ${formattedTotal}`

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-8 text-sm">
        {steps.map((step, i) => (
          <span key={i} className={`${step.current ? 'text-black font-medium' : 'text-gray-400'}`}>
            {i > 0 && <span className="mr-4 text-gray-300">&gt;</span>}
            {step.label}
          </span>
        ))}
      </div>

      <Link to={backLink.href} className="text-sm text-gray-600 hover:text-black mb-6 inline-block">
        &larr; {backLink.label}
      </Link>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-12" onSubmit={handleSubmit}>
        {/* Review Sections */}
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <Link to={'editLink' in section ? (section as any).editLink : '#'} className="text-sm text-gray-500 hover:text-black">
                  Edit
                </Link>
              </div>

              {section.type === 'shippingAddress' && 'address' in section && (
                <div className="text-sm text-gray-600">
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.street}</p>
                  <p>{shippingAddress.city}</p>
                  <p>{shippingAddress.state}</p>
                  <p>{shippingAddress.country}</p>
                  <p className="mt-2">{shippingAddress.phone}</p>
                </div>
              )}

              {section.type === 'shippingMethod' && 'method' in section && (
                <div className="text-sm">
                  <span>{shippingMethodLabel}</span>
                  <span className="ml-2 font-medium">{shippingMethodPrice}</span>
                </div>
              )}

              {section.type === 'contactDetails' && 'email' in section && (
                <p className="text-sm text-gray-600">{email}</p>
              )}

              {section.type === 'payment' && 'savedMethods' in section && (
                <div className="space-y-3">
                  {savedMethods.map((method: any) => (
                    <label key={method.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method.type}
                        defaultChecked={draft.paymentMethod ? draft.paymentMethod === method.type : method.selected}
                        className="accent-black"
                      />
                      <span className="text-sm font-medium">{method.type}</span>
                      <span className="text-sm text-gray-500">**** {method.last4}</span>
                      <span className="text-sm text-gray-400 ml-auto">{method.expiry}</span>
                    </label>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-500 mb-2">Other methods</p>
                    <div className="space-y-2">
                      {otherMethods.map((method: any) => (
                        <label key={method.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value={method.label}
                            defaultChecked={draft.paymentMethod === method.label}
                            className="accent-black"
                          />
                          <span className="text-sm">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            {payButtonLabel || payButton}
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummaryCard
            editCartLink={orderSummary.editCartLink}
            currency={orderSummary.currency}
            estimatedTaxLabel={orderSummary.estimatedTax}
            promoPlaceholder={orderSummary.promoCode.placeholder}
            promoButtonText={orderSummary.promoCode.buttonText}
          />
        </div>
      </form>
    </main>
  )
}
