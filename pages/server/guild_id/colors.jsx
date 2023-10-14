import { useContext, useState, useRef } from 'react'
import { Context } from '@script/_context'
import strings from '@script/locale'
import ProUploader from '@component/prouploader'
import PagesTitle from '@component/PagesTitle'
import Unsaved from '@component/unsaved'
import Command from '@component/Command'
import style from '@style/colors.module.css'
import Onboarding from '../../../components/ui/onboarding'
import OnboardingImg from '../../../public/static/landing/colorsset.svg'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalDescription,
  ModalTitle,
  ModalFooter,
  ModalClose
} from '../../../components/ui/modal'
import { Button } from '../../../components/ui/button'
import button from '../../../components/ui/button'
import bahyButton from '../../../components/ui/button'
import ColorsSetItem from '../../../components/colors/ColorsSetItem'
import axios from 'axios'
import Link from 'next/link'

export default function Colors() {
  const { guild, setGuild } = useContext(Context)
  const [selectedSet, setSelectedSet] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [state, setStates] = useState(guild?.colors || {})
  const [Loading, setLoading] = useState(false)
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  const COLORS_SET = [
    {
      id: 1,
      title: 'Monochrome',
      colors: [
        '#FFFFFF',
        '#F2F2F2',
        '#CCCCCC',
        '#BFBFBF',
        '#999999',
        '#7F7F7F',
        '#666666',
        '#4C4C4C',
        '#333333',
        '#191919',
        '#000000'
      ]
    },
    {
      id: 2,
      title: 'Glow Sun',
      colors: [
        '#ff7b00',
        '#ff8800',
        '#ff9500',
        '#ffa200',
        '#ffaa00',
        '#ffb700',
        '#ffc300',
        '#ffd000',
        '#ffdd00',
        '#ffea00',
        '#fff75e',
        '#fff056',
        '#ffe94e',
        '#ffe246',
        '#ffda3d',
        '#ffd53e',
        '#fecf3e',
        '#fdc43f',
        '#fdbe39',
        '#fdb833'
      ]
    },
    {
      id: 3,
      title: 'Natural Lake',
      colors: [
        '#d9ed92',
        '#b5e48c',
        '#99d98c',
        '#76c893',
        '#52b69a',
        '#34a0a4',
        '#168aad',
        '#1a759f',
        '#1e6091',
        '#184e77'
      ]
    },
    {
      id: 4,
      title: 'Tea Tree',
      colors: [
        '#cb997e',
        '#ddbea9',
        '#ffe8d6',
        '#b7b7a4',
        '#a5a58d',
        '#6b705c',
        '#ccd5ae',
        '#e9edc9',
        '#fefae0',
        '#faedcd'
      ]
    },
    {
      id: 5,
      title: 'Forest Theme',
      colors: [
        '#b7e4c7',
        '#95d5b2',
        '#74c69d',
        '#52b788',
        '#40916c',
        '#2d6a4f',
        '#1b4332',
        '#99e2b4',
        '#88d4ab',
        '#78c6a3',
        '#67b99a',
        '#56ab91',
        '#469d89',
        '#358f80',
        '#248277',
        '#14746f',
        '#036666'
      ]
    },
    {
      id: 6,
      title: 'Violet Theme',
      colors: [
        '#dac3e8',
        '#d2b7e5',
        '#c19ee0',
        '#b185db',
        '#a06cd5',
        '#9163cb',
        '#815ac0',
        '#7251b5',
        '#6247aa',
        '#7960BB'
      ]
    },
    {
      id: 7,
      title: 'Red Blood',
      colors: [
        '#641220',
        '#6e1423',
        '#85182a',
        '#a11d33',
        '#a71e34',
        '#b21e35',
        '#bd1f36',
        '#c71f37',
        '#da1e37',
        '#e01e37'
      ]
    },
    {
      id: 8,
      title: 'Atlantic Ocean',
      colors: [
        '#D2EAFF',
        '#bbdefb',
        '#90caf9',
        '#64b5f6',
        '#42a5f5',
        '#2196f3',
        '#1e88e5',
        '#1976d2',
        '#1565c0',
        '#0d47a1'
      ]
    },
    {
      id: 9,
      title: 'Pinky Candy',
      colors: [
        '#ffc4d6',
        '#ffa6c1',
        '#ff87ab',
        '#ff5d8f',
        '#ff97b7',
        '#ffacc5',
        '#ffcad4',
        '#f4acb7',
        '#ec91d8',
        '#ffaaea',
        '#ffbeef',
        '#ffd3da',
        '#e9d3d0'
      ]
    },
    {
      id: 10,
      title: 'Safari',
      colors: [
        '#582f0e',
        '#7f4f24',
        '#936639',
        '#a68a64',
        '#b6ad90',
        '#c2c5aa',
        '#a4ac86',
        '#656d4a',
        '#414833',
        '#333d29'
      ]
    },
    {
      id: 11,
      title: 'Imperial',
      colors: [
        '#f94144',
        '#f3722c',
        '#f8961e',
        '#f9844a',
        '#f9c74f',
        '#90be6d',
        '#43aa8b',
        '#4d908e',
        '#577590',
        '#277da1'
      ]
    }
  ]

  const applyColors = (index) => {
    setLoading(true)
    const selectedColor = COLORS_SET.find((color) => color.id === index)
    axios
      .put(`/guilds/${guild.id}/colors`, {
        title: selectedColor.title,
        id: selectedColor.id,
        colors: selectedColor.colors,
        colorset: true
      })
      .then(() => {
        setGuild({
          ...guild,
          ['colors']: {
            title: selectedColor.title,
            id: selectedColor.id,
            colors: selectedColor.colors,
            colorset: true
          }
        })
        setModalOpen(false)
        setLoading(false)
      })
  }

  return (
    <>
      <PagesTitle
        data={{
          name: 'Colors',
          description: 'Colors SS',
          module: 'colors'
        }}
      />
      <Unsaved
        method="colors"
        state={state}
        setStates={setState}
        default={{
          title: 'Color List',
          shape: 1,
          background_type: 1

          // //  ----***---- new stuff ----***----
          // colorset: false,
          // id: null,
          // colors: []
        }}
      />

      {/* CONFIRMATION MODAL */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {selectedSet?.title &&
                strings.formatString(
                  strings.colorset_title_modal,
                  selectedSet?.title
                )}
            </ModalTitle>
            <ModalDescription>
              {strings.colorset_description_modal}{' '}
              <Link
                href={'https://docs.probot.io/docs/modules/colors'}
                target={'_blank'}
                className="tw-text-[#3EA6FF] hover:tw-underline"
              >
                {strings.feautres_learn_more}
              </Link>
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose>
              <Button intent={'secondary'} className="sm:tw-w-full">
                {strings.cancel}
              </Button>
            </ModalClose>

            <Button
              intent={'primary'}
              isLoading={Loading}
              className={'sm:tw-w-full'}
              onClick={() => applyColors(selectedSet.id)}
            >
              {strings.apply}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="form-wrap">
        <form role="form" className="form-horizontal">
          <div className={`${style.row} mt-5`}>
            <div>
              <label className="control-label" htmlFor="COLORS_LIST_TITLE">
                {strings.COLORS_LIST_TITLE}
              </label>
              <input
                id="COLORS_LIST_TITLE"
                placeholder={strings.COLORS_LIST_TITLE}
                type="text"
                className="form-control"
                value={state.title}
                onChange={(val) => setState({ title: val.target.value })}
              />
            </div>

            <div>
              <label className="control-label" htmlFor="COLORS_SHAPE">
                {strings.COLORS_SHAPE}
              </label>
              <select
                id="COLORS_SHAPE"
                className="form-control"
                onChange={(event) => {
                  setState({ shape: parseInt(event.target.value, 10) })
                }}
                value={state.shape}
              >
                <option value={1}>{strings.SQUIRCLE}</option>
                <option value={2}>{strings.CIRCLE}</option>
              </select>
            </div>
          </div>
          <div className={`${style.row} mt-10`}>
            <div>
              <label className="control-label" htmlFor="COLORS_BACKGROUND">
                {strings.COLORS_BACKGROUND}
              </label>
              <select
                id="COLORS_BACKGROUND"
                className="form-control"
                onChange={(event) => {
                  setState({
                    background_type: parseInt(event.target.value, 10)
                  })
                }}
                value={state.background_type}
              >
                <option value={1}>{strings.Transparent}</option>
                <option value={2}>{strings.SPECIFIC_BACKGROUND}</option>
              </select>
            </div>

            <div>
              {state.background_type === 2 && (
                <>
                  <label className="control-label" htmlFor="UPLOAD">
                    {strings.UPLOAD}
                  </label>
                  <div className={style.upload}>
                    <ProUploader
                      id={guild.id}
                      type="guild"
                      module="colors"
                      value={state.background}
                      onCancel={() => setState({ background: null })}
                      onChange={(value) => setState({ background: value })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
        <Command name="color" />
        <Command name="colors" />
      </div>
      <hr className="line tw-mt-6 tw-rounded tw-opacity-100" />
      <div>
        <Onboarding
          title={strings.color_set_title}
          text={strings.color_set_onboard_description}
          item={'color_sets'}
        >
          <label className="control-label">color sets</label>
        </Onboarding>
        <div className="tw-mt-1 tw-grid tw-grid-cols-4 tw-gap-4 xl:tw-grid-cols-2 lg:tw-grid-cols-3 sm:tw-grid-cols-1">
          {COLORS_SET.map((c, index) => {
            return (
              <ColorsSetItem
                title={c.title}
                key={index}
                isActive={state.id === c.id}
                colors={c.colors || state?.colors}
                randomColors={c.randomColors}
                handleRandom={() => handleGenerateColors()}
                onClick={
                  state.id === c.id
                    ? null
                    : () =>
                        setSelectedSet(
                          {
                            title: c.title,
                            id: c.id,
                            colors: c.colors,
                            colorset: true
                          },
                          setModalOpen(true)
                        )
                }
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
