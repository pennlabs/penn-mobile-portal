import React, { useState } from 'react'
import { Columns } from 'react-bulma-components'
import styled from 'styled-components'
import moment from 'moment'
import colors from '../colors'

const Subtitle = styled.p`
  color: ${colors.GRAY};
  font-size: 10px;
  font-weight: bold;
`

const Card = styled.div`
  border-radius: 10px;
  margin: 12px 0px 24px 0px;
  box-shadow: 0 0 8px 3px #d9d9d9;
  padding: 24px 24px 24px 24px;
  background-color: ${colors.WHITE};
  cursor: pointer;
  border-left: ${(props) =>
    props.live ? 'solid #3FAA6D 12px' : 'solid #999999 12px'};
`

const AnalyticsBar = styled.hr`
  border-radius: ${(props) => (props.first ? '5px' : '0 5px 5px 0')};
  background-color: ${(props) => props.color};
  width: ${(props) => props.width + '%'};
  height: 6px;
  margin: 1rem 0 0.3rem 0;
  display: inline-block;
`

const CaptionDiv = styled.div`
  background-color: ${colors.LIGHT_BLUE};
  box-shadow: 0 0 8px #d9d9d9;
  position: absolute;
  padding: 0.25rem;
  font-size: 12px;
  border-radius: 3px;
  z-index: 10;
  margin-top: 0.3rem;
  &:after {
    bottom: 100%;
    left: 15%;
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    border-color: rgba(211, 227, 245, 0);
    border-bottom-color: ${colors.LIGHT_BLUE};
    border-width: 10px;
    margin-left: -10px;
  }
`

//returns Month Day, Year string from Date Object (ex: Jan 01, 2020)
const formatDate = (date) => {
  let dateString = date.toString()
  return dateString.slice(4, 10) + ', ' + dateString.slice(11, 15)
}

const formatTime = (date) => {
  return moment(date, 'HH:mm').format('hh:mm A')
}

const AnalyticsCard = ({ post, live }) => {
  const [hover, setHover] = useState(false)

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      live={live}
    >
      <Columns vCentered={true}>
        <Columns.Column>
          <p className="has-text-weight-medium">
            {formatDate(post.publishDate)}
          </p>
          <Subtitle>{formatTime(post.publishDate)}</Subtitle>
        </Columns.Column>
        <Columns.Column size={6}>
          <Columns vCentered={true}>
            <img src={post.imageUrl} alt="post" width={125} height={50} />
            <Columns.Column>
              <b>{post.title}</b>
              <Subtitle>
                {live
                  ? 'Expires ' + formatDate(post.endDate)
                  : 'Expired ' + formatDate(post.endDate)}
              </Subtitle>
            </Columns.Column>
          </Columns>
        </Columns.Column>
        <Columns.Column>
          <p className="has-text-weight-medium">
            {post.analytics ? post.analytics.impressions : '0'}
          </p>
          {post.analytics && (
            <>
              <AnalyticsBar
                color={colors.RED}
                first={true}
                width={
                  (post.analytics.uniqueImpressions /
                    post.analytics.impressions) *
                  100
                }
              />
              <AnalyticsBar
                color={colors.YELLOW}
                first={false}
                width={
                  99 -
                  (post.analytics.uniqueImpressions /
                    post.analytics.impressions) *
                    100
                }
              />
              {hover && (
                <CaptionDiv>
                  <b>
                    {post.analytics.uniqueImpressions +
                      ' Unique / ' +
                      post.analytics.impressions +
                      ' Total'}
                  </b>
                </CaptionDiv>
              )}
            </>
          )}
        </Columns.Column>
        <Columns.Column>
          <p className="has-text-weight-medium">
            {post.analytics
              ? (
                  (post.analytics.interactions * 100) /
                  post.analytics.impressions
                ).toFixed(2) + '%'
              : '0'}
          </p>
          {post.analytics && (
            <>
              <AnalyticsBar
                color={colors.PURPLE}
                first={true}
                width={
                  (post.analytics.interactions / post.analytics.impressions) *
                  100
                }
              />
              <AnalyticsBar
                color={colors.YELLOW}
                first={false}
                width={
                  99 -
                  (post.analytics.interactions / post.analytics.impressions) *
                    100
                }
              />
              {hover && (
                <CaptionDiv>
                  <b>
                    {post.analytics.interactions +
                      ' Clicks / ' +
                      post.analytics.impressions +
                      ' Views'}
                  </b>
                </CaptionDiv>
              )}
            </>
          )}
        </Columns.Column>
      </Columns>
    </Card>
  )
}

export default AnalyticsCard
