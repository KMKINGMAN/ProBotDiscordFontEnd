import React, { useState, useEffect, useContext, useCallback } from 'react'
import axios from 'axios'
import strings from '../../scripts/locale'
import { Context } from '../../scripts/_context'
import Select from 'react-select'
import { CHANNELS_STYLES } from '@script/constants'
import { COUNTRIES } from '@script/constants'

// end checkout funtions
export default function CheckoutComForm({
  processing,
  paymentdata,
  paymentData,
  processPayment,
  checkoutForm,
  data,
  payText,
  coupon
}) {
  const { rtl, user } = useContext(Context)
  const [cardHolderName, setCardHolderName] = useState('')
  const [country, setCountry] = useState(COUNTRIES.find(country => country.code === user.country.toLowerCase()))
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const onCardTokenized = (event) => {
    console.log('TOKINZED ', event)
    if (!event || !event.token) return

    processPayment(event.token)
    axios
      .post(`/billing/checkout`, {
        items: [data],
        event,
        coupon
      })
      .then((response) => {
        console.log(typeof response.data, response.data)
        paymentData(response.data)
        processPayment(false)
      })
  }

  var logos = generateLogos()
  function generateLogos() {
    var logos = {}
    logos['card-number'] = {
      src: 'card',
      alt: 'card number logo'
    }
    logos['expiry-date'] = {
      src: 'exp-date',
      alt: 'expiry date logo'
    }
    logos['cvv'] = {
      src: 'cvv',
      alt: 'cvv logo'
    }
    return logos
  }

  var errors = {}
  errors['card-number'] = strings.billing_no_valid_code_number
  errors['expiry-date'] = strings.billing_no_expiry_date
  errors['cvv'] = strings.billing_no_valid_cvv

  function clearErrorMessage(el) {
    var selector = '.error-message__' + el
    var message = document.querySelector(selector)
    message.textContent = ''
  }

  function clearErrorIcon(el) {
    var logo = document.getElementById('icon-' + el + '-error')
    logo.style.removeProperty('display')
  }

  function showPaymentMethodIcon(parent, pm) {
    if (parent) parent.classList.add('show')

    var logo = document.getElementById('logo-payment-method')
    if (pm) {
      var name = pm.toLowerCase()
      logo.setAttribute('src', '/static/checkout/' + name + '.svg')
      logo.setAttribute('alt', pm || 'payment method')
    }
    logo.style.removeProperty('display')
  }

  function clearPaymentMethodIcon(parent) {
    if (parent) parent.classList.remove('show')

    var logo = document.getElementById('logo-payment-method')
    logo.style.setProperty('display', 'none')
  }

  function setErrorMessage(el) {
    var selector = '.error-message__' + el
    var message = document.querySelector(selector)
    message.textContent = errors[el]
  }

  function setDefaultIcon(el) {
    var selector = 'icon-' + el
    var logo = document.getElementById(selector)
    logo.setAttribute('src', '/static/checkout/' + logos[el].src + '.svg')
    logo.setAttribute('alt', logos[el].alt)
  }

  function setDefaultErrorIcon(el) {
    var selector = 'icon-' + el
    var logo = document.getElementById(selector)
    logo.setAttribute('src', '/static/checkout/' + logos[el].src + '-error.svg')
    logo.setAttribute('alt', logos[el].alt)
  }

  function setErrorIcon(el) {
    var logo = document.getElementById('icon-' + el + '-error')
    logo.style.setProperty('display', 'block')
  }

  function cardValidationChanged(event) {
    //let payButton = document.getElementById("pay-button");
    //payButton.disabled = !window.Frames.isCardValid();
  }

  function onCardTokenizationFailed(error) {
    console.log('CARD_TOKENIZATION_FAILED: %o', error)
    window.Frames.enableSubmitForm()
  }

  function paymentMethodChanged(event) {
    var pm = event.paymentMethod
    let container = document.querySelector('.icon-checkout.payment-method')

    if (!pm) {
      clearPaymentMethodIcon(container)
    } else {
      clearErrorIcon('card-number')
      showPaymentMethodIcon(container, pm)
    }
  }

  function onValidationChanged(event) {
    var e = event.element

    if (event.isValid || event.isEmpty) {
      if (e === 'card-number' && !event.isEmpty) {
        showPaymentMethodIcon()
      }
      setDefaultIcon(e)
      clearErrorIcon(e)
      clearErrorMessage(e)
    } else {
      if (e === 'card-number') {
        clearPaymentMethodIcon()
      }
      setDefaultErrorIcon(e)
      setErrorIcon(e)
      setErrorMessage(e)
    }
  }

  const [loaded, error] = useScript(
    'https://cdn.checkout.com/js/framesv2.min.js'
  )

  useEffect(() => {
    document.getElementById('pay-button')?.addEventListener('click', payOnClick)

    return () =>
      document
        .getElementById('pay-button')
        ?.removeEventListener('click', payOnClick)
  }, [cardHolderName, postalCode, city, country])

  const payOnClick = (event) => {
    event.preventDefault()
    window.Frames.cardholder = {
      name: cardHolderName,
      billingAddress: {
        zip: postalCode,
        city: city,
        country: country.code
      }
    }
    window.Frames.submitCard()
  }

  useEffect(() => {
    if (!loaded) return

    window.Frames.init({
      publicKey:
        process.env.NEXT_PUBLIC_API_URL.includes('localhost') ||
        process.env.NEXT_PUBLIC_API_URL.includes('staging')
          ? 'pk_test_fb581b09-2116-4e6a-90d3-2c9da345aeb4'
          : 'pk_0873c129-8fac-41e5-b7f6-808a4fab2487',
      localization: {
        cardNumberPlaceholder: strings.billing_card_number,
        expiryMonthPlaceholder: 'MM',
        expiryYearPlaceholder: 'YY',
        cvvPlaceholder: 'CVV'
      },
      style: {
        base: {
          color: '#25252C',
          fontSize: '16px',
          backgroundColor: '#1f1f25',
          textAlign: rtl ? 'end' : 'start',
          color: '#ffff'
        },
        valid: {
          color: '#57F287'
        },
        invalid: {
          color: '#ed4c5c'
        },
        placeholder: {
          base: {
            color: '#70707C',
            fontFamily: `Arial`,
            fontSize: '14px',
            fontWeight: '500'
          }
        }
      }
    })

    window.Frames.addEventHandler(
      window.Frames.Events.FRAME_VALIDATION_CHANGED,
      onValidationChanged
    )

    window.Frames.addEventHandler(
      window.Frames.Events.CARD_VALIDATION_CHANGED,
      cardValidationChanged
    )

    window.Frames.addEventHandler(
      window.Frames.Events.CARD_TOKENIZATION_FAILED,
      onCardTokenizationFailed
    )

    window.Frames.addEventHandler(
      window.Frames.Events.CARD_TOKENIZED,
      onCardTokenized
    )

    window.Frames.addEventHandler(
      window.Frames.Events.PAYMENT_METHOD_CHANGED,
      paymentMethodChanged
    )

    let form = document.getElementById('payment-form')

    form.addEventListener('submit', onSubmit)
    function onSubmit(event) {
      event.preventDefault()
    }

    return function () {
      window.Frames.removeEventHandler(
        window.Frames.Events.FRAME_VALIDATION_CHANGED,
        onValidationChanged
      )

      window.Frames.removeEventHandler(
        window.Frames.Events.CARD_VALIDATION_CHANGED,
        cardValidationChanged
      )

      window.Frames.removeEventHandler(
        window.Frames.Events.CARD_TOKENIZATION_FAILED,
        onCardTokenizationFailed
      )

      window.Frames.removeEventHandler(
        window.Frames.Events.CARD_TOKENIZED,
        onCardTokenized
      )

      window.Frames.removeEventHandler(
        window.Frames.Events.PAYMENT_METHOD_CHANGED,
        paymentMethodChanged
      )
    }
  }, [loaded])

  const [activate, setActivate] = useState(false)

  const setActivateHandler = (event) => {
    setActivate(true)
    setCardHolderName(event.target.value)
  }

  const countryFunction = (e) => {
    setCountry(COUNTRIES.find(country => country.code === e.value))
  }

  return (
    <div>
      {!paymentdata && !processing && loaded && !error && (
        <div>
          <form id="payment-form" method="POST" ref={checkoutForm}>
            <label className="control-label" htmlFor="card-number">
              {strings.billing_card_details}
            </label>
            <div className="input__checkout mt-5 d-flex card-number">
              <div className="card__show">
                <img id="logo-payment-method" className="logo-payment-method" />
                <div className="invalid__card" />
              </div>
              <img id="logo-payment-method" />
              <div className="card-number-frame w-100"></div>
              <div className="icon-checkout payment-method">
                <img
                  id="icon-card-number"
                  src="/static/checkout/card.svg"
                  alt="PAN"
                  style={{ opacity: 0 }}
                />
              </div>
              <div className="icon-checkout">
                <img
                  id="icon-card-number-error"
                  src="/static/checkout/error.svg"
                  style={{ opacity: 0 }}
                />
              </div>
            </div>

            <div className="date-and-code mt-10">
              <div className="input__checkout w-100 expiry-date">
                <div className="icon-checkout">
                  <img
                    id="icon-expiry-date"
                    src="/static/checkout/exp-date.svg"
                    alt="Expiry date"
                    style={{ opacity: 0, display: 'none' }}
                  />
                </div>
                <div className="expiry-date-frame"></div>
                <div className="icon-checkout">
                  <img
                    id="icon-expiry-date-error"
                    src="/static/checkout/error.svg"
                    style={{ opacity: 0, display: 'none' }}
                  />
                </div>
              </div>

              <div className="input__checkout w-100 ms-3 cvv">
                <div className="icon-checkout">
                  <img
                    id="icon-cvv"
                    style={{ opacity: 0, display: 'none' }}
                    src="/static/checkout/cvv.svg"
                    alt="CVV"
                  />
                </div>
                <div className="cvv-frame"></div>
                <div className="icon-checkout">
                  <img
                    id="icon-cvv-error"
                    style={{ opacity: 0 }}
                    src="/static/checkout/error.svg"
                  />
                </div>
              </div>
            </div>
            <div className="mt-20">
              <label className="control-label" htmlFor="expiry-date">
                {strings.billing_bill_to}
              </label>
              <div className="input__checkout">
                <input
                  className="card-name gfield"
                  id="checkout-card-name"
                  name="name"
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  aria-label="Name"
                  placeholder={strings.billing_card_name}
                  aria-placeholder="Name"
                  aria-invalid="false"
                  onClick={setActivateHandler}
                  onChange={(event) => setActivateHandler(event)}
                />
                <span className="required_tag">*</span>
              </div>

              {activate === true ? (
                <div className="billing__info">
                  <div className="d-flex" style={{ marginTop: '0.6rem' }}>
                    <div className="input__checkout d-flex align-items-center w-50">
                      <div
                        className="invalid__card bg-flag ms-3"
                        style={{
                          backgroundImage: `url('https://flagcdn.com/w20/${country.code}.png')`
                        }}
                      />
                      <Select
                        classNamePrefix="formselect countryselector"
                        placeholder={strings.select_placeholder_select}
                        styles={CHANNELS_STYLES}
                        value={{
                            label: country.name,
                            value: country.code
                          }
                        }
                        options={COUNTRIES.map((c) => ({
                          label: c.name,
                          value: c.code
                        }))}
                        onChange={(e) => countryFunction(e)}
                        className="w-100 country__selector"
                        menuPortalTarget={document.body}
                        noOptionsMessage={() => strings.no_option}
                      />
                      <span
                        className="required_tag"
                        style={{ marginTop: '.4rem' }}
                      >
                        *
                      </span>
                    </div>
                    <div className="input__checkout w-50 ms-3">
                      <input
                        className="card-name gfield"
                        id="checkout-card-name"
                        inputMode="text"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        aria-label="Name"
                        value={postalCode}
                        placeholder={strings.billing_postal_code}
                        aria-placeholder="Name"
                        aria-invalid="false"
                        onChange={(event) => setPostalCode(event.target.value)}
                      />
                    </div>
                  </div>
                  <div
                    className="input__checkout w-100"
                    style={{ marginTop: '0.6rem' }}
                  >
                    <input
                      className="card-name gfield"
                      id="checkout-card-name"
                      required={true}
                      inputMode="text"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      aria-label="Name"
                      placeholder={strings.billing_city}
                      aria-placeholder="Name"
                      onChange={(event) => setCity(event.target.value)}
                      aria-invalid="false"
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div>
              <span className="error-message error-message__card-number"></span>
              <span className="error-message error-message__expiry-date"></span>
              <span className="error-message error-message__cvv"></span>
            </div>

            {payText && (
              <button
                id="pay-button"
                className="pay-button mt-4 btn btn-primary btn-icon active"
              >
                {payText}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

// Hook
let cachedScripts = []
function useScript(src, onCardTokenized) {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    loaded: false,
    error: false
  })

  useEffect(
    () => {
      // If cachedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setState({
          loaded: true,
          error: false
        })
      } else {
        cachedScripts.push(src)

        // Create script
        let script = document.createElement('script')
        script.src = src
        script.async = true

        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setState({
            loaded: true,
            error: false
          })
        }

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src)
          if (index >= 0) cachedScripts.splice(index, 1)
          script.remove()

          setState({
            loaded: true,
            error: true
          })
        }

        script.addEventListener('load', onScriptLoad)
        script.addEventListener('error', onScriptError)

        // Add script to document body
        document.body.appendChild(script)

        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener('load', onScriptLoad)
          script.removeEventListener('error', onScriptError)
        }
      }
    },
    [src] // Only re-run effect if script src changes
  )

  return [state.loaded, state.error]
}
