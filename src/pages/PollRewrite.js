import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Redirect, Link } from 'react-router-dom'
import Header from '../components/Header'
import Preview from '../components/post/Preview'
import DatePickerCard from '../components/post/DatePickerCard'
import StatusBar from '../components/post/StatusBar'
import {
  Card,
  FormField,
  FormLabel,
  FormInput,
} from '../components/post/PostForm'
import { Button, ToggleButton } from '../components/styled-components'
import ImageUpload from '../components/post/ImageUpload'

import '../App.sass'
import 'bulma-checkradio/dist/css/bulma-checkradio.min.css'
import 'bulma-tagsinput/dist/css/bulma-tagsinput.min.css'
import Cookies from 'js-cookie'
import {
  fetchApiRequest,
  getClassYears,
  getSchools,
  formatDate,
} from '../utils/common'
import { colors } from '../utils/constants'

const PollPage = () => {
  const [state, setState] = useState({
    id: null,
    title: null,
    subtitle: null,
    organization: null,
    postUrl: null,
    detailLabel: null,
    comments: null,
    startDate: null,
    endDate: null,
    status: 'Not Submitted',
    seniorClassYear: getClassYears()[0],
    filters: {
      options: {
        enabled: false,
      },
      class: {
        year_0: false, // 2021
        year_1: false, // 2022
        year_2: false, // 2023
        year_3: false, // 2024
      },
      school: {
        WH: false,
        COL: false,
        EAS: false,
        NUR: false,
      },
    },
    filterOptions: null,
    isLive: false,
    isApproved: false,
    isSubmitted: false,
    isExpired: false,
    isAdmin: false,
    accountName: null,
    accountID: '',
    numOptions: 2,
    multiselect: false,
  })
  const [pollOptions, setPollOptions] = useState({ 0: '', 1: '' })
  const [imageUrl, setImageUrl] = useState('')

  const { id } = useParams()

  // helper function to set state
  const updateState = useCallback((newState) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  const updatePollOptions = useCallback((newState) => {
    setPollOptions((currentState) => ({ ...currentState, ...newState }))
  }, [])

  useEffect(() => {
    let accountID = Cookies.get('accountID')
    if (accountID) {
      fetchApiRequest(`account?account_id=${accountID}`, {})
        .then((res) => res.json())
        .then((data) => {
          updateState({
            accountID: accountID,
            isAdmin: data.account.is_admin,
            accountName: data.account.name,
          })
        })
    }
  }, [])

  useEffect(() => {
    if (id) {
      updateState({ isSubmitted: true })
    }
    // TODO: fill in poll data if submitted
  }, [id])

  console.log(pollOptions)
  console.log(state)

  const onSubmit = () => {
    if (!state.title) {
      alert('Please include a title.')
      return
    } else if (!state.startDate || !state.endDate) {
      alert('Please select a start and end date.')
      return
    }

    // TODO: check if no filters are checked and default to all checked.
    // also this has not been tested yet.
    fetchApiRequest(
      'polls',
      {
        method: 'POST',
        body: JSON.stringify({
          question: state.title,
          image_url: imageUrl,
          start_date: formatDate(state.startDate),
          expire_date: formatDate(state.endDate),
          approved: state.isApproved,
          expiration: formatDate(state.endDate),
          multiselect: state.multiselect,
          // TODO: what format should options be in
          // options: Object.values(state.pollOptions),
        }),
      },
      true
    ).then((res) => {
      if (res.status !== 200) {
        alert('Something went wrong. Please try again.')
      } else {
        alert('Poll submitted!')
      }
    })
  }

  const AddPollButton = () => {
    const addPollOption = () => {
      // maximum number of options = 6
      if (Object.keys(pollOptions).length < 6) {
        updateState({ numOptions: state.numOptions + 1 })
        updatePollOptions({
          [state.numOptions]: '',
        })
      }
    }

    return (
      <Button
        onClick={addPollOption}
        color={colors.MEDIUM_BLUE}
        style={{ margin: '0px 12px 0px 0px' }}
      >
        <span style={{ height: '35px', marginRight: '6px' }}>
          <i className="fas fa-plus"></i>
        </span>
        Add Option
      </Button>
    )
  }

  const DeletePollButton = ({ pollIndex }) => (
    <div
      onClick={() => {
        let oldOptions = pollOptions
        delete oldOptions[pollIndex]
        updatePollOptions(oldOptions)
      }}
    >
      <span
        className="icon is-small is-right"
        key={pollIndex}
        style={{
          height: '2em',
          borderLeft: '1px solid #e5e5e5',
          pointerEvents: 'initial',
          cursor: 'pointer',
        }}
      >
        <i className="fas fa-times"></i>
      </span>
    </div>
  )

  // TODO: remove `state.multiselect` when multiselect is implemented
  const AllowMultipleSelectionsCheckbox = () =>
    state.multiselect && (
      <div
        onClick={() =>
          updateState({
            multiselect: !state.multiselect,
          })
        }
        style={{ cursor: 'pointer' }}
      >
        {state.multiselect ? (
          <span style={{ height: '35px', marginRight: '6px' }}>
            <i
              className="fas fa-check-square"
              style={{ color: colors.MEDIUM_BLUE }}
            ></i>
          </span>
        ) : (
          <span style={{ height: '35px', marginRight: '6px' }}>
            <i
              className="fas fa-square"
              style={{ color: colors.LIGHT_GRAY }}
            ></i>
          </span>
        )}
        <span style={{ fontSize: '14px' }}>Allow Multiple Selections</span>
      </div>
    )

  const setCheckBoxState = (event) => {
    const id = event.target.id
    const name = event.target.name
    const checked = event.target.checked

    let filters = state.filters
    filters[name][id] = checked
    updateState({ filters: filters })
  }

  return (
    <>
      {!Cookies.get('accountID') && <Redirect to="/login" />}
      <Header isAdmin={state.isAdmin} />
      <div
        className="columns is-mobile"
        style={{ margin: '20px 0px 0px 91px' }}
      >
        <div className="column has-text-centered is-7">
          <ToggleButton post={false} />
          <div className="level">
            <div className="level-left is-size-4 has-text-left">
              <b>Poll Details</b>
            </div>
            <div className="level-right">
              <Button color={colors.RED} hide={!state.isSubmitted}>
                Delete
              </Button>
              <Button color={colors.GRAY}>Save</Button>
              <Button color={colors.GREEN} onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </div>
          <StatusBar
            isExpired={state.isExpired}
            isSubmitted={state.isSubmitted}
            isApproved={state.isApproved}
            isLive={state.isLive}
          />
          <Card title={'Content'}>
            <FormField label={'Question'}>
              <FormInput
                name={'title'}
                value={state.title}
                placeholder={
                  "Ex: What do you think about Penn's COVID response?"
                }
                updateState={updateState}
              />
            </FormField>
            <FormField label={'Upload Cover Image'}>
              <ImageUpload
                setImageUrl={setImageUrl}
                accountID={state.accountID}
              />
            </FormField>
            <FormField label={'Poll Options'}>
              {Object.entries(pollOptions).map(([key, value]) => (
                <div
                  key={key}
                  className="control has-icons-right"
                  style={{ marginBottom: '6px' }}
                >
                  <FormInput
                    name={key}
                    value={value}
                    placeholder={'Ex: Poll Option'}
                    updateState={updatePollOptions}
                  />
                  {key >= 2 && <DeletePollButton pollIndex={key} />}
                </div>
              ))}
              <div className="level">
                <div className="level-left">
                  <AddPollButton />
                  <AllowMultipleSelectionsCheckbox />
                </div>
              </div>
            </FormField>
          </Card>
          <Card title={'Dates'}>
            <DatePickerCard
              updateStartDate={(date) => updateState({ startDate: date })}
              updateEndDate={(date) => updateState({ endDate: date })}
            />
          </Card>
          <Card
            title={'Filters'}
            info={
              'If no filters are applied, the post will be shared with all Penn Mobile users by default.'
            }
          >
            <div className="columns">
              <div className="column is-3">
                <FormLabel>Class Year</FormLabel>
              </div>
              {getClassYears().map((year, i) => (
                <div className="column is-2" key={`year_${i}`}>
                  <label className="label">
                    <input
                      id={`year_${i}`}
                      type="checkbox"
                      checked={state.filters.class[`year_${i}`]}
                      name="class"
                      onChange={setCheckBoxState}
                    />
                    <FormLabel className="checkmark">{year}</FormLabel>
                  </label>
                </div>
              ))}
            </div>
            <div className="columns">
              <div className="column is-3">
                <FormLabel>School</FormLabel>
              </div>
              {Object.entries(getSchools).map(([abbr, school]) => (
                <div className="column is-2" key={abbr}>
                  <label className="label">
                    <input
                      id={abbr}
                      type="checkbox"
                      checked={state.filters.school[`school_${abbr}`]}
                      name="school"
                      onChange={setCheckBoxState}
                    />
                    <FormLabel className="checkmark">{school}</FormLabel>
                  </label>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title={'Notes'}
            info={
              'Portal administrators will see this message during the review process.'
            }
          >
            <div style={{ height: 94 }}>
              <textarea
                className="textarea is-small"
                type="text"
                name="comments"
                value={state.comments || ''}
                placeholder="Enter any comments here."
                rows="2"
                onChange={(e) => updateState({ comments: e.target.value })}
                style={{
                  border: 'solid 1px #e6e6e6',
                  height: 94,
                  fontSize: '14px',
                }}
              />
            </div>
          </Card>
        </div>
        <div className="column has-text-centered is-5">
          <Preview
            imageUrl={imageUrl}
            title={state.title}
            subtitle={state.subtitle}
            source={state.accountName}
            detailLabel={state.detailLabel}
          />
        </div>
      </div>
    </>
  )
}

export default PollPage
