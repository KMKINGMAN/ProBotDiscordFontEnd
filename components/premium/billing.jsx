import { useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import strings from '../../scripts/locale'
import RechargeAccountBalanceRow from './RechargeAccountBalanceRow'
import Checkout from './checkout'
import Modal from 'react-modal'
import { Context } from '@script/_context'
import CheckoutFullIframe from './method_checkout_full_iframe'
import Confirm from '@component/Confirm'
import { useContext } from 'react'
export default function Billing({ methods, setMethods, paymentHistory }) {
  const [update, setUpdate] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [addOpened, openAdd] = useState(false)
  const [pay_invoice, payInvoice] = useState(false)

  const [open, setOpen] = useState(false)

  const { rtl } = useContext(Context)

  const downloadInvoice = (id) => {
    const page = window.open('/pdf', '_blank')
    //	page.document.write('Loading pdf...');

    return axios({
      url: `/billing/invoice/${id}`, // download url
      method: 'get'
    })
      .then((response) => {
        const binaryString = window.atob(response.data)
        const binaryLen = binaryString.length
        const bytes = new Uint8Array(binaryLen)
        for (let i = 0; i < binaryLen; i++) {
          const ascii = binaryString.charCodeAt(i)
          bytes[i] = ascii
        }
        let blob = new Blob([bytes], { type: 'application/pdf' })
        let url = window.URL.createObjectURL(blob)

        page.location.href = url
      })
      .catch((err) => {
        page.document.write('error generating pdf...')
      })
  }

  const setDefault = (id) => {
    axios.put(`/billing/methods/${id}/default`).then((res) => {
      setMethods([...methods.map((m) => ({ ...m, default: m.id === id }))])
    })
  }
  const deleteMethod = (id) => {
    setDeleted({ ...deleted, loading: true })
    axios.delete(`/billing/methods/${id}`).then((res) => {
      setMethods([...methods.filter((m) => m.id !== id)])
      setDeleted(null)
    })
  }
  return (
    <>
      {deleted && (
        <Confirm
          title="are_you_sure"
          text={strings.formatString(
            strings.do_you_really,
            strings.formatString(
              strings.cc_ends_with,
              deleted.scheme,
              deleted.last4
            )
          )}
          show={deleted}
          onConfirm={() => deleteMethod(deleted.id)}
          onCancel={() => setDeleted(null)}
          loading={deleted.loading}
        />
      )}
      <h3 className="mt-4 mb-4 ">{strings.payment_methods}</h3>

      <RechargeAccountBalanceRow />
      {methods.map((method, index) => (
        <div key={index} className="black-container pa-15">
          <div className="d-flex align-items-center justify-content-between p-0">
            <p className="text-break mb-0">
              <span>
                {strings.formatString(
                  strings.cc_ends_with,
                  method.scheme,
                  method.last4
                )}
              </span>{' '}
              {method.default && (
                <span className="badge bg-info ms-1">
                  {strings.default?.toUpperCase()}
                </span>
              )}
            </p>
            {moment(
              `${method.expiry_year}-${method.expiry_month}`
            ).isBefore() ? (
              <span className="text-danger">{strings.expired}</span>
            ) : (
              <span className="text-muted">
                {strings.billing_card_expiry_date}: {method.expiry_month}/
                {method.expiry_year}
              </span>
            )}
            <div className="d-flex align-items-center gap-2">
              {!method.default && (
                <button
                  className="btn btn-primary"
                  onClick={() => setDefault(method.id)}
                >
                  {strings.default}
                </button>
              )}
              {moment(
                `${method.expiry_year}-${method.expiry_month}`
              ).isBefore() && (
                <button
                  onClick={() =>
                    setUpdate(update === method.id ? false : method.id)
                  }
                  className={`btn btn-primary ${
                    update === method.id ? 'active' : ''
                  }`}
                >
                  {strings.update}
                </button>
              )}
              <button
                className="btn btn-danger btn-icon"
                onClick={() => setDeleted(method)}
              >
                {strings.delete}
              </button>
            </div>
          </div>
          {update === method.id && (
            <>
              <CheckoutFullIframe payText={strings.billing_update_payment} />
            </>
          )}
        </div>
      ))}
      <button
        className={`btn ${
          addOpened ? 'btn-secondary' : 'btn-primary'
        } btn-icon mt-2 ms-1`}
        onClick={() => setOpen(true)}
      >
        {strings.billing_add_payment}
      </button>

      <Modal
        isOpen={open}
        className={`smallModal w-25 pt-5 p-4 modal__checkout postion-realtive bg-modal bg-command${
          rtl ? 'rtl' : ''
        }`}
        overlayClassName={'ReactModal__Overlay make-scroll-modal pt-20 pb-20'}
        ariaHideApp={false}
        parentSelector={() => document.getElementById('main')}
      >
        <button
          className="btn"
          style={{
            color: '#70707C',
            fontSize: '1.3rem',
            position: 'absolute',
            right: `${rtl ? '' : 0}`,
            left: `${rtl ? 0 : ''}`,
            margin: '0.2rem 1rem 0rem 0rem'
          }}
          onClick={() => setOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
        <h6 className="mt-10">{strings.billing_add_payment}</h6>
        <div className="mt-25">
          <CheckoutFullIframe payText={strings.billing_add_payment} />
        </div>
      </Modal>

      {paymentHistory.filter((p) => p.subtotal && p.status > 0).length ? (
        <>
          <h3 className="mt-4 mb-4 ">{strings.payment_history}</h3>
          {paymentHistory
            .filter((p) => p.subtotal && p.status > 0)
            // .map((i) => ({...i, status: 2}))
            .map((item, index) => (
              <div key={index} className="black-container pa-30">
                <div className="d-flex flex-row flex-wrap align-items-center justify-content-between gap-2 paymentHistory-child-m-width">
                  <div>{moment(item.created).format('YYYY/MM/DD')}</div>
                  <div>${item.total_with_discount || item.subtotal}</div>
                  <div>
                    <div
                      className={`capitalize-font badge ${
                        item.status === 1
                          ? 'bg-success'
                          : item.status === 5
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                    >
                      {item.status === 1
                        ? 'Paid'
                        : item.status === 5
                        ? 'Pending'
                        : 'Failed'}
                    </div>
                  </div>

                  <div style={{ width: '160px' }}>
                    {item.description || 'No description'}
                  </div>
                  <div className="d-flex gap-1">
                    {item.status === 2 && (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          payInvoice({ ...item.items[0], orderID: item.items[0].orderId })
                        }
                      >
                        {strings.pay_now}
                      </button>
                    )}
                    <button
                      className="btn btn-primary btn-icon"
                      onClick={() => downloadInvoice(item.id)}
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </>
      ) : (
        <></>
      )}
      <p className="mt-10">{strings.billing_note}</p>
      <Checkout open={pay_invoice} setOpen={payInvoice} />
    </>
  )
}